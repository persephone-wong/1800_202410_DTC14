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

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentUserPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              // geopoint is stored under the `location` field in Firestore
              const eventLocationGeopoint = data.location;
              const eventDestination = {
                lat: eventLocationGeopoint.latitude,
                lng: eventLocationGeopoint.longitude,
              };

              // initialize the map and directions
              initMap(currentUserPosition, eventDestination);
            },
            (error) => {
              console.error("Error getting the user's location:", error);
            }
          );
        } else {
          console.log("Geolocation is not supported by this browser.");
        }

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

function initMap(startPoint, endPoint) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: startPoint, // Center the map on the user's location
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  calculateAndDisplayRoute(
    directionsService,
    directionsRenderer,
    startPoint,
    endPoint
  );
}

function calculateAndDisplayRoute(
  directionsService,
  directionsRenderer,
  startPoint,
  endPoint
) {
  // DRIVING mode route is displayed on the map
  calculateRoute(
    directionsService,
    directionsRenderer,
    startPoint,
    endPoint,
    google.maps.TravelMode.DRIVING,
    ".driving-time"
  );

  // For TRANSIT and WALKING, we calculate route but do not display it on the map
  calculateRoute(
    directionsService,
    null,
    startPoint,
    endPoint,
    google.maps.TravelMode.TRANSIT,
    ".transit-time"
  );
  calculateRoute(
    directionsService,
    null,
    startPoint,
    endPoint,
    google.maps.TravelMode.WALKING,
    ".walk-time"
  );
}

function calculateRoute(
  directionsService,
  directionsRenderer,
  startPoint,
  endPoint,
  travelMode,
  selector
) {
  directionsService.route(
    {
      origin: startPoint,
      destination: endPoint,
      travelMode: travelMode,
    },
    (response, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        if (directionsRenderer) {
          // Only render the map route for driving
          directionsRenderer.setDirections(response);

          // Display the distance to the event
          const distance = response.routes[0].legs[0].distance.text;
          document.querySelector('.distance-to-event').textContent = `${distance} away from you`;
        }
        var travelTime = response.routes[0].legs[0].duration.text;
        document.querySelector(selector).textContent = travelTime;
      } else {
        document.querySelector(selector).textContent = "Unavailable"; // Handle unavailable routes
      }
    }
  );
}

function updateTravelTime(response, status, selector) {
  if (status === google.maps.DirectionsStatus.OK) {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setDirections(response);
    var travelTime = response.routes[0].legs[0].duration.text;
    document.querySelector(selector).textContent = travelTime;
  } else {
    document.querySelector(selector).textContent = "Unavailable"; // Case where a route cannot be found
    console.error(
      "Directions request for " + selector + " failed due to " + status
    );
  }
}
