var currentUser;
var currentEvent;

function set_up_db() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid); //global
      console.log(currentUser);
    }
  });
}
set_up_db();

function displayEventInfo() {
  let params = new URLSearchParams(window.location.search);
  let ID = params.get("id"); // Get value for key "id"
  console.log(ID);
  currentEvent = db.collection("events").doc(ID);
  let cardTemplate = document.getElementById("eventCardTemplate");
  let card = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

  db.collection("events")
    .doc(ID)
    .get()
    .then((doc) => {
      if (doc.exists) {
        var data = doc.data();
        var name = data.name;
        var location = data.address;
        var time = data.time;
        var docID = doc.id;
        var date = data.date;
        var description = data.description;
        var eventCode = data.code;
        var waitTime = data.typical_wait_time;

        card.querySelector(".eventName").innerHTML = name;
        card.querySelector(".eventLocation").innerHTML = location;
        card.querySelector(".eventTime").innerHTML = time;
        card.querySelector(".eventDate").innerHTML = date;
        card.querySelector(".eventDetails").innerHTML = description;
        card.querySelector(".historicTimeWait").innerHTML = waitTime;
        card.querySelector(".reviewbutton").href = `/reviews.html?id=${doc.id}`;
        card.querySelector("i").id = "save-" + docID;
        card.querySelector("i").onclick = () => updateFavorite(docID);
        card.querySelector(".check_in_btn").id = "checkin-" + docID;
        card.querySelector(".check_in_btn").onclick = () =>
          updateCheckin(docID);

        currentUser.get().then((userDoc) => {
          var favourites = userDoc.data().favorites;
          if (favourites.includes(docID)) {
            document.getElementById("save-" + docID).innerText = "favorite";
          }
        });
        currentUser.get().then((userDoc) => {
          var checkedIn = userDoc.data().check_ins;
          console.log(checkedIn);
          if (checkedIn.includes(docID)) {
            document.getElementById("checkin-" + docID).innerText = "Check Out";
          }
        });

        let imgEvent = card.querySelector(".eventImage");
        imgEvent.src = "../images/" + eventCode + ".jpg";
        document.getElementById("eventContainer").appendChild(card);
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => console.error("Error fetching document:", error));
}
displayEventInfo();

function goBack() {
  window.history.back();
}

function updateFavorite(eventDocID) {
  currentUser.get().then((userDoc) => {
    let favoritesNow = userDoc.data().favorites;
    console.log(favoritesNow);

    if (favoritesNow.includes(eventDocID)) {
      console.log("this event exist in the database,should be removed");
      currentUser
        .update({
          favorites: firebase.firestore.FieldValue.arrayRemove(eventDocID),
        })
        .then(() => {
          let iconID = "save-" + eventDocID;
          document.getElementById(iconID).innerText = "favorite_border";
        });
    } else {
      console.log(
        "this event does not exist in the database and should be added"
      );
      currentUser
        .update({
          favorites: firebase.firestore.FieldValue.arrayUnion(eventDocID),
        })
        .then(() => {
          let iconID = "save-" + eventDocID;
          document.getElementById(iconID).innerText = "favorite";
        });
    }
  });
}

function updateCheckin(eventDocID) {
  currentUser.get().then((userDoc) => {
    let checkinsUser = userDoc.data().check_ins;
    console.log(checkinsUser);

    if (checkinsUser.includes(eventDocID)) {
      console.log("this check-in exist in the database,should be removed");
      currentUser
        .update({
          check_ins: firebase.firestore.FieldValue.arrayRemove(eventDocID),
        })
        .then(() => {
          let buttonID = "checkin-" + eventDocID;
        });
      currentEvent
        .update({
          typical_wait_time: firebase.firestore.FieldValue.increment(-5),
          check_ins: firebase.firestore.FieldValue.arrayRemove(eventDocID),
        })
        .then(() => {
          let buttonID = "checkin-" + eventDocID;
          document.getElementById(buttonID).innerText = "Check In";
        });
    } else {
      console.log(
        "this check-in does not exist in the database and should be added"
      );
      currentUser
        .update({
          check_ins: firebase.firestore.FieldValue.arrayUnion(eventDocID),
        })
        .then(() => {
          let buttonID = "checkin-" + eventDocID;
        });
      currentEvent
        .update({
          typical_wait_time: firebase.firestore.FieldValue.increment(5),
          check_ins: firebase.firestore.FieldValue.arrayUnion(eventDocID),
        })
        .then(() => {
          let buttonID = "checkin-" + eventDocID;
          document.getElementById(buttonID).innerText = "Check Out";
        });
    }
  });
}

function saveEventDocumentIDAndRedirect(eventDocID) {
  let params = new URL(window.location.href);
  let ID = params.searchParams.get("docID");
  localStorage.setItem("eventDocID", ID);
  window.location.href = "reviews.html";
}
