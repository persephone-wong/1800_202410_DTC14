function displayEventInfo() {
    let params = new URLSearchParams(window.location.search);
    let ID = params.get("id"); // Get value for key "id"
    console.log(ID);
    
    let cardTemplate = document.getElementById("eventCardTemplate");
    let card = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

  
    db.collection("events")
      .doc(ID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          var data = doc.data();
          var name = data.name;
          var location = data.address;
          var time = data.time;
          var date = data.date;
          var description = data.description;
          var eventCode = data.code;
          var waitTime = data.typical_wait_time;
  
          card.querySelector(".eventName").innerHTML = name;
          card.querySelector(".eventLocation").innerHTML = location;
          card.querySelector(".eventTime").innerHTML = time;
          card.querySelector(".eventDate").innerHTML = date;
          card.querySelector(".eventDetails").innerHTML = description;
          card.querySelector(".historicTimeWait").innerHTML = waitTime;
  
          let imgEvent = card.querySelector(".eventImage");
          imgEvent.src = "../images/" + eventCode + ".jpg";
          document.getElementById("eventContainer").appendChild(card);
        } else {
          console.log("No such document!");
        }
      }).catch(error => console.error("Error fetching document:", error));
  }
  displayEventInfo();
  
  function goBack() {
    window.history.back();
  }
  