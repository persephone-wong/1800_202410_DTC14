var eventDocID = localStorage.getItem("eventDocID");

console.log("eventDocID:", eventDocID); // Check the retrieved ID

function getEventName(id) {
  db.collection("events")
    .doc(id)
    .get()
    .then((thisEvent) => {
      var eventName = thisEvent.data().name;
      document.getElementById("eventName").innerHTML = eventName;
    });
}

getEventName(eventDocID);

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
    window.location.href = "review.html";
    // Handle case where no user is signed in
    // You might want to redirect to a login page or show an error message
  }
}

// Optional: Initialize Firebase in this script or ensure it's done before this script runs

function populateReviews() {
  console.log("Fetching reviews");
  let reviewCardTemplate = document.getElementById("reviewCardTemplate");
  let reviewCardGroup = document.getElementById("reviewCardGroup");

  let params = new URL(window.location.href);
  let eventID = params.searchParams.get("docID");

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
        var time = data.timestamp.toDate();
        var rating = data.rating; // Assume this exists and is a number

        console.log(rating);
        console.log(time);

        let reviewCard = reviewCardTemplate.content.cloneNode(true);
        reviewCard.querySelector(".title").innerHTML = title;
        reviewCard.querySelector(".time").innerHTML = new Date(
          time
        ).toLocaleString();
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
