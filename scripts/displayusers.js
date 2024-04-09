function getCurrentUserData() {
  return new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log("No user is signed in");
      reject("No user signed in");
      return;
    }

    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve(doc.data());
        } else {
          reject("User data not found");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        reject(error);
      });
  });
}

function displayUsers(users) {
  getCurrentUserData()
    .then((currentUserData) => {
      const currentUser = firebase.auth().currentUser; // Ensure currentUser is defined within this scope
      if (!currentUser) {
        console.log("No user is signed in.");
        return; // Exit if no user is signed in
      }

      const { sent_friend_requests, list_of_friends } = currentUserData;

      let cardTemplate = document.getElementById("userCardTemplate").content;
      let usersContainer = document.getElementById(users + "-go-here");

      db.collection(users)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // Exclude the current user, friends, and sent friend requests
            if (
              doc.id !== currentUser.uid && // checks if the doc ID is not the current user's ID
              !sent_friend_requests.includes(doc.id) &&
              !list_of_friends.includes(doc.id)
            ) {
              const userData = doc.data();
              console.log(userData.name);

              let userCard = document.importNode(cardTemplate, true);
              userCard.querySelector(".card-title").textContent = userData.name;
              userCard.querySelector(".btn-custom").dataset.uid = doc.id;

              // Check if profile_pic exists and is not empty, else set default image
              const profilePicUrl =
                userData.profile_pic && userData.profile_pic.trim() !== ""
                  ? userData.profile_pic
                  : "https://img.icons8.com/ios/50/000c5c/user-male-circle--v1.png";
              userCard.querySelector(".avatar").src = profilePicUrl;

              usersContainer.appendChild(userCard);
            }
          });
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.error(error));
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, now it's safe to call displayUsers
    console.log("User is signed in:", user.uid);
    displayUsers("users");
  } else {
    // No user is signed in.
    console.log("No user is signed in.");
  }
});
