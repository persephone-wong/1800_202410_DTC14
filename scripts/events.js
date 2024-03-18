function generateEvents() {
    //define a variable for the collection you want to create in Firestore to populate data
    var generateEvents = db.collection("events");

    eventsRef.add({
        code: "EV01",
        name: "Granville St. Annual Street Party", //replace with your own city?
        city: "Vancouver",
        location: "1115 Granville St, Vancouver, BC V6Z 1M1",
        date: "April 27th, 2024",
        start_time: "6:00 AM",
        typical_wait_time: 1200,
        age_range: "all ages",
            lower_bound: 0,
            upper_bound: 100,
        age_restricted: false,
        description: "Get ready to take to the streets and celebrate community spirit at our Block Bash Bonanza! Join us for an unforgettable day filled with live music, delicious food, and non-stop entertainment. Dance to the rhythm of local bands, sample mouthwatering street food from gourmet vendors, and browse through artisanal stalls showcasing unique crafts and treasures. With activities for all ages, from face painting to interactive games, this street party promises fun and excitement for everyone. Don't miss out on the biggest block party of the year – come and make memories with us!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hikesRef.add({
        code: "AM01",
        name: "Buntzen Lake Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        details: "Close to town, and relaxing",
        length: 10.5,      //number value
        hike_time: 80,     //number value
        lat: 49.3399431028579,
        lng: -122.85908496766939,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    hikesRef.add({
        code: "NV01",
        name: "Mount Seymour Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        details: "Amazing ski slope views",
        length: 8.2,        //number value
        hike_time: 120,     //number value
        lat: 49.38847101455571,
        lng: -122.94092543551031,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}