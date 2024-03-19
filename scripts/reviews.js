// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyD3sUXFmjwQZ5BKM4CsH7aVi6FQ34F1gDg",
  authDomain: "team-dtc14.firebaseapp.com",
  projectId: "team-dtc14",
  storageBucket: "team-dtc14.appspot.com",
  messagingSenderId: "868115740364",
  appId: "1:868115740364:web:6f6c2a65f4e5687a2a7469",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore(); // Correctly access Firestore instance

function generateReviews() {
  const reviews = [
    {
      username: "Rachel Green",
      rating: 5,
      reviewText: "Great event! Had a lot of fun and met some awesome people.",
      date: new Date("2024-03-18T21:53:40-07:00"),
    },

    {
      username: "Ross Geller",
      rating: 3,
      reviewText: "I hope there is more parking.",
      date: new Date("2024-03-18T21:54:30-07:00"),
    },
    {
      username: "Phoebe Buffay",
      rating: 5,
      reviewText: "I love it! Will definitely come back again.",
      date: new Date("2024-03-17T21:55:23-07:00"),
    },
    {
      username: "Joey Tribbiani",
      rating: 4,
      reviewText:
        "I wish there is more food, but overall the atmosphere is really enjoyable.",
      date: new Date("2024-03-16T21:52:03-07:00"),
    },
    {
      username: "Monica Geller",
      rating: 3,
      reviewText: "I wish the wait line is shorter.",
      date: new Date("2024-03-18T21:49:25-07:00"),
    },
  ];

  reviews.forEach((review) => {
    const { username, date } = review;
    const reviewsRef = db.collection("reviews");
    // Convert JavaScript Date to Firestore Timestamp
    const timestamp = firebase.firestore.Timestamp.fromDate(date);
    review.date = timestamp;

    reviewsRef
      .where("username", "==", username)
      .where("date", "==", timestamp)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          // If the review doesn't exist, add it to Firestore
          reviewsRef
            .add(review)
            .then(() => console.log("Review added for", username))
            .catch((error) =>
              console.error("Error adding review for", username, ":", error)
            );
        } else {
          console.log("Review already exists for", username);
        }
      })
      .catch((error) =>
        console.error(
          "Error checking review existence for",
          username,
          ":",
          error
        )
      );
  });
}

document.addEventListener("DOMContentLoaded", function () {
  generateReviews();
});

function displayReviewsDynamically() {
  var reviewTemplate = document.getElementById("reviewTemplate").content;
  var reviewsContainer = document.getElementById("reviews-container");

  db.collection("reviews")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var reviewData = doc.data();
        var newReview = reviewTemplate.cloneNode(true);

        // Update template clone with review data
        newReview.querySelector(".card-title").textContent =
          reviewData.username;
        newReview.querySelector(
          ".card-subtitle"
        ).textContent = `Rating: ${reviewData.rating}`;
        newReview.querySelector(".card-text").textContent =
          reviewData.reviewText;

        // Handling the date
        var reviewDate = reviewData.date
          ? reviewData.date.toDate().toLocaleDateString()
          : "No date";
        newReview.querySelector(
          ".card-footer"
        ).textContent = `Reviewed on: ${reviewDate}`;

        reviewsContainer.appendChild(newReview);
      });
    })
    .catch((error) => {
      console.error("Error fetching reviews: ", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  displayReviewsDynamically();
});
