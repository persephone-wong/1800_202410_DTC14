document.addEventListener('DOMContentLoaded', function () {
    const db = firebase.firestore();
    const auth = firebase.auth();

    const activitiesList = document.getElementById('activitiesList');
    const suggestionsList = document.getElementById('suggestionsList');
    const eventCards = document.getElementById('eventCards');

    function displayRecentActivities() {
        db.collection("events").orderBy("date", "desc").limit(5).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const eventItem = document.getElementById("activityTemplate").content.cloneNode(true);
                    eventItem.querySelector('h5').textContent = data.name;
                    eventItem.querySelector('small').textContent = data.date;
                    eventItem.querySelector('p').textContent = data.description;
                    activitiesList.appendChild(eventItem);
                });
            });
    }

    // Fetch and display friend suggestions (Mockup data as an example)
    function displayFriendSuggestions() {
        const friends = [
            { name: "John Doe", img: "path/to/image.jpg" },
            { name: "Jane Doe", img: "path/to/another/image.jpg" }
            // Assume these objects come from your Users collection or similar
        ];

        friends.forEach(friend => {
            const friendCard = document.getElementById("friendSuggestionTemplate").content.cloneNode(true);
            friendCard.querySelector('.card-title').textContent = friend.name;
            friendCard.querySelector('img').src = friend.img;
            suggestionsList.appendChild(friendCard);
        });
    }

    // Fetch and display upcoming events
    function displayUpcomingEvents() {
        db.collection("events").get().then(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data();
                const eventCard = document.getElementById("eventCardTemplate").content.cloneNode(true);
                eventCard.querySelector('.card-title').textContent = data.name;
                eventCard.querySelector('.card-text').textContent = data.description;
                eventCard.querySelector('img').src = `./images/${data.code}.jpg`; // Assumes images named by event code
                eventCard.querySelector('.btn-primary').href = `/event.html?id=${doc.id}`;
                eventCard.querySelector('.fav-button').addEventListener('click', function() {
                    alert('Favorite clicked for ' + data.name); // Placeholder for actual favorite logic
                });
                eventCards.appendChild(eventCard);
            });
        });
    }

    async function displayFriendsRecentActivities() {
        const friendsList = await fetchFriendsList(currentUserId);
        
        for (const friendId of friendsList) {
            await fetchAndDisplayFriendActivities(friendId);
        }
    }

    async function fetchFriendsList(userId) {
        const userRef = db.collection('Users').doc(userId);
        const doc = await userRef.get();
        if (!doc.exists) {
            console.log('No such user!');
        