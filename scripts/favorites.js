function getuser() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            getFavorites(user)
        } else {
            console.log("No user is signed in");
        }
    });
}


function getFavorites(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            var favorites = userDoc.data().favorites;
            console.log(favorites);
						
						// Get pointer the new card template
            let cardTemplate = document.getElementById("eventCardTemplate");

            favorites.forEach(eventID => {
                console.log(eventID);
                db.collection("events").doc(eventID)
                .get().then(doc => {
                    var title = doc.data().name;
                    var address = doc.data().address;
                    var time = doc.data().time;       
                    var date = doc.data().date;   
                    var docID = doc.id;
				    var eventcode = doc.data().code;    
                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
                    

                    //update title and some pertinant information
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-location').innerHTML = address;
                    newcard.querySelector('.card-time').innerHTML = time;
                    newcard.querySelector('.card-date').innerHTML = date;

                    newcard.querySelector('.card-img').src = `./images/${eventcode}.jpg`;

                    newcard.querySelector('.seeMoreButton').href = `/event.html?id=${doc.id}`; //link to event page


                    
                    document.getElementById("events-go-here").appendChild(newcard);
                })
            });
        })
}


getuser();




