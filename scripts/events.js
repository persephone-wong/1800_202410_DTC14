function generateEvents() {
    //define a variable for the collection you want to create in Firestore to populate data
    var generateEvents = db.collection("events");

    eventsRef.add({
        code: "VA04",
        name: "Granville St. Annual Street Party",
        city: "Vancouver",
        Address: "1115 Granville St, Vancouver, BC V6Z 1M1",
        location: [49.27825048930894, -123.12517188465652],
        date: "April 27th, 2024",
        start_time: "6:00 AM to 6:00 PM",
        typical_wait_time: 1200,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "Get ready to take to the streets and celebrate community spirit at our Block Bash Bonanza! Join us for an unforgettable day filled with live music, delicious food, and non-stop entertainment. Dance to the rhythm of local bands, sample mouthwatering street food from gourmet vendors, and browse through artisanal stalls showcasing unique crafts and treasures. With activities for all ages, from face painting to interactive games, this street party promises fun and excitement for everyone. Don't miss out on the biggest block party of the year – come and make memories with us!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA01",
        name: "Soundwave Showcase: Vancouver's Premier Music Fair", 
        city: "Vancouver",
        location: [49.281958459623326, -123.14074928449976],
        address: "Vancouver, BC V6E 1V3",
        date: "May 10th, 2024",
        time: "6:30 PM to 10:00 PM",
        typical_wait_time: 600,
        age_range: "adults only",
        lower_bound: 19,
        upper_bound: 100,
        age_restricted: true,
        description: "Get ready to groove at the ultimate music fair! Join us for a day filled with rhythm, melody, and unforgettable vibes. Discover a treasure trove of vinyl records, rare CDs, and musical memorabilia. Whether you're a die-hard collector or a casual enthusiast, there's something for everyone. Live performances, interactive workshops, and food trucks will keep the atmosphere buzzing. Mark your calendar and let the music take you on a journey!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA02",
        name: "Flavors on Wheels: A Culinary Journey on the Go",
        city: "Vancouver",
        location: [49.265251598218455, -123.10654415582064],
        address: "76 W 6th Ave #300, Vancouver, BC V5Y 1K1",
        date: "April 21st, 2024",
        time: "1:00 PM to 5:00 PM",
        typical_wait_time: 3000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "🎉 Embark on a gastronomic adventure like no other at Flavors on Wheels! Indulge your taste buds in a tantalizing array of cuisines, all conveniently served from our fleet of food trucks. From sizzling street tacos to gourmet sliders, there's something to satisfy every craving. Enjoy live music, vibrant atmosphere, and mouthwatering delights that promise to tantalize your senses. Join us for a foodie extravaganza that's sure to leave you craving for more!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA03",
        name: "Adidas Warehouse Sale",
        city: "Vancouver",
        location: [49.289266118228554, -123.11686929190368],
        address: "Vancouver Convention Centre, Canada Place, Vancouver, BC",
        date: "Friday, April 10st",
        time: "5:00 AM to 3:00 PM",
        typical_wait_time: 10000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "Calling all athletes, sneakerheads, and fashion enthusiasts! Get ready to elevate your style and performance at the Adidas Warehouse Sale. Dive into a treasure trove of premium sportswear, iconic sneakers, and stylish apparel – all at unbeatable prices. Whether you're gearing up for the gym, hitting the streets in style, or chasing your athletic dreams, you'll find everything you need to fuel your passion. With discounts that'll make your heart race and deals you won't find anywhere else, this is your chance to level up your wardrobe without breaking the bank. Don't miss out – join us for the ultimate Adidas shopping experience!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "VA04",
        name: "Canvas Cascades: Vancouver's Art Pop-Up Experience",
        city: "Vancouver",
        location: [49.26757366882277, -123.09233424402358],
        address: "Emily Carr, 520 E 1st Ave, Vancouver, BC V5T 0H2",
        date: "Friday, April 10st",
        time: "12:30 PM to 8:00 PM",
        typical_wait_time: 10000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "Step into a world where creativity knows no bounds at Canvas Cascades, Vancouver's Art Pop-Up Experience! Immerse yourself in a kaleidoscope of colors, textures, and forms as local artists unveil their masterpieces in a dynamic showcase. From captivating paintings to thought-provoking sculptures, each piece tells a unique story waiting to be discovered. Engage with artists, ignite your imagination, and find the perfect addition to your collection. Join us for a celebration of artistry, community, and inspiration!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "RC01",
        name: "Harmony in Motion: A Celebration of Chinese Performing Arts",
        city: "Richmond",
        location: [49.167237184937534, -123.1471776630757],
        address: "6500 Gilbert Rd., Richmond, BC V7C 3V4",
        date: "Friday, March 31st",
        time: "8:30 AM to 3:30 PM",
        typical_wait_time: 12000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "Embark on a mesmerizing journey through the rich tapestry of Chinese culture at 'Harmony in Motion: A Celebration of Chinese Performing Arts'. Immerse yourself in a spectacle of traditional and contemporary performances, showcasing the graceful elegance of classical dance, the intricate melodies of traditional music, and the captivating storytelling of Chinese opera. From breathtaking acrobatics to soul-stirring martial arts displays, this festival promises to ignite the senses and transport audiences to the heart of China's artistic heritage. Join us for an unforgettable experience of cultural immersion and artistic excellence.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "RC02",
        name: "FandomFiesta: Where Passion Meets Pop Culture",
        city: "Richmond",
        location: [49.170923556818344, -123.14168043238847],
        address:"Richmond Conference Centre, 7551 Westminster Hwy, Richmond, BC V6X 1A3"
        date: "Friday, March 31st",
        time: "8:30 AM to 3:30 PM",
        typical_wait_time: 12000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "FandomFiesta invites you to revel in a kaleidoscope of pop culture delights! Dive deep into the heart of your favorite fandoms, from beloved movies and TV shows to gaming, comics, and beyond. Join fellow enthusiasts for a weekend of immersive experiences, exclusive panels, meet-and-greets with special guests, cosplay contests, and endless opportunities to celebrate what makes your passions truly shine. Whether you're a die-hard Potterhead, a gaming guru, or a comic book aficionado, FandomFiesta promises an electrifying celebration where fans become family and memories are made to last a lifetime. Don't miss your chance to be part of this epic gathering of like-minded fans – come and make your mark on the pop culture landscape at FandomFiesta!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "NV02",
        name: "VinoVibe: A Celebration of Wine Culture",
        city: "North Vancouver",
        location: [49.319623077932974, -123.10821553237884],
        address: "225 Pemberton Ave, North Vancouver, BC V7P 1E9",
        date: "Thursday, April 11th",
        time: "10:30 AM to 4:30 PM",
        typical_wait_time: 12000,
        age_range: "adults only",
        lower_bound: 19,
        upper_bound: 100,
        age_restricted: true,
        description: "Indulge your senses at VinoVibe, where wine enthusiasts gather to celebrate the artistry and allure of the vine. Immerse yourself in a world of swirling aromas, rich flavors, and conviviality as you explore an array of exquisite wines from renowned vineyards. From crisp whites to velvety reds, each sip tells a story of terroir and tradition. Engage with passionate vintners, participate in captivating tastings, and expand your oenophilic horizons. Whether you're a seasoned connoisseur or a curious newcomer, VinoVibe promises an unforgettable journey through the enchanting realm of wine culture. Raise your glass and join us for an unparalleled experience of elegance, exploration, and enjoyment.",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    eventsRef.add({
        code: "NV01",
        name: "Cascade Harvest Market: Where Nature's Bounty Meets Community",
        city: "North Vancouver",
        location: [49.30964652743216, -123.07877762942363],
        address: "125 Victory Ship Way Unit #110, Vancouver, BC V7L 0G5",
        date: "Sunday, April 7th",
        time: "8:30 AM to 3:30 PM",
        typical_wait_time: 12000,
        age_range: "all ages",
        lower_bound: 0,
        upper_bound: 100,
        age_restricted: false,
        description: "Welcome to Green Haven Farmers Market! Discover fresh, local produce, artisanal crafts, and gourmet delights in the heart of North Vancouver. Join us for a vibrant community experience every week!",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });

}

generateEventsHikes();