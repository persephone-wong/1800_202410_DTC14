import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3sUXFmjwQZ5BKM4CsH7aVi6FQ34F1gDg",
  authDomain: "team-dtc14.firebaseapp.com",
  projectId: "team-dtc14",
  storageBucket: "team-dtc14.appspot.com",
  messagingSenderId: "868115740364",
  appId: "1:868115740364:web:6f6c2a65f4e5687a2a7469",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

function addDataToCollection() {
  db.collection("reviews")
    .add({
      key1: "value1",
      key2: "value2",
      key3: "value3",
    })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

addDataToCollection();

class LeaveReview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <form id="review-form">
        <textarea id="review-content" placeholder="Leave a review..."></textarea>
        <button type="submit">Submit Review</button>
      </form>
    `;
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#review-form")
      .addEventListener("submit", this.submitReview.bind(this));
  }

  async submitReview(e) {
    e.preventDefault();
    // Get the review content from the shadow DOM's input field
    const reviewContent = this.shadowRoot
      .querySelector("#review-content")
      .value.trim();

    // Check if the reviewContent is not empty
    if (reviewContent === "") {
      console.error("Review content is empty.");
      // Optionally, you can display an error message to the user here
      return; // Stop execution if there is no review content
    }

    try {
      // Call the function to add the review to Firestore and await its completion
      await addReviewToFirestore(reviewContent);

      // Optionally, clear the textarea after successfully saving the review
      this.shadowRoot.querySelector("#review-content").value = "";

      // Optionally, display a success message to the user
      console.log("Review submitted successfully.");
    } catch (error) {
      // Handle any errors that occur during the Firestore operation
      console.error("Error submitting review: ", error);
      // Optionally, you can display an error message to the user here
    }
  }
}

customElements.define("leave-review", LeaveReview);

import { collection, addDoc } from "firebase/firestore";

async function addReviewToFirestore(reviewContent) {
  try {
    const docRef = await addDoc(collection(db, "reviews"), {
      content: reviewContent,
      // Include additional fields as needed, e.g., userId, timestamp
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
