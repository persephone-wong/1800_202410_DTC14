db.collection("users").get().then(
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
      });
    }
  );
  
  // Initialize Firestore
   
  function displayUsers(users) {
    
    let cardTemplate = document.getElementById("userCardTemplate").content;
    let usersContainer = document.getElementById(users + "-go-here");
  
    db.collection(users).get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const userData = doc.data();
  
          let userCard = document.importNode(cardTemplate, true);
          userCard.querySelector(".card-title").textContent = userData.name;
          console.log(userCard.querySelector(".card-title").textContent)
          userCard.querySelector(".card-text").textContent = userData.bio;
          userCard.querySelector(".btn-custom").dataset.uid = doc.id;
  
          document.getElementById(users + "-go-here").appendChild(userCard);
  
        });
      })
      .catch(error => console.log(error));
  }
  
  displayUsers("users");
  