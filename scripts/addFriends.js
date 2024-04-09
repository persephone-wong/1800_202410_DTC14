function getuser() {
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          getFavorites(user)
      } else {
          console.log("No user is signed in");
      }
  });
}

function sentToFriend(recipient) {
  const user = auth.currentUser;
  const friendId = recipient;

  console.log("Sending friend request to:", friendId);
  console.log("Current user:", user.uid);

  

  // Add the current user's UID to the recipient's received_friend_requests array
  db.collection("users").doc(friendId).update({
    received_friend_requests: firebase.firestore.FieldValue.arrayUnion(user.uid)
  })
  .then(() => {
    console.log("Friend request sent to:", friendId);

    // Add the friendId to the current user's sent_friend_requests array
    db.collection("users").doc(user.uid).update({
      sent_friend_requests: firebase.firestore.FieldValue.arrayUnion(friendId)
    })
    .then(() => {
      console.log("Friend request sent from:", user.uid);

      // Get the updated user document
      db.collection("users").doc(user.uid).get()
        .then(userDoc => {
          if (userDoc.exists) {
            const userData = userDoc.data();
            const sentFriendRequests = userData.sent_friend_requests;
            console.log("Updated sent_friend_requests array: ", sentFriendRequests);
          }
        });
    })
    .catch(error => {
      console.error("Error adding friend request to sent_friend_requests array: ", error);
    });
  })
  .catch(error => {
    console.error("Error adding friend request to received_friend_requests array: ", error);
  });

  
}

async function accept(sender) {
  const user = auth.currentUser;
  console.log(user)
  const friendId = sender;
  console.log(friendId)
  
  try {
    await db.collection("users").doc(user.uid).update({
      received_friends_requests: firebase.firestore.FieldValue.arrayRemove(friendId)
    });

    await db.collection("users").doc(friendId).update({
      sent_friend_requests: firebase.firestore.FieldValue.arrayRemove(user.uid)
    });

    await db.collection("users").doc(user.uid).update({
      received_friend_requests: firebase.firestore.FieldValue.arrayRemove(friendId)
    });

    await db.collection("users").doc(user.uid).update({
      list_of_friends: firebase.firestore.FieldValue.arrayUnion(friendId)
    });

    await db.collection("users").doc(friendId).update({
      list_of_friends: firebase.firestore.FieldValue.arrayUnion(user.uid)
    });

    console.log("Friend request accepted successfully!");
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
}

async function decline(sender) {
  const user = auth.currentUser;
  console.log(user)
  const friendId = sender;
  console.log(friendId)
  
  try {

    await db.collection("users").doc(user.uid).update({
      received_friend_requests: firebase.firestore.FieldValue.arrayRemove(friendId)
    });

    console.log("User Declined");
  } catch (error) {
    console.error("Error Declining:", error);
  }
}

function onAddFriendClick(element) {
  // Extract the friend's ID from the element
  const friendId = element.dataset.uid;
  console.log("Friend ID:", friendId);

  // Call the existing function without changing its implementation
  sentToFriend(friendId);

  // Handle additional UI logic for success scenario
  handleFriendRequestSuccess(element);
}

function handleFriendRequestSuccess(element) {
  // Assume success
  setTimeout(() => { // Simulate asynchronous operation completion
    // Change button image to checkmark
    element.innerHTML = `<span><img width="24" height="24" src="https://img.icons8.com/ios-filled/50/000c5c/checkmark--v1.png" alt="checkmark"/></span>`;

    // Remove the whole card after 1 second
    setTimeout(() => {
      const card = element.closest('.card');
      if (card) {
        card.remove(); // Removes the card from the DOM
      }
    }, 1000);
  }, 500); // Simulating delay for demonstration
}


