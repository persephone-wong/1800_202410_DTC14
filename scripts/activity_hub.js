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
            return [];
        }
        return doc.data().list_of_friends || [];
    }

    async function fetchAndDisplayFriendActivities(friendId) {
        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));

        // Fetch recent check-ins and reviews
        const checkInsQuery = db.collection('Check_ins').where('user_uid', '==', friendId).where('time', '>=', twoDaysAgo);
        const reviewsQuery = db.collection('Reviews').where('user_uid', '==', friendId).where('date', '>=', twoDaysAgo);

        const [checkInsSnapshot, reviewsSnapshot] = await Promise.all([checkInsQuery.get(), reviewsQuery.get()]);

        checkInsSnapshot.forEach(doc => {
            const checkIn = doc.data();
            addActivityToDOM(`${friendId} checked in at ${checkIn.event_uid}`, checkIn.time.toDate());
        });

        reviewsSnapshot.forEach(doc => {
            const review = doc.data();
            addActivityToDOM(`${friendId} reviewed ${review.event_uid}: ${review.reviewText}`, review.date.toDate());
        });
    }

    function addActivityToDOM(text, date) {
        const element = document.createElement('div');
        element.classList.add('list-group-item');
        element.textContent = `${text} - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        activitiesList.appendChild(element);
    }

    auth.onAuthStateChanged(user => {
        if (user) {
            const currentUserId = user.uid;

            displayRecentActivities();
            displayFriendSuggestions();
            displayUpcomingEvents();
            displayFriendsRecentActivities(currentUserId); // Corrected to use the authenticated user's ID
        } else {
            console.log("No user is logged in.");
        }
    });
});
