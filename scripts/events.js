var currentUser

function user_current() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);}})

}
user_current()

function displayEventCards(collection) {
    let cardTemplate = document.getElementById("eventCardTemplate");

    db.collection(collection).get()   //the collection called "events"
        .then(allEvents=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each event
            allEvents.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;
                var address = doc.data().address;
                var time = doc.data().time;       
                var date = doc.data().date;   
                var docID = doc.id;
				var eventcode = doc.data().code;    
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-location').innerHTML = address;
                newcard.querySelector('.card-time').innerHTML = time;
                newcard.querySelector('.card-date').innerHTML = date;
                newcard.querySelector('i').id = 'save-' + docID;
                newcard.querySelector('i').onclick = () => updateFavorite(docID);

                newcard.querySelector('.card-img').src = `./images/${eventcode}.jpg`;

                newcard.querySelector('.seeMoreButton').href = `/event.html?id=${doc.id}`; //link to event page

                 currentUser.get().then(userDoc => {
                    var favourites = userDoc.data().favorites;
                    if (favourites.includes(docID)) {
                       document.getElementById('save-' + docID).innerText = 'favorite';
                    }
              })
                document.getElementById(collection + "-go-here").appendChild(newcard);


            })
        })
}



function updateFavorite(eventDocID) {
    currentUser.get().then((userDoc)=>{
        let favoritesNow = userDoc.data().favorites;
        console.log(favoritesNow);

        if (favoritesNow.includes(eventDocID)){
            console.log("this event exist in the database,should be removed");
            currentUser.update({
            favorites: firebase.firestore.FieldValue.arrayRemove(eventDocID)
            }).then(()=>{
               let iconID = 'save-' + eventDocID;
            document.getElementById(iconID).innerText = 'favorite_border';})
        }
        else{
            console.log("this event does not exist in the database and should be added")
            currentUser.update({
                favorites: firebase.firestore.FieldValue.arrayUnion(eventDocID)
            }).then(()=>{
                let iconID = 'save-' + eventDocID;
             document.getElementById(iconID).innerText = 'favorite';})

        }



    })}

displayEventCards("events"); 