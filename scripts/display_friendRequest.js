db.collection("users").get().then(
  (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
    });
  }
);

function display_friends(){ const user = auth.currentUser; console.log(user) }

// Initialize Firestore
 
function displayUsers(users) {
  let cardTemplate = document.getElementById("userCardTemplate").content;
  let usersContainer = document.getElementById(users + "-go-here");

  db.collection("users").get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const userData = doc.data();

        if (userData.received_friend_requests && userData.received_friend_requests.length > 0) {
          userData.received_friend_requests.forEach(friendRequestId => {
            db.collection("users").doc(friendRequestId).get()
              .then(friendRequestDoc => {
                const friendRequestData = friendRequestDoc.data();

                let userCard = document.importNode(cardTemplate, true);
                userCard.querySelector(".card-title").textContent = friendRequestData.name;
                userCard.querySelector(".card-text").textContent = friendRequestData.bio;
                userCard.querySelector(".btn-custom").dataset.uid = friendRequestId;

                document.getElementById(users + "-go-here").appendChild(userCard);
              })
              .catch(error => console.log(error));
          });
        }
      });
    })
    .catch(error => console.log(error));
}

displayUsers("users");
