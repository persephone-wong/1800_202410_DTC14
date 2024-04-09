var currentUser;
var currentEvent;
var waitTime;
var new_waitTime;

function set_up_db() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = db.collection("users").doc(user.uid);
        console.log("currentUser set:", currentUser);
        resolve(currentUser);
      } else {
        reject("No user is signed in.");
      }
    });
  });
}

async function initialize() {
  try {
    await set_up_db();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        displayEventInfo();
        populateFriendsWhoCheckedIn();
      });
    } else {
      displayEventInfo();
      populateFriendsWhoCheckedIn();
    }
  } catch (error) {
    console.error("Error initializing app:", error);
  }
}

initialize(); // start the initialization process


function displayEventInfo() {
  let params = new URLSearchParams(window.location.search);
  let ID = params.get("id"); // Get value for key "id"
  console.log(ID);
  // let params = new URL(window.location.href); //get URL of search bar
  // let ID = params.searchParams.get("id"); // Get value for key "id"
  // console.log(ID);
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
        waitTime = data.typical_wait_time;

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
        // card.querySelector(".reviewbutton").href = `/reviews.html?id=${doc.id}`;
        card
          .querySelector(".reviewbutton")
          .addEventListener("click", function () {
            var eventDocID = localStorage.setItem("eventDocID", doc.id);
            // windows.location.href = `/reviews.html`;
            // window.location.href = `/reviews.html?id=${doc.id}`; // Redirect on button click
            window.location.href = "reviews.html";
          });
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
          } else {
            document.getElementById("checkin-" + docID).innerText = "Check In";
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


function updateFavorite(eventDocID) {
  currentUser.get().then((userDoc) => {
    let favoritesNow = userDoc.data().favorites;
    console.log(favoritesNow);

    if (favoritesNow.includes(eventDocID)) {
      console.log("this event exist in the database,should be removed");
      let iconID = "save-" + eventDocID;
      document.getElementById(iconID).innerText = "favorite_border";
      currentUser.update({
        favorites: firebase.firestore.FieldValue.arrayRemove(eventDocID),
      });
    } else {
      console.log(
        "this event does not exist in the database and should be added"
      );
      let iconID = "save-" + eventDocID;
      document.getElementById(iconID).innerText = "favorite";
      currentUser.update({
        favorites: firebase.firestore.FieldValue.arrayUnion(eventDocID),
      });
    }
  });
}

function updateCheckin(eventDocID) {
  var user = firebase.auth().currentUser
  currentUser.get().then((userDoc) => {
    let checkinsUser = userDoc.data().check_ins;
    console.log(checkinsUser);

    if (checkinsUser.includes(eventDocID)) {
      let buttonID = "checkin-" + eventDocID;
      document.getElementById(buttonID).innerText = "Check In";
      currentUser.update({
        check_ins: firebase.firestore.FieldValue.arrayRemove(eventDocID),
      });
      currentEvent.update({
        typical_wait_time: firebase.firestore.FieldValue.increment(-5),
        check_ins: firebase.firestore.FieldValue.arrayRemove(eventDocID),
      }).then(() => {
        new_waitTime = waitTime;
        console.log(new_waitTime);
        document.getElementsByClassName('historicTimeWait')[0].innerText = (new_waitTime)});


      if (user) {
        console.log(eventDocID);
        var checkinID = userDoc.data().check_inIDs[checkinsUser.indexOf(eventDocID)];
        var userID = user.uid;
        db.collection("checkins").doc(checkinID).delete().then(() => { console.log('deleted checked In') })

        currentUser.update({
          check_ins: firebase.firestore.FieldValue.arrayRemove(eventDocID),
          check_inIDs: firebase.firestore.FieldValue.arrayRemove(checkinID)
        })


      } else {
        console.log("No user is signed in");
      }
    } else {
      let buttonID = "checkin-" + eventDocID;
      document.getElementById(buttonID).innerText = "Check Out";
      currentUser.update({check_ins: firebase.firestore.FieldValue.arrayUnion(eventDocID),});
      currentEvent.update({
        typical_wait_time: firebase.firestore.FieldValue.increment(5),
        check_ins: firebase.firestore.FieldValue.arrayUnion(eventDocID),
      }).then(() => {
        new_waitTime = waitTime + 5;
        console.log(new_waitTime);
        document.getElementsByClassName('historicTimeWait')[0].innerText = (new_waitTime)});

      if (user) {
        var userID = user.uid;
        db.collection("checkins").add({
          eventDocID: eventDocID,
          userID: userID,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then((docRef) => {
          currentUser.update({
            check_inIDs: firebase.firestore.FieldValue.arrayUnion(docRef.id)
          })
        })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      } else {
        console.log("No user is signed in");
      }

    }
  });
}

function loadGoogleMaps() {
  const apiKey = firebaseConfig.apiKey;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=&v=weekly`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function initMap(startPoint, endPoint) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: startPoint, // Center the map on the user's location
  });

  updateDirectionLinks(startPoint, endPoint);

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
          document.querySelector(
            ".distance-to-event"
          ).textContent = `${distance} away from you`;
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

function updateDirectionLinks(startPoint, endPoint) {
  const baseUrl = "https://www.google.com/maps/dir/?api=1";
  const travelModes = {
    driving: "driving",
    transit: "transit",
    walking: "walking",
  };

  document.querySelectorAll(".direction-link").forEach((link) => {
    const mode = link.getAttribute("data-travel-mode");
    const url = `${baseUrl}&origin=${startPoint.lat},${startPoint.lng}&destination=${endPoint.lat},${endPoint.lng}&travelmode=${travelModes[mode]}`;
    link.href = url;
  });
}

window.onload = loadGoogleMaps;

// function saveEventDocumentIDAndRedirect() {
//   let params = new URL(window.location.href); //get the url from the search bar
//   let ID = params.searchParams.get("id");
//   localStorage.setItem("eventDocID", ID);
//   window.location.href = "reviews.html";
// }

function populateFriendsWhoCheckedIn() {
  let params = new URLSearchParams(window.location.search);
  let eventId = params.get("id");

  if (!eventId) {
    console.error("Event ID is missing from the URL");
    return;
  }

  

  currentUser.get().then(userDoc => {
    if (!userDoc.exists) {
      console.error("Current user document does not exist");
      return;
    }
    const friendsList = userDoc.data().list_of_friends || [];
    console.log("Current user's friends list:", friendsList);

    // Fetch all check-ins for the specific event
    db.collection("checkins").where("eventDocID", "==", eventId).get().then(querySnapshot => {
      const checkedInUserIds = [];
      
      querySnapshot.forEach(doc => {
        const checkInData = doc.data();
        // Add the user ID to the list if it's in the friends list
        if (friendsList.includes(checkInData.userID)) {
          checkedInUserIds.push(checkInData.userID);
        }
      });

      console.log("Friends who have checked in:", checkedInUserIds);

      // Display these friends
      displayCheckedInFriends(checkedInUserIds);
    });
  });
}


function displayCheckedInFriends(friendsCheckedIn) {
  const container = document.getElementById("friendsCheckedInContainer");
  const placeholder = document.querySelector(".No-friends-checked-in-placeholder");


  if (friendsCheckedIn.length === 0) {
    console.log("No friends have checked in yet.");
    placeholder.innerText = "No friends have checked in yet.";
    placeholder.style.display = "block"; // Make sure the placeholder is visible
    console.log("Placeholder:", placeholder);
    return;
  } else {
    // Hide the placeholder if there are friends to display
    placeholder.style.display = "none";
  }

  friendsCheckedIn.forEach(friendId => {
    db.collection("users").doc(friendId).get().then(friendDoc => {
      if (friendDoc.exists) {
        const friendData = friendDoc.data();
        const profilePicUrl = friendData.profile_pic && friendData.profile_pic.trim() !== ""
          ? friendData.profile_pic
          : "https://img.icons8.com/ios/100/000C5C/user-male-circle--v1.png"; // Default profile picture if none is provided
        const firstName = friendData.name.split(" ")[0];
        console.log("Friend's name:", firstName);

        // Create elements for the friend's name and profile picture
        const friendDiv = document.createElement("div");
        friendDiv.classList.add("d-flex", "align-items-center", "mb-2"); // Add Bootstrap classes for styling

        const img = document.createElement("img");
        img.src = profilePicUrl;
        img.alt = firstName;
        img.classList.add("rounded-circle", "me-2");
        img.style.width = "50px";
        img.style.height = "50px";

        const nameText = document.createElement("div");
        nameText.textContent = firstName;
        nameText.classList.add("friend-name");
        nameText.classList.add("mx-1");


        friendDiv.appendChild(img);
        friendDiv.appendChild(nameText);
        container.appendChild(friendDiv);
      }
    });
  });
}



function populateReviews() {
  console.log("Fetching reviews");
  let reviewCardTemplate = document.getElementById("reviewCardTemplate");
  let reviewCardGroup = document.getElementById("reviewCardGroup");
  console.log(reviewCardGroup);

  let params = new URL(window.location.href);
  let eventID = params.searchParams.get("id");

  db.collection("reviews")
    .where("eventDocID", "==", eventID)
    .get()
    .then((allReviews) => {
      let reviews = allReviews.docs;
      reviews.forEach((doc) => {
        var data = doc.data();
        var title = data.title;
        var waitTime = data.waitTime;
        var kidFriendly = data.kidFriendly;
        var petFriendly = data.petFriendly;
        var description = data.description;
        var firestoreTime = data.timestamp;
        var rating = data.rating;

        const date = firestoreTime.toDate(); // Convert Firestore Timestamp to JavaScript Date object

        // Options for the date format
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('en-CA', dateOptions);

        // Options for the time format
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const timeString = date.toLocaleTimeString('en-CA', timeOptions);

        // Combine both date and time in a single string
        const time = `${dateString} at ${timeString}`;

        console.log(rating);
        console.log(time);

        let reviewCard = reviewCardTemplate.content.cloneNode(true);
        reviewCard.querySelector(".title").innerHTML = title;
        reviewCard.querySelector(".time").innerHTML = time;
        reviewCard.querySelector(
          ".waitTime"
        ).innerHTML = `Wait Time: ${waitTime}`;
        reviewCard.querySelector(
          ".kidFriendly"
        ).innerHTML = `Kid-Friendly: ${kidFriendly}`;
        reviewCard.querySelector(
          ".petFriendly"
        ).innerHTML = `Pet-Friendly: ${petFriendly}`;
        reviewCard.querySelector(
          ".description"
        ).innerHTML = `Description: ${description}`;

        // Populate star rating
        let starRating = "";
        for (let i = 0; i < rating; i++) {
          starRating += '<span class="material-icons">star</span>';
        }
        for (let i = rating; i < 5; i++) {
          starRating += '<span class="material-icons">star_outline</span>';
        }
        reviewCard.querySelector(".star-rating").innerHTML = starRating;

        reviewCardGroup.appendChild(reviewCard);
      });
    });
}

populateReviews();
populateFriendsWhoCheckedIn();