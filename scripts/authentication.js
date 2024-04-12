// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      //------------------------------------------------------------------------------------------
      // The code below is modified from default snippet provided by the FB documentation.
      //
      // If the user is a "brand new" user, then create a new "user" in your own database.
      // Assign this user with the name and email provided.
      // Before this works, you must enable "Firestore" from the firebase console.
      // The Firestore rules must allow the user to write.
      //------------------------------------------------------------------------------------------
      var user = authResult.user; // get the user object from the Firebase authentication database
      if (authResult.additionalUserInfo.isNewUser) {
        //if new user
        navigator.geolocation.getCurrentPosition(position => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          // Perform Firestore set operation inside geolocation callback
          db.collection("users").doc(user.uid).set({
            name: user.displayName, // Use the display name from the authentication, set by the user, string
            email: user.email, // Use the email from the authentication, set by the user, string
            age: -1, // Set the age to -1 as a placeholder, integer
            bio: "New user", // Set the bio to "New user" as a placeholder, string
            favorites: [], // Set the favorites to an empty array, list of strings
            list_of_friends: [], // Set the list_of_friends to an empty array, list of strings
            check_ins: [], // Set the check_ins to an empty array, list of strings
            profile_pic: "", // Set the profile_pic to an empty string, string
            received_friends_requests: [], // Set the received_friends_requests to an empty array, list of strings
            sent_friends_requests: [], // Set the sent_friends_requests to an empty array, list of strings
            check_ins: [], // Set the check_ins to an empty array, list of strings
            location: userLocation // Use the geolocation data
          }).then(function() {
            console.log("New user added to firestore");
            window.location.assign("map.html");}) // Redirect to main.html after signup
          // Catch any errors that occur during the set operation
          .catch(function(error) { 
          console.log("Error adding new user: " + error);
          }); }, error => {
          // Handle Firestore set operation here
          console.log("Geolocation error:", error);
          // Handle error or perform Firestore set without location
        });
        return false; // Prevent automatic redirect
      } else {
        return true; // Allow automatic redirect for existing users
      }
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById("loader").style.display = "none";
    },
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: "popup",
  signInSuccessUrl: "map.html",
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // Terms of service url.
  tosUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  // Privacy policy url.
  privacyPolicyUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

ui.start("#firebaseui-auth-container", uiConfig);
