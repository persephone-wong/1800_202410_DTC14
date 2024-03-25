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

async function loadbottomnavbar() {
  navbarbottompath = "./text/bottom_navbar.html";
  const navbarbottom = await fetch(navbarbottompath);
  const navbarbottomHTML = await navbarbottom.text();
  document.getElementById("bottomnavbar").innerHTML = navbarbottomHTML;
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
}

loadSkeleton(); // Invoke the function
