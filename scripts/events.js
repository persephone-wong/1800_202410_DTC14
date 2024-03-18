function displayEventCards(collection) {
    let cardTemplate = document.getElementById("eventCardTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allEvents=> {
            var i = 1;  //Optional: if you want to have a unique ID for each event
            allEvents.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;
                var address = doc.data().address;
                var time = doc.data().time;       
                var description = doc.data().details;  // get value of the "details" key
								var hikeCode = doc.data().code;    
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-address').innerHTML = address;
                newcard.querySelector('.card-time').innerHTML = time;
                newcard.querySelector('.card-description').innerHTML = description;
                newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

                //unique ids to all elements for future use
                newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayEventCards("events"); 