var eventDocID = localStorage.getItem("eventDocID");

function getEventName(id) {
  db.collection("events")
    .doc(id)
    .get()
    .then((doc) => {
      var eventName = doc.data().name;
      document.getElementById("events").textContent = eventName;
    });
}

if (eventDocID) {
  getEventName(eventDocID);
}

const stars = document.querySelectorAll(".star");

stars.forEach((star, index) => {
  star.addEventListener("click", () => {
    for (let i = 0; i <= index; i++) {
      document.getElementById(`star${i + 1}`).textContent = "star";
    }
  });
});

function writeReview() {
  console.log("Inside writeReview");
  let title = document.getElementById("title").value;
  let waitTime = document.getElementById("level").value;
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

  console.log(title, waitTime, description, kidFriendly, petFriendly);

  // Check for user authentication
  var user = firebase.auth().currentUser;
  if (user) {
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
        rating: rating,
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
    window.location.href = "review.html";
    // Handle case where no user is signed in
    // You might want to redirect to a login page or show an error message
  }
}

// Optional: Initialize Firebase in this script or ensure it's done before this script runs
