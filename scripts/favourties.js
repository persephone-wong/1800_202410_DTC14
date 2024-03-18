import { getAuth, onAuthStateChanged } from "firebase/auth";




function displayEventCards(collection) {
    let cardTemplate = document.getElementById("eventCardTemplate");

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    db.collection(users).get(uid)   //the collection called "events"
    .then(allEvents=> {
        //var i = 1;  //Optional: if you want to have a unique ID for each event
        allEvents.forEach(doc => { //iterate thru each doc
            var favourites = doc.data().list_of_favourite;



            // //unique ids to all elements for future use
             //newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
             //newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
             //newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

            //attach to gallery, Example: "hikes-go-here"
            document.getElementById(collection + "-go-here").appendChild(newcard);

            //i++;   //Optional: iterate variable to serve as unique ID
        })
    })

    // ...
    } else {
    // User is signed out
    // ...
  }
});
}


displayEventCards("events"); 