function generateEvents() {
    // backup for the events collection in case of accidental deletion
    // this function will add the events back to the collection
    // eventsref is a reference to the events collection
    var eventsRef = db.collection("events");

    eventsRef.add({
        code: "VA04", //unique identifier for the event, string
        name: "Granville St. Annual Street Party", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        Address: "1115 Granville St, Vancouver, BC V6Z 1M1", //address of the event, string
        location: [49.27825048930894, -123.12517188465652], //latitude and longitude of the event, array
        date: "April 27th, 2024", //date of the event, string
        start_time: "6:00 AM to 6:00 PM", //time of the event, string
        typical_wait_time: 1200, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Get ready to take to the streets and celebrate community spirit at our Block Bash Bonanza! Join us for an unforgettable day filled with live music, delicious food, and non-stop entertainment. Dance to the rhythm of local bands, sample mouthwatering street food from gourmet vendors, and browse through artisanal stalls showcasing unique crafts and treasures. With activities for all ages, from face painting to interactive games, this street party promises fun and excitement for everyone. Don't miss out on the biggest block party of the year – come and make memories with us!",
        //last_updated is a timestamp that records the last time the event information was updated
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA01", //unique identifier for the event, string
        name: "Soundwave Showcase: Vancouver's Premier Music Fair", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        location: [49.281958459623326, -123.14074928449976], //latitude and longitude of the event, array
        address: "Vancouver, BC V6E 1V3", //address of the event, string
        date: "May 10th, 2024", //date of the event, string
        time: "6:30 PM to 10:00 PM", //time of the event, string
        typical_wait_time: 600, //typical wait time in seconds, integer
        age_range: "adults only", //age range of the event, string
        lower_bound: 19, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: true, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Get ready to groove at the ultimate music fair! Join us for a day filled with rhythm, melody, and unforgettable vibes. Discover a treasure trove of vinyl records, rare CDs, and musical memorabilia. Whether you're a die-hard collector or a casual enthusiast, there's something for everyone. Live performances, interactive workshops, and food trucks will keep the atmosphere buzzing. Mark your calendar and let the music take you on a journey!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA02", //unique identifier for the event, string
        name: "Flavors on Wheels: A Culinary Journey on the Go", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        location: [49.265251598218455, -123.10654415582064], //latitude and longitude of the event, array
        address: "76 W 6th Ave #300, Vancouver, BC V5Y 1K1", //address of the event, string
        date: "April 21st, 2024", //date of the event, string
        time: "1:00 PM to 5:00 PM", //time of the event, string
        typical_wait_time: 3000, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "🎉 Embark on a gastronomic adventure like no other at Flavors on Wheels! Indulge your taste buds in a tantalizing array of cuisines, all conveniently served from our fleet of food trucks. From sizzling street tacos to gourmet sliders, there's something to satisfy every craving. Enjoy live music, vibrant atmosphere, and mouthwatering delights that promise to tantalize your senses. Join us for a foodie extravaganza that's sure to leave you craving for more!",
        //last_updated is a timestamp that records the last time the event information was updated
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA03", //unique identifier for the event, string
        name: "Adidas Warehouse Sale", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        location: [49.289266118228554, -123.11686929190368], //latitude and longitude of the event, array
        address: "Vancouver Convention Centre, Canada Place, Vancouver, BC", //address of the event, string
        date: "Friday, April 10st", //date of the event, string
        time: "5:00 AM to 3:00 PM", //time of the event, string
        typical_wait_time: 10000, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Calling all athletes, sneakerheads, and fashion enthusiasts! Get ready to elevate your style and performance at the Adidas Warehouse Sale. Dive into a treasure trove of premium sportswear, iconic sneakers, and stylish apparel – all at unbeatable prices. Whether you're gearing up for the gym, hitting the streets in style, or chasing your athletic dreams, you'll find everything you need to fuel your passion. With discounts that'll make your heart race and deals you won't find anywhere else, this is your chance to level up your wardrobe without breaking the bank. Don't miss out – join us for the ultimate Adidas shopping experience!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA04", //unique identifier for the event, string
        name: "Canvas Cascades: Vancouver's Art Pop-Up Experience", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        location: [49.26757366882277, -123.09233424402358], //latitude and longitude of the event, array
        address: "Emily Carr, 520 E 1st Ave, Vancouver, BC V5T 0H2", //address of the event, string
        date: "Friday, April 10st", //date of the event, string
        time: "12:30 PM to 8:00 PM", //time of the event, string
        typical_wait_time: 10000, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Step into a world where creativity knows no bounds at Canvas Cascades, Vancouver's Art Pop-Up Experience! Immerse yourself in a kaleidoscope of colors, textures, and forms as local artists unveil their masterpieces in a dynamic showcase. From captivating paintings to thought-provoking sculptures, each piece tells a unique story waiting to be discovered. Engage with artists, ignite your imagination, and find the perfect addition to your collection. Join us for a celebration of artistry, community, and inspiration!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "RC01", //unique identifier for the event, string
        name: "Harmony in Motion: A Celebration of Chinese Performing Arts", //name of the event, string
        city: "Richmond", //city where the event is taking place, string
        location: [49.167237184937534, -123.1471776630757], //latitude and longitude of the event, array
        address: "6500 Gilbert Rd., Richmond, BC V7C 3V4", //address of the event, string
        date: "Friday, March 31st", //date of the event, string
        time: "8:30 AM to 3:30 PM", //time of the event, string
        typical_wait_time: 12000, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Embark on a mesmerizing journey through the rich tapestry of Chinese culture at 'Harmony in Motion: A Celebration of Chinese Performing Arts'. Immerse yourself in a spectacle of traditional and contemporary performances, showcasing the graceful elegance of classical dance, the intricate melodies of traditional music, and the captivating storytelling of Chinese opera. From breathtaking acrobatics to soul-stirring martial arts displays, this festival promises to ignite the senses and transport audiences to the heart of China's artistic heritage. Join us for an unforgettable experience of cultural immersion and artistic excellence.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "RC02", //unique identifier for the event, string
        name: "FandomFiesta: Where Passion Meets Pop Culture", //name of the event, string
        city: "Richmond", //city where the event is taking place, string
        location: [49.170923556818344, -123.14168043238847], //latitude and longitude of the event, array
        address:"Richmond Conference Centre, 7551 Westminster Hwy, Richmond, BC V6X 1A3", //address of the event, string
        date: "Friday, March 31st", //date of the event, string
        time: "8:30 AM to 3:30 PM", //time of the event, string
        typical_wait_time: 12000, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "FandomFiesta invites you to revel in a kaleidoscope of pop culture delights! Dive deep into the heart of your favorite fandoms, from beloved movies and TV shows to gaming, comics, and beyond. Join fellow enthusiasts for a weekend of immersive experiences, exclusive panels, meet-and-greets with special guests, cosplay contests, and endless opportunities to celebrate what makes your passions truly shine. Whether you're a die-hard Potterhead, a gaming guru, or a comic book aficionado, FandomFiesta promises an electrifying celebration where fans become family and memories are made to last a lifetime. Don't miss your chance to be part of this epic gathering of like-minded fans – come and make your mark on the pop culture landscape at FandomFiesta!",
        //last_updated is a timestamp that records the last time the event information was updated
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "NV02", //unique identifier for the event, string
        name: "VinoVibe: A Celebration of Wine Culture", //name of the event, string
        city: "North Vancouver", //city where the event is taking place, string
        location: [49.319623077932974, -123.10821553237884], //latitude and longitude of the event, array
        address: "225 Pemberton Ave, North Vancouver, BC V7P 1E9", //address of the event, string
        date: "Thursday, April 11th", //date of the event, string
        time: "10:30 AM to 4:30 PM", //time of the event, string
        typical_wait_time: 12000, //typical wait time in seconds, integer
        age_range: "adults only", //age range of the event, string
        lower_bound: 19, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        age_restricted: true, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Indulge your senses at VinoVibe, where wine enthusiasts gather to celebrate the artistry and allure of the vine. Immerse yourself in a world of swirling aromas, rich flavors, and conviviality as you explore an array of exquisite wines from renowned vineyards. From crisp whites to velvety reds, each sip tells a story of terroir and tradition. Engage with passionate vintners, participate in captivating tastings, and expand your oenophilic horizons. Whether you're a seasoned connoisseur or a curious newcomer, VinoVibe promises an unforgettable journey through the enchanting realm of wine culture. Raise your glass and join us for an unparalleled experience of elegance, exploration, and enjoyment.",
        //last_updated is a timestamp that records the last time the event information was updated
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        //unique identifier for the event, string
        code: "NV01",
        //name of the event, string
        name: "Cascade Harvest Market: Where Nature's Bounty Meets Community",
        //city where the event is taking place, string
        city: "North Vancouver",
        //latitude and longitude of the event, array
        location: [49.30964652743216, -123.07877762942363],
        //address of the event, string
        address: "125 Victory Ship Way Unit #110, Vancouver, BC V7L 0G5",
        //date of the event, string
        date: "Sunday, April 7th",
        //time of the event, string
        time: "8:30 AM to 3:30 PM",
        //typical wait time in seconds, integer
        typical_wait_time: 12000,
        //age range of the event, string
        age_range: "all ages",
        //lower age limit, integer
        lower_bound: 0,
        //upper age limit, integer
        upper_bound: 100,
        //whether the event is age-restricted, boolean
        age_restricted: false,
        //description of the event, string
        description: "Welcome to Green Haven Farmers Market! Discover fresh, local produce, artisanal crafts, and gourmet delights in the heart of North Vancouver. Join us for a vibrant community experience every week!",
        //last_updated is a timestamp that records the last time the event information was updated
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA06", //unique identifier for the event, string
        name: "VanDusen Flower Fair: A Blooming Extravaganza", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        Address: "5251 Oak St, Vancouver, BC V6M 4H1", //address of the event, string
        location: [49.23960042950713, -123.13255502070677], //latitude and longitude of the event, array
        date: "April 31th, 2024", //date of the event, string
        start_time: "6:00 AM to 5:00 PM", //time of the event, string
        typical_wait_time: 1800, //typical wait time in seconds, integer
        age_range: "all ages", //age range of the event, string
        lower_bound: 0, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        type: "fair", //type of the event, string
        age_restricted: false, //whether the event is age-restricted, boolean
        //description of the event, string
        description: "Immerse yourself in a vibrant tapestry of colors and fragrances at the annual Flower Fair at VanDusen Gardens. Stroll through enchanting displays of meticulously curated blooms, from delicate roses to exotic orchids, celebrating the beauty of nature in full bloom. Engage with expert horticulturists, gather inspiration for your own garden oasis, and delight in a myriad of activities for all ages.",
        //last_updated is a timestamp that records the last time the event information was updated
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA07", //unique identifier for the event, string
        name: "Shakespeare in the Park Pavillion", //name of the event, string
        city: "Vancouver", //city where the event is taking place, string
        location: [49.29962905295943, -123.13396817285737], //latitude and longitude of the event, array
        address: "610 Pipeline Rd, Vancouver, BC V6G 1Z4", //address of the event, string
        date: "May 20th, 2024", //date of the event, string
        time: "6:30 PM to 10:00 PM", //time of the event, string
        typical_wait_time: 600, //typical wait time in seconds, integer
        age_range: "adults only", //age range of the event, string
        lower_bound: 19, //lower age limit, integer
        upper_bound: 100, //upper age limit, integer
        type: "performance", //type of the event, string
        age_restricted: true, //whether the event is age-restricted, boolean
        //description of the event, string
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