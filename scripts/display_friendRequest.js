// Description: This script is used to display friend requests that the user has received.

// Get the current user
function getuser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      display_friends(user);
    } else {
      console.log("No user is signed in");
    }
  });
}

// Display friend requests that the user has received
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