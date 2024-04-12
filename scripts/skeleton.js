// Global Firebase auth reference
const auth = firebase.auth();

function insertNameFromFirestore() {
  // Ensure the user is logged in
  const user = auth.currentUser;
  if (user) {
    console.log(user.uid); // Log the UID of the logged-in user
    const userDocRef = firebase.firestore().collection("users").doc(user.uid); // Reference to the Firestore document of the user

    userDocRef.get().then(userDoc => {
      if (userDoc.exists) {
        const fullUserName = userDoc.data().name;
        console.log(fullUserName);
        // Split the fullUserName by space and get the first word
        const firstName = fullUserName.split(" ")[0];
        console.log(firstName); // Log the first name
        document.getElementById("namePlaceholder").innerText = firstName; // Only use the first word
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

// userIsLoggedIn is a boolean value that indicates whether the user is logged in or not
function loadHtmlContent(userIsLoggedIn) {
  const navbarPlaceholder = document.getElementById("navbarPlaceholder"); // Reference to the div element with the ID "navbarPlaceholder"
  const path = userIsLoggedIn ? "./text/nav_after_login.html" : "./text/nav_before_login.html";
  fetch(path).then(response => response.text()).then(data => {
    navbarPlaceholder.innerHTML = data;
    if (userIsLoggedIn) {insertNameFromFirestore();}
  }).catch(error => {
    console.error("Error loading HTML content:", error);
  });
}

// Function to load the bottom navbar
function loadbottomnavbar() {
  // Reference to the div element with the ID "navbarPlaceholder"
  const navbarbottom = document.getElementById("bottomnavbar"); 
  const path = "./text/bottom_navbar.html";
  fetch(path).then(response => response.text()).then(data => {
    navbarbottom.innerHTML = data;});
}

// Function to load the search bar
function loadsearchbar() {
  // Reference to the div element with the ID "navbarPlaceholder"
  const navbarsearch = document.getElementById("searchbar");
  fetch(path).then(response => response.text()).then(data => {
    navbarsearch.innerHTML = data;});
}

function goBack() {
  window.history.back();
}

// Function to load the skeleton of the page
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

loadSkeleton(); // Invoke the function

