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
            name: user.displayName,
            email: user.email,
            age: -1,
            bio: "New user",
            list_of_favorites: [],
            list_of_friends: [],
            profile_pic: "",
            received_friends_requests: [],
            sent_friends_requests: [],
            location: userLocation // Use the geolocation data
          })
          .then(function() {
            console.log("New user added to firestore");
            window.location.assign("map.html"); // Redirect to main.html after signup
          })
          .catch(function(error) {
            console.log("Error adding new user: " + error);
          });
        }, error => {
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
    // Leave the lines as is for the providers you want to offer your users.
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: "<your-tos-url>",
  // Privacy policy url.
  privacyPolicyUrl: "<your-privacy-policy-url>",
};

ui.start("#firebaseui-auth-container", uiConfig);
