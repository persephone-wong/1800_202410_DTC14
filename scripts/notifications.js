// Description: This file contains the JavaScript code for the notifications page

document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  let currentUser;

  let hasTodayNotifications = false;
  let hasLast7DaysNotifications = false;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      fetchAndDisplayFriendRequests();
      fetchAndDisplayActivities();
    }
  });

  // Fetch and display friend requests
  function fetchAndDisplayFriendRequests() {
    currentUser.get().then((doc) => {
      const userData = doc.data();
      // Get the received friend requests
      const receivedFriendRequests = userData.received_friend_requests || [];

      // If there are friends requests, display
      if (receivedFriendRequests.length > 0) {
        const userId = receivedFriendRequests[0];
        db.collection("users")
          .doc(userId)
          .get()
          .then((userDoc) => {
            const userName = userDoc.data().name;
            displayFriendRequest(userName, userId);

            // If there are more than one friend requests, display the count
            if (receivedFriendRequests.length > 1) {
              document.getElementById(
                "additional-friend-requests-count"
              ).textContent = `and ${receivedFriendRequests.length - 1} more`;
            }
            // Update the friend requests icon to show the count
            document
              .querySelector(".d-flex.align-items-center i.material-icons")
              .parentNode.setAttribute("href", "friend_requests.html");
          });
      }
    });
  }

  // Display friend request
  function displayFriendRequest(name, userId) {
    let template = document
      .getElementById("friend-request-template")
      .content.cloneNode(true);
    template.querySelector("strong").textContent = name;
    const buttons = template.querySelectorAll("button");
    buttons.forEach((button) => button.setAttribute("data-uid", userId));
    document
      .getElementById("friend-requests")
      .appendChild(document.importNode(template, true));
  }

  // Fetch and display activities
  function fetchAndDisplayActivities() {
    currentUser.get().then((doc) => {
      const userData = doc.data();
      const friendsList = userData.list_of_friends || [];
      fetchAndDisplayReviews(friendsList);
      fetchAndDisplayCheckIns(friendsList);
    });
  }

  // Format the notification date
  function formatNotificationDate(timestamp) {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const yesterdayStart = new Date(todayStart.getTime() - 86400000); // 24 hours before today
    const notificationDate = timestamp.toDate();

    if (notificationDate >= todayStart) {
      // Today: Show time only
      return notificationDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (notificationDate >= yesterdayStart) {
      // Yesterday: Show "Yesterday, time"
      return `Yesterday, ${notificationDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      // Last 7 days: Show "Date, time"
      return `${notificationDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}, ${notificationDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }
  }

  // Prepend the notification to the container
  function prependNotification(containerId, notificationElement) {
    const container = document.getElementById(containerId);
    container.insertBefore(notificationElement, container.firstChild);
  }

  // Fetch and display reviews
  async function fetchAndDisplayReviews(friendsList) {
    const now = new Date();
    // Get the date one week ago
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    let hasNotifications = false;

    // Get reviews from the last 7 days
    const reviewsSnapshot = await db
      .collection("reviews")
      .where(
        "timestamp",
        ">=",
        firebase.firestore.Timestamp.fromDate(oneWeekAgo)
      )
      .orderBy("timestamp", "desc")
      .get();

      //  Iterate through each review
    reviewsSnapshot.docs.forEach(async (doc) => {
      const review = doc.data();
      if (friendsList.includes(review.userID)) {
        hasNotifications = true;
        const userDoc = await db.collection("users").doc(review.userID).get();
        const eventDoc = await db
          .collection("events")
          .doc(review.eventDocID)
          .get();

          // Check if the user and event documents exist
        if (userDoc.exists && eventDoc.exists) {
          const userName = userDoc.data().name;
          const eventName = eventDoc.data().name;
          displayReviewNotification(
            userName,
            eventName,
            review.timestamp,
            review.eventDocID
          );
        }
      }
    });

    // If there are no reviews or notifications, display a message
    reviewsSnapshot.empty || !hasNotifications
      ? displayNoNotificationsMessage()
      : hideNoNotificationsMessage();
  }

  // Display review notification
  function displayReviewNotification(userName, eventName, timestamp, eventId) {
    let template = document
      .getElementById("review-template")
      .content.cloneNode(true);
      // Format the date and time
    const formattedDateTime = formatNotificationDate(timestamp);

    // Update the notification content
    template.querySelector(
      "strong"
    ).textContent = `${userName} left a review for ${eventName} on ${formattedDateTime}.`;
    template.querySelector(
      ".event-redirect-link"
    ).href = `/event.html?id=${eventId}`;

    // Determine the container ID
    const containerId = determineContainerId(timestamp);
    // Check if the notification is for today or the last 7 days
    // Update the hasTodayNotifications and hasLast7DaysNotifications variables
    if (containerId === "today-container") {
      hasTodayNotifications = true;
    } else if (containerId === "last-7-days-container") {
      hasLast7DaysNotifications = true;
    }

    // Prepend the notification to the container
    const notificationElement = document.importNode(template, true);
    prependNotification(containerId, notificationElement);
  }


  // Fetch and display check-ins
  async function fetchAndDisplayCheckIns(friendsList) {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    // Get check-ins from the last 7 days
    const checkInsSnapshot = await db
      .collection("checkins")
      .where(
        "timestamp",
        ">=",
        firebase.firestore.Timestamp.fromDate(oneWeekAgo)
      )
      .orderBy("timestamp", "desc")
      .get();
    
    // Check if the user has notifications
    let hasNotifications = false;


    // Iterate through each check-in
    checkInsSnapshot.docs.forEach(async (doc) => {
      const checkIn = doc.data();
      // Check if the user is in the friends list
      if (friendsList.includes(checkIn.userID)) {
        hasNotifications = true;
        const userDoc = await db.collection("users").doc(checkIn.userID).get();
        const eventDoc = await db
          .collection("events")
          .doc(checkIn.eventDocID)
          .get();

        // Check if the user and event documents exist
        if (userDoc.exists && eventDoc.exists) {
          const userName = userDoc.data().name;
          const eventName = eventDoc.data().name;
          displayCheckInNotification(
            userName,
            eventName,
            checkIn.timestamp,
            checkIn.eventDocID
          );
        }
      }
    });

    // If there are no check-ins or notifications, display a message
    checkInsSnapshot.empty || !hasNotifications
      ? displayNoNotificationsMessage()
      : hideNoNotificationsMessage();
  }

  // Display check-in notification
  function displayCheckInNotification(userName, eventName, timestamp, eventId) {
    let template = document
      .getElementById("check-in-template")
      .content.cloneNode(true);
    const formattedDateTime = formatNotificationDate(timestamp);

    template.querySelector(
      "strong"
    ).textContent = `${userName} checked into ${eventName} on ${formattedDateTime}.`;
    template.querySelector(
      ".event-redirect-link"
    ).href = `/event.html?id=${eventId}`;

    // Determine the container ID
    const containerId = determineContainerId(timestamp);
    if (containerId === "today-container") {
      hasTodayNotifications = true;
    } else if (containerId === "last-7-days-container") {
      hasLast7DaysNotifications = true;
    }
    // Prepend the notification to the container
    const notificationElement = document.importNode(template, true);
    prependNotification(containerId, notificationElement);
  }

  // Determine the container ID based on the timestamp
  function determineContainerId(timestamp) {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const weekAgo = new Date(todayStart.getTime() - 7 * 86400000); // 7 days before today

    // Check if the notification date is today, in the last 7 days, or older
    const notificationDate = timestamp.toDate();
    return notificationDate >= todayStart
      ? "today-container"
      : notificationDate >= weekAgo
      ? "last-7-days-container"
      : "older-notifications-container"; // Assuming you might want to categorize older notifications
  }

  // Display the "No notifications" message
  function displayNoNotificationsMessage() {
    document.getElementById("no-notifications-placeholder").style.display =
      "block";
  }

  // Hide the "No notifications" message
  function hideNoNotificationsMessage() {
    document.getElementById("no-notifications-placeholder").style.display =
      "none";
  }
});

