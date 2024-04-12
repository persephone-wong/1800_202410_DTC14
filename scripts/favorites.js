// Description: This file contains the code to display the user's favorite events on the favorites page.

var currentUser;

function getuser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      getFavorites(user);
      currentUser = db.collection("users").doc(user.uid);
    } else {
      console.log("No user is signed in");
    }
  });
}

function getFavorites(user) {
  db.collection("users")
    .doc(user.uid)
    .get()
    .then((userDoc) => {
      var favorites = userDoc.data().favorites;
      console.log(favorites);

      // Get pointer the new card template
      let cardTemplate = document.getElementById("eventCardTemplate");

      favorites.forEach((eventID) => {
        console.log(eventID);
        db.collection("events")
          .doc(eventID)
          .get()
          .then((doc) => {
            var title = doc.data().name;
            var address = doc.data().address;
            var time = doc.data().time;
            var date = doc.data().date;
            var docID = doc.id;

            var eventcode = doc.data().code;
            let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

            //update title and some pertinant information
            newcard.querySelector(".card-title").innerHTML = title;
            newcard.querySelector(".card-location").innerHTML = address;
            newcard.querySelector(".card-time").innerHTML = time;
            newcard.querySelector(".card-date").innerHTML = date;
            newcard.querySelector("i").id = "save-" + docID;
            newcard.querySelector("i").onclick = () => updateFavorite(docID);
            newcard.querySelector(
              ".card-img"
            ).src = `./images/${eventcode}.jpg`;
            newcard.querySelector(
              ".seeMoreButton"
            ).href = `/event.html?id=${doc.id}`; //link to event page

            currentUser.get().then((userDoc) => {
              var favourites = userDoc.data().favorites;
              if (favourites.includes(docID)) {
                document.getElementById("save-" + docID).innerText = "favorite";
              }
            });

            document.getElementById("events-go-here").appendChild(newcard);
          });
      });
    });
}

// function to update the favorite list
function updateFavorite(eventDocID) {
  {
    currentUser.get().then((userDoc) => {
      let favoritesNow = userDoc.data().favorites;
      console.log(favoritesNow);

      // if the event is already in the favorite list, remove it
      if (favoritesNow.includes(eventDocID)) {
        console.log("this event exist in the database,should be removed");
        let iconID = "save-" + eventDocID;
        document.getElementById(iconID).innerText = "favorite_border";
        currentUser.update({
          favorites: firebase.firestore.FieldValue.arrayRemove(eventDocID),
        });
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        // if the event is not in the favorite list, add it
        console.log(
          "this event does not exist in the database and should be added"
        );
        let iconID = "save-" + eventDocID;
        document.getElementById(iconID).innerText = "favorite";
        currentUser.update({
          favorites: firebase.firestore.FieldValue.arrayUnion(eventDocID),
        });
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    });
  }
}

getuser();
