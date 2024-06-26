// This script is responsible for submitting a review for an event.

var eventDocID = localStorage.getItem("eventDocID");

// Get the event name
function getEventName(id) {
  db.collection("events")
    .doc(id)
    .get()
    .then((data) => {
      var name = data.data().name;
      document.getElementById("eventName").innerHTML = name;
    });
}

getEventName(eventDocID);

console.log("Event ID: " + eventDocID);

const stars = document.querySelectorAll(".star");

// Iterate through each star element and add a click event listener
stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    for (let i = 0; i <= index; i++) {
      document.getElementById(`star${i + 1}`).textContent = "star";
    }
  });
});

// Function to submit a review
function writeReview() {
  console.log("Inside writeReview");
  let title = document.getElementById("title").value;
  let waitTime = document.getElementById("waitTime").value;
  let description = document.getElementById("description").value;
  let kidFriendly = document.querySelector(
    'input[name="kidFriendly"]:checked'
  ).value;
  let petFriendly = document.querySelector(
    'input[name="petFriendly"]:checked'
  ).value;

  // Get the star rating
  // Get all the elements with the class "star" and store them in the 'stars' variable
  const stars = document.querySelectorAll(".star");
  // Initialize a variable 'hikeRating' to keep track of the rating count
  let Rating = 0;
  // Iterate through each element in the 'stars' NodeList using the forEach method
  stars.forEach((star) => {
    // Check if the text content of the current 'star' element is equal to the string 'star'
    if (star.textContent === "star") {
      // If the condition is met, increment the 'hikeRating' by 1
      Rating++;
    }
  });

  console.log(title, waitTime, description, kidFriendly, petFriendly, Rating);

  // Check for user authentication
  var user = firebase.auth().currentUser;
  if (user) {
    // var currentUser = db.collection("users").doc(user.uid);
    var userID = user.uid;

    // Submit review
    db.collection("reviews") // Adjust the collection name as per your Firestore setup
      .add({
        eventDocID: eventDocID,
        userID: userID,
        title: title,
        waitTime: waitTime,
        description: description,
        kidFriendly: kidFriendly,
        petFriendly: petFriendly,
        rating: Rating,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        window.location.href = "thanks.html"; // Redirect on success
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  } else {
    console.log("No user is signed in");
    window.location.href = "index.html";
    // Handle case where no user is signed in
  }
}
