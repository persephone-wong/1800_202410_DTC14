var currentUser

function user_current() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // users is the name of the collection in Firestore
            // user.uid is the unique identifier of the user
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);}})

}
user_current()

// collection is the name of the collection in Firestore
function displayEventCards(collection) {
    //cardTemplate is the template of the event card
    let cardTemplate = document.getElementById("eventCardTemplate");
    //the collection called "events"
    //orderBy("datestamp") is a firebase function to order the events by date
    // date is a timestamp
    db.collection(collection).orderBy("datestamp").get()   
        .then(allEvents=> {
            allEvents.forEach(doc => { //iterate thru each doc
                var title = doc.data().name; //get the name of the event = string
                var address = doc.data().address; //get the address of the event = string
                var time = doc.data().time; //get the time of the event = string
                var date = doc.data().date; //get the date of the event = string
                var docID = doc.id; //get the unique identifier of the event = string
				var eventcode = doc.data().code; //get the code of the event = string
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image on the card
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-location').innerHTML = address;
                newcard.querySelector('.card-time').innerHTML = time;
                newcard.querySelector('.card-date').innerHTML = date;
                newcard.querySelector('i').id = 'save-' + docID;
                newcard.querySelector('i').onclick = () => updateFavorite(docID);
                newcard.querySelector('.card-img').src = `./images/${eventcode}.jpg`; // Image of the event stored in the images folder
                newcard.querySelector('.seeMoreButton').href = `/event.html?id=${doc.id}`; // Link to the event page 
                currentUser.get().then(userDoc => {
                var favourites = userDoc.data().favorites; //get the favorite events of the current user = array
                if (favourites.includes(docID)) { //if the event is in the favorite list
                    //change the icon to a filled heart
                    document.getElementById('save-' + docID).innerText = 'favorite';}}) 
                    //append the new card to the collection
                    document.getElementById(collection + "-go-here").appendChild(newcard);})})}


// function to update the favorite list
// eventDocID is the unique identifier of the event = string
function updateFavorite(eventDocID) {
    //userDoc is the document of the current user
    currentUser.get().then((userDoc)=>{
    // favoritesNow is the array of the favorite events of the current user
    // userDoc.data().favorites; is the array of the favorite events of the current user
    let favoritesNow = userDoc.data().favorites;
    console.log(favoritesNow);
    //if the event is already in the favorite list, remove it
    if (favoritesNow.includes(eventDocID)){
        console.log("this event exist in the database,should be removed");
        //iconID is the unique identifier of the icon = string
        let iconID = 'save-' + eventDocID;
        document.getElementById(iconID).innerText = 'favorite_border';
        //remove the event from the favorite list from the database of the current user
        currentUser.update({
        //firebase.firestore.FieldValue.arrayRemove(eventDocID) is a firebase function to remove an element from an array
        //eventDocID is the unique identifier of the event = string
        favorites: firebase.firestore.FieldValue.arrayRemove(eventDocID)})}
    else{
        console.log("this event does not exist in the database and should be added")
        //iconID is the unique identifier of the icon = string
        let iconID = 'save-' + eventDocID;
        //change the icon to a filled heart
        document.getElementById(iconID).innerText = 'favorite';
        //add the event to the favorite list from the database of the current user
        currentUser.update({
        //firebase.firestore.FieldValue.arrayUnion(eventDocID) is a firebase function to add an element to an array
        //eventDocID is the unique identifier of the event = string
        favorites: firebase.firestore.FieldValue.arrayUnion(eventDocID)})}})}

        
displayEventCards("events"); 