// db.collection("users").get().then(
//   (querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       // console.log(doc.data());
//     });
//   }
// );

function getuser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      display_friends(user);
    } else {
      console.log("No user is signed in");
    }
  });
}

function display_friends(user) {
  console.log(user);
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      var friend_request = userDoc.data().received_friend_requests;
      console.log(friend_request);

      // Get pointer the new card template
      let cardTemplate = document.getElementById("friendRequestTemplate");

      friend_request.forEach((uid) => {
        //   console.log(uid);
        db.collection("users")
          .doc(uid)
          .get()
          .then((doc) => {
            var title = doc.data().name;
            var docID = doc.id;
            console.log(doc.id);
            var eventcode = doc.data().code;
            let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

            //update title and some pertinant information
            newcard.querySelector(".card-title").innerHTML = title;
            newcard.querySelector(".btn-custom").dataset.uid = doc.id;
            newcard.querySelector(".btn-decline").dataset.uid = doc.id;
            // Check if profile_pic exists and is not empty, else set default image
            const profilePicUrl =
              doc.profile_pic && doc.profile_pic.trim() !== ""
                ? doc.profile_pic
                : "https://img.icons8.com/ios/100/000c5c/user-male-circle--v1.png";
            newcard.querySelector(".avatar").src = profilePicUrl;

            document.getElementById("requests-go-here").appendChild(newcard);
          });
      });
    });
}

getuser();

// Initialize Firestore

// function displayUsers(users) {
//   let cardTemplate = document.getElementById("userCardTemplate").content;
//   let usersContainer = document.getElementById(users + "-go-here");

//   db.collection("users").get()
//     .then(querySnapshot => {
//       querySnapshot.forEach(doc => {
//         const userData = doc.data();
//         if(userData.received_friend_requests != undefined)
//         console.log(`UserID: ` + userData.received_friend_requests)

//         if (userData.received_friend_requests && userData.received_friend_requests.length > 0) {
//           userData.received_friend_requests.forEach(friendRequestId => {
//             db.collection("users").doc(friendRequestId).get()
//               .then(friendRequestDoc => {
//                 const friendRequestData = friendRequestDoc.data();

//                 let userCard = document.importNode(cardTemplate, true);
//                 userCard.querySelector(".card-title").textContent = friendRequestData.name;
//                 userCard.querySelector(".card-text").textContent = friendRequestData.bio;
//                 userCard.querySelector(".btn-custom").dataset.uid = friendRequestId;

//                 document.getElementById(users + "-go-here").appendChild(userCard);
//               })
//               .catch(error => console.log(error));
//           });
//         }
//       });
//     })
//     .catch(error => console.log(error));
// }

// displayUsers("users");
