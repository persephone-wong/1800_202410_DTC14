db.collection("users").get().then(
  (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
    });
  }
);

function displayUsers(users) {
  let cardTemplate = document.getElementById("userCardTemplate").content;
  let usersContainer = document.getElementById(users + "-go-here");
  let processedUserIds = new Set(); // Store the processed user IDs in a Set

  db.collection("users").get()
   .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        const userData = doc.data();

        if (userData.received_friend_requests && userData.received_friend_requests.length > 0) {
          userData.received_friend_requests.forEach(friendRequestId => {
            if (!processedUserIds.has(friendRequestId)) { // Check if the user ID is already processed
              processedUserIds.add(friendRequestId); // Add the user ID to the Set
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
            }
          });
        }
      });
    })
   .catch(error => console.log(error));
}

displayUsers("users");

function deleteCard(cardElement) {
  cardElement.remove();
}
