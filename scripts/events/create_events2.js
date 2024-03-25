function generateEvents() {
    //define a variable for the collection you want to create in Firestore to populate data
    var eventsRef = db.collection("events");

    eventsRef.add({
        code: "VA06",
        name: "VanDusen Flower Fair: A Blooming Extravaganza",
        city: "Vancouver",
        Address: "5251 Oak St, Vancouver, BC V6M 4H1",
        location: [49.23960042950713, -123.13255502070677],
        date: "April 31th, 2024",
        start_time: "6:00 AM to 5:00 PM",
        typical_wait_time: 1800,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        type: "fair",
        age_restricted: false,
        description: "Immerse yourself in a vibrant tapestry of colors and fragrances at the annual Flower Fair at VanDusen Gardens. Stroll through enchanting displays of meticulously curated blooms, from delicate roses to exotic orchids, celebrating the beauty of nature in full bloom. Engage with expert horticulturists, gather inspiration for your own garden oasis, and delight in a myriad of activities for all ages.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA07",
        name: "Shakespeare in the Park Pavillion", 
        city: "Vancouver",
        location: [49.29962905295943, -123.13396817285737],
        address: "610 Pipeline Rd, Vancouver, BC V6G 1Z4",
        date: "May 20th, 2024",
        time: "6:30 PM to 10:00 PM",
        typical_wait_time: 600,
        age_range: "adults only",
        lower_bound: 19,
        upper_bound: 100,
        type: "performance",
        age_restricted: true,
        description: "Transport yourself to the enchanting world of William Shakespeare amidst the serene backdrop of nature at our Shakespeare in the Park event. Lose yourself in the timeless tales of star-crossed lovers, comedic mishaps, and tragic heroes, all performed under the open sky.Whether you're a seasoned Shakespeare enthusiast or a newcomer to his works, join us for an evening of unforgettable theater, where the magic of the Bard's words mingles with the rustle of leaves and the whisper of the wind.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA08",
        name: "Spotlight: UBC Stagecraft Spectacular",
        city: "Vancouver",
        location: [49.26810620709083, -123.2571927615336],
        address: "6354 Crescent Rd, Vancouver, BC V6T 1Z2",
        date: "May 1st, 2024",
        time: "2:00 PM to 6:00 PM",
        typical_wait_time: 1000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        type: "performance",
        description: "Experience the magic of UBC's finest talents on stage at 'Spotlight: UBC Stagecraft Spectacular.' From captivating dramas to toe-tapping musical numbers, join us for an evening of entertainment and artistry like no other.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA09",
        name: "Harmony: UBC Symphony Orchestra Performance",
        city: "Vancouver",
        location: [49.289266118228554, -123.11686929190368],
        address: "The Chan Centre for the Performance Arts, 6265 Crescent Rd, Vancouver, BC V6T 1Z1",
        date: "Saturday, April 20th",
        time: "11:00 AM to 1:00 PM",
        typical_wait_time: 10000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        type: "music",
        description: "Immerse yourself in the captivating melodies of the UBC Symphony Orchestra at 'Harmony.' Experience an evening of musical mastery as talented musicians bring classical compositions to life on stage. From timeless symphonies to contemporary pieces, join us for a mesmerizing journey through the power of orchestral harmony.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "BB01",
        name: "Bargains & Treasures: Burnaby Flea Market",
        city: "Burnaby",
        location: [49.25175866803527, -122.9685367183655],
        address: "3713 Kensington Ave, Burnaby, BC V5B 0A7",
        date: "Sunday, April 23rd",
        time: "8:00 AM to 2:00 PM",
        typical_wait_time: 10000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        type: "sale",
        description: "Discover hidden gems and unbeatable deals at the Burnaby Flea Market! Explore rows of stalls filled with unique finds, from vintage collectibles to handmade crafts. Whether you're a seasoned bargain hunter or just browsing, join us for a fun-filled day of shopping and exploration in Burnaby's vibrant marketplace.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA10",
        name: "Car-Fest 2024: A Celebration of Automotive Excellence",
        city: "Vancouver",
        location: [49.28588811010581, -123.04285965665338],
        address: "100 N Renfrew St, Vancouver, BC V5K 4W3",
        date: "Saturday, May 11th",
        time: "8:30 AM to 5:30 PM",
        typical_wait_time: 12000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        type: "convention",
        description: "Get ready for a high-octane celebration of all things automotive at CarFest! From classic beauties to cutting-edge supercars, CarFest showcases a dazzling array of vehicles sure to excite enthusiasts of all ages. Explore car displays, marvel at custom builds, and indulge in adrenaline-pumping activities like test drives and racing simulations. Join us for a thrilling day of horsepower, community, and endless automotive excitement!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA11",
        name: "Art of Wonder: A Celebration of Creativity",
        city: "Vancouver",
        location: [49.22995057301542, -123.15584778913741],
        address:"6191 West Blvd, Vancouver, BC V6M 3X3",
        date: "Friday, March 31st",
        time: "10:30 AM to 2:30 PM",
        typical_wait_time: 2000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        type: "art",
        age_restricted: false,
        description: "Embark on a journey of imagination and inspiration at 'Art of Wonder.' This enchanting event invites you to explore the boundless realms of creativity through captivating artworks, interactive installations, and thought-provoking performances. Delve into a world where curiosity knows no bounds and every corner reveals a new wonder. Join us for an unforgettable celebration of artistic expression, where the extraordinary awaits around every corner.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "WV01",
        name: "West Van Fair: A Community Celebration",
        city: "West Vancouver",
        location: [49.33140191846231, -123.16957076190705],
        address: "2121 Marine Dr, West Vancouver, BC V7V 4Y2",
        date: "Friday, May 10th",
        time: "10:30 AM to 4:30 PM",
        typical_wait_time: 13000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        type: "fair",
        description: "Experience the vibrant spirit of West Vancouver at the annual West Van Fair! Join us for a day filled with family-friendly fun, entertainment, and local delights. From artisanal crafts to delicious food vendors, there's something for everyone to enjoy. Dive into the bustling marketplace, groove to live music, and let the kids indulge in exciting activities. Don't miss out on this beloved community tradition, where neighbors come together to celebrate the best of West Van",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA12",
        name: "Strum & Song: Vancouver Folk Festival",
        city: "Vancouver",
        location: [49.27678496916819, -123.11200973238167],
        address: "777 Pacific Blvd, Vancouver, BC V6B 4Y8",
        date: "Saturday, June 1st",
        time: "12:30 PM to 9:30 PM",
        typical_wait_time: 12000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        type: "music",
        description: "Experience the soulful melodies and heartfelt storytelling of the Vancouver Folk Festival! Join us for a weekend of acoustic bliss, where the city's lush greenery becomes the backdrop for intimate performances by folk artists from around the globe. From traditional ballads to contemporary tunes, immerse yourself in the rich tapestry of folk music. Explore artisanal crafts, indulge in diverse culinary delights, and dance to the rhythm of community and culture. Don't miss this celebration of music, nature, and connection in the heart of Vancouver.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });

}

generateEvents();