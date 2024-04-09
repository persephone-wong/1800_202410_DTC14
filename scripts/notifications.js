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

  function fetchAndDisplayFriendRequests() {
    currentUser.get().then((doc) => {
      const userData = doc.data();
      const receivedFriendRequests = userData.received_friend_requests || [];

      if (receivedFriendRequests.length > 0) {
        const userId = receivedFriendRequests[0];
        db.collection("users")
          .doc(userId)
          .get()
          .then((userDoc) => {
            const userName = userDoc.data().name;
            displayFriendRequest(userName, userId);

            if (receivedFriendRequests.length > 1) {
              document.getElementById(
                "additional-friend-requests-count"
              ).textContent = `and ${receivedFriendRequests.length - 1} more`;
            }
            document
              .querySelector(".d-flex.align-items-center i.material-icons")
              .parentNode.setAttribute("href", "friend_requests.html");
          });
      }
    });
  }

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

  function fetchAndDisplayActivities() {
    currentUser.get().then((doc) => {
      const userData = doc.data();
      const friendsList = userData.list_of_friends || [];
      fetchAndDisplayReviews(friendsList);
      fetchAndDisplayCheckIns(friendsList);
    });
  }

  function formatNotificationDate(timestamp) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000); // 24 hours before today
    const notificationDate = timestamp.toDate();
  
    if (notificationDate >= todayStart) {
      // Today: Show time only
      return notificationDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else if (notificationDate >= yesterdayStart) {
      // Yesterday: Show "Yesterday, time"
      return `Yesterday, ${notificationDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      // Last 7 days: Show "Date, time"
      return `${notificationDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${notificationDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  function prependNotification(containerId, notificationElement) {
    const container = document.getElementById(containerId);
    container.insertBefore(notificationElement, container.firstChild);
  }
  

  async function fetchAndDisplayReviews(friendsList) {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    let hasNotifications = false;

    const reviewsSnapshot = await db
      .collection("reviews")
      .where(
        "timestamp",
        ">=",
        firebase.firestore.Timestamp.fromDate(oneWeekAgo)
      )
      .orderBy("timestamp", "desc")
      .get();

    reviewsSnapshot.docs.forEach(async (doc) => {
      const review = doc.data();
      if (friendsList.includes(review.userID)) {
        hasNotifications = true;
        const userDoc = await db.collection("users").doc(review.userID).get();
        const eventDoc = await db
          .collection("events")
          .doc(review.eventDocID)
          .get();

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

    reviewsSnapshot.empty || !hasNotifications
      ? displayNoNotificationsMessage()
      : hideNoNotificationsMessage();
  }

  function displayReviewNotification(userName, eventName, timestamp, eventId) {
    let template = document.getElementById("review-template").content.cloneNode(true);
    const formattedDateTime = formatNotificationDate(timestamp);
  
    template.querySelector("strong").textContent = `${userName} left a review for ${eventName} on ${formattedDateTime}.`;
    template.querySelector(".event-redirect-link").href = `/event.html?id=${eventId}`;
  
    const containerId = determineContainerId(timestamp);
    if (containerId === "today-container") {
      hasTodayNotifications = true;
    } else if (containerId === "last-7-days-container") {
      hasLast7DaysNotifications = true;
    }

    const notificationElement = document.importNode(template, true);
    prependNotification(containerId, notificationElement);
  }

  async function fetchAndDisplayCheckIns(friendsList) {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    const checkInsSnapshot = await db
      .collection("checkins")
      .where(
        "timestamp",
        ">=",
        firebase.firestore.Timestamp.fromDate(oneWeekAgo)
      )
      .orderBy("timestamp", "desc")
      .get();

    let hasNotifications = false;

    checkInsSnapshot.docs.forEach(async (doc) => {
      const checkIn = doc.data();
      if (friendsList.includes(checkIn.userID)) {
        hasNotifications = true;
        const userDoc = await db.collection("users").doc(checkIn.userID).get();
        const eventDoc = await db
          .collection("events")
          .doc(checkIn.eventDocID)
          .get();

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

    checkInsSnapshot.empty || !hasNotifications
      ? displayNoNotificationsMessage()
      : hideNoNotificationsMessage();
  }

  function displayCheckInNotification(userName, eventName, timestamp, eventId) {
    let template = document.getElementById("check-in-template").content.cloneNode(true);
    const formattedDateTime = formatNotificationDate(timestamp);
  
    template.querySelector("strong").textContent = `${userName} checked into ${eventName} on ${formattedDateTime}.`;
    template.querySelector(".event-redirect-link").href = `/event.html?id=${eventId}`;
  
    const containerId = determineContainerId(timestamp);
    if (containerId === "today-container") {
      hasTodayNotifications = true;
    } else if (containerId === "last-7-days-container") {
      hasLast7DaysNotifications = true;
    }
    const notificationElement = document.importNode(template, true);
    prependNotification(containerId, notificationElement);
  }

  function determineContainerId(timestamp) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(todayStart.getTime() - 7 * 86400000); // 7 days before today
  
    const notificationDate = timestamp.toDate();
    return notificationDate >= todayStart
      ? "today-container"
      : notificationDate >= weekAgo
      ? "last-7-days-container"
      : "older-notifications-container"; // Assuming you might want to categorize older notifications
  }
  

  function displayNoNotificationsMessage() {
    document.getElementById("no-notifications-placeholder").style.display =
      "block";
  }

  function hideNoNotificationsMessage() {
    document.getElementById("no-notifications-placeholder").style.display =
      "none";
  }
});

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
    await db
      .collection("users")
      .doc(user.uid)
      .update({
        received_friends_requests:
          firebase.firestore.FieldValue.arrayRemove(friendId),
      });

    await db
      .collection("users")
      .doc(friendId)
      .update({
        sent_friend_requests: firebase.firestore.FieldValue.arrayRemove(
          user.uid
        ),
      });

    await db
      .collection("users")
      .doc(user.uid)
      .update({
        received_friend_requests:
          firebase.firestore.FieldValue.arrayRemove(friendId),
      });

    await db
      .collection("users")
      .doc(user.uid)
      .update({
        list_of_friends: firebase.firestore.FieldValue.arrayUnion(friendId),
      });

    await db
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
