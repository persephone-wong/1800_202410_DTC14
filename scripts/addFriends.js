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
  console.log("Why am I the best");
  const user = auth.currentUser;
  const friendId = recipient;

  

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
  console.log("Why am I the best");
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

function decline(button) {
  // Remove the parent card element from the DOM
  const cardElement = button.closest('.col-md-4');
  cardElement.remove();

  console.log("User card has been declined.");
}



