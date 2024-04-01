// function sendToFriend(recipient){
//     console.log('Im the best')
//     const user = auth.currentUser;
//     console.log(user)
//     const friendId = recipient
//     console.log(friendId)
// }



function getuser() {
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          getFavorites(user)
      } else {
          console.log("No user is signed in");
      }
  });
}

// function sentToFriend(recipient) {
//   console.log("Why am I the best");
//   const user = auth.currentUser;
//   // console.log(user);
//   const friendId = recipient;
//   // console.log(friendId);

//   db.collection("users").doc(user.uid).get()
//   .then(userDoc => {
//     if (userDoc.exists) {
//       const userData = userDoc.data();
//       console.log(userData)
//       const sentFriendRequests = userData.sent_friends_requests;
      
//       console.log(sentFriendRequests);
//     }
//   })
// }

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