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
      var friends_list = userDoc.data().list_of_friends;
      console.log(friends_list);

      // Get pointer the new card template
      let cardTemplate = document.getElementById("userCardTemplate");

      friends_list.forEach((uid) => {
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
            newcard.querySelector(".card-title").innerHTML = title;
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
