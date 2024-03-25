
const auth = firebase.auth();

function insertNameFromFirestore() {
  // Ensure the user is logged in
  const user = auth.currentUser;
  if (user) {
    console.log(user.uid); // Log the UID of the logged-in user
    const userDocRef = firebase.firestore().collection("users").doc(user.uid); // Reference to the Firestore document of the user

    userDocRef.get().then(userDoc => {
      if (userDoc.exists) {
        const userName = userDoc.data().name;
        console.log(userName);
        document.getElementById("namePlaceholder").innerText = userName; // Vanilla JS
      } else {
        console.log("Document does not exist!");
      }
    }).catch(error => {
      console.error("Error fetching user document:", error);
    });
  } else {
    console.log("No user is logged in.");
  }
}

function loadHtmlContent(userIsLoggedIn) {
  const navbarPlaceholder = document.getElementById("navbarPlaceholder");
  const path = userIsLoggedIn ? "./text/nav_after_login.html" : "./text/nav_before_login.html";

  fetch(path).then(response => response.text()).then(data => {
    navbarPlaceholder.innerHTML = data;
    if (userIsLoggedIn) {
      insertNameFromFirestore();
    }
  }).catch(error => {
    console.error("Error loading HTML content:", error);
  });
}

function loadbottomnavbar() {
  const navbarbottom = document.getElementById("bottomnavbar");
  const path = "./text/bottom_navbar.html";
  fetch(path).then(response => response.text()).then(data => {
    navbarbottom.innerHTML = data;});
}

function loadsearchbar() {
  const navbarsearch = document.getElementById("searchbar");
  const path = "./text/search_bar.html";
  fetch(path).then(response => response.text()).then(data => {
    navbarsearch.innerHTML = data;});
}



function loadSkeleton() {
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("User is signed in.");
      loadHtmlContent(true);
    } else {
      console.log("No user is signed in.");
      loadHtmlContent(false);
    }
  });
  loadbottomnavbar();
  loadsearchbar();
}

loadSkeleton()

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