// Accept friend request
async function acceptFriendRequest(event, element) {
  event.preventDefault(); // stop the link from causing the page to scroll to the top

  // Extract the friend's ID from the element
  const friendId = element.dataset.uid;
  console.log("Friend ID:", friendId);

  const user = firebase.auth().currentUser; // define 'user' by getting the current user
  if (!user) {
    console.error("No user logged in");
    return;
  }

  try {
    // Add the friend to the current user's list of friends
    await db
      .collection("users")
      .doc(user.uid)
      .update({
        received_friends_requests:
          firebase.firestore.FieldValue.arrayRemove(friendId),
      });

    await db
    // Remove the friend from the current user's received_friend_requests array
      .collection("users")
      .doc(friendId)
      .update({
        sent_friend_requests: firebase.firestore.FieldValue.arrayRemove(
          user.uid
        ),
      });

    await db
    // Remove the friend from the current user's received_friend_requests array
      .collection("users")
      .doc(user.uid)
      .update({
        received_friend_requests:
          firebase.firestore.FieldValue.arrayRemove(friendId),
      });

    await db
    // Add the friend to the current user's list_of_friends array
      .collection("users")
      .doc(user.uid)
      .update({
        list_of_friends: firebase.firestore.FieldValue.arrayUnion(friendId),
      });

    await db
    // Add the current user to the friend's list_of_friends array
      .collection("users")
      .doc(friendId)
      .update({
        list_of_friends: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });

    console.log("Friend request accepted successfully!");
    // Locate the closest parent .list-group-item and remove it
    const listItem = element.closest(".list-group-item");
    if (listItem) {
      listItem.innerHTML = `<p>You are now friends.</p>`;
      setTimeout(() => listItem.remove(), 3000);
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
    element.innerHTML = "<p>Error accepting friend request.</p>";
  }
}

// Delete friend request
async function deleteFriendRequest(event, element) {
  event.preventDefault(); // stop the link from causing the page to scroll to the top

  // Extract the friend's ID from the element
  const friendId = element.dataset.uid;
  console.log("Friend ID:", friendId);

  const user = firebase.auth().currentUser; //  define 'user'
  if (!user) {
    console.error("No user logged in");
    return;
  }

  try {
    // Remove the friend from the current user's received_friend_requests array
    await db
      .collection("users")
      .doc(user.uid)
      .update({
        received_friend_requests:
          firebase.firestore.FieldValue.arrayRemove(friendId),
      });

    console.log("Friend request deleted successfully.");
    // Locate the closest parent .list-group-item and remove it
    const listItem = element.closest(".list-group-item");
    if (listItem) {
      listItem.innerHTML = `<p>You have declined this friend request.</p>`;
      setTimeout(() => listItem.remove(), 3000);
    }
  } catch (error) {
    console.error("Error deleting friend request:", error);
    element.innerHTML = "<p>Error deleting friend request.</p>";
  }

  function adjustNotificationsDisplay() {
    if (!hasTodayNotifications) {
      document.getElementById("today-label").style.display = "none";
      document.getElementById("today-container").style.display = "none";
    }
    if (!hasLast7DaysNotifications) {
      document.getElementById("last-7-days-label").style.display = "none";
      document.getElementById("last-7-days-container").style.display = "none";
    }
    if (!hasTodayNotifications && !hasLast7DaysNotifications) {
      displayNoNotificationsMessage();
    } else {
      hideNoNotificationsMessage();
    }
  }
}
