function displayEventInfo() {
    let params = new URLSearchParams(window.location.search);
    let ID = params.get("id"); // Get value for key "id"
    console.log(ID);
  
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
  
          document.querySelector(".eventName").innerHTML = name;
          document.querySelector(".eventLocation").innerHTML = location;
          document.querySelector(".eventTime").innerHTML = time;
          document.querySelector(".eventDate").innerHTML = date;
          document.querySelector(".eventDetails").innerHTML = description;
          document.querySelector(".historicTimeWait").innerHTML = waitTime;
  
          let imgEvent = document.querySelector(".eventImage");
          imgEvent.src = "../images/" + eventCode + ".jpg";
        } else {
          console.log("No such document!");
        }
      }).catch(error => console.error("Error fetching document:", error));
  }
  displayEventInfo();
  
  function goBack() {
    window.history.back();
  }
  