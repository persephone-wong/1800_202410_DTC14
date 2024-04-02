document.addEventListener('DOMContentLoaded', async () => {
    const db = firebase.firestore();
    const auth = firebase.auth();

    const elements = {
        activitiesList: document.getElementById('activitiesList'),
        suggestionsList: document.getElementById('suggestionsList'),
        eventCards: document.getElementById('eventCards')
    };

    // Utilize template literals for IDs
    const templates = {
        activity: document.getElementById("activityTemplate"),
        friendSuggestion: document.getElementById("friendSuggestionTemplate"),
        eventCard: document.getElementById("eventCardTemplate")
    };

    // Error handling wrapper
    const safelyExecute = async (operation, errorHandler = console.error) => {
        try {
            await operation();
        } catch (error) {
            errorHandler(error);
        }
    };

    const truncateText = (text, maxLength) => text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;

    const calculateDaysDifference = (date) => {
        const now = new Date();
        const diffTime = Math.abs(date - now);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const displayRecentActivities = async () => {
        const now = firebase.firestore.Timestamp.now();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        console.log(sevenDaysAgo);
        
        const querySnapshot = await db.collection("events")
                                       .where("datestamp", ">=", firebase.firestore.Timestamp.fromDate(sevenDaysAgo))
                                       .orderBy("datestamp", "asc")
                                       .limit(4)
                                       .get();
        querySnapshot.forEach(doc => {
            const data = doc.data();
            data.datestamp = data.datestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
            createActivityItem({...data, daysAgo: calculateDaysDifference(data.datestamp),}, templates.activity, elements.activitiesList, true, doc.id);
        });
    };

    const displayFriendSuggestions = async () => {
        const querySnapshot = await db.collection("users").limit(10).get();
        const friends = [];
        querySnapshot.forEach(doc => {
            const friendWithId = { id: doc.id, ...doc.data() }; // Include the document ID
            friends.push(friendWithId);
        });
    
        const selectedFriends = friends.sort(() => 0.5 - Math.random()).slice(0, 4);
        selectedFriends.forEach(friend => createFriendSuggestionItem(friend, templates.friendSuggestion, elements.suggestionsList));
    };    

    const displayUpcomingEvents = async () => {
        const now = firebase.firestore.Timestamp.now();
        db.collection("events")
          .where("datestamp", ">=", now)
          .orderBy("datestamp")
          .limit(10)
          .get()
          .then(querySnapshot => {
              if (querySnapshot.empty) {
                  console.log('No upcoming events found.');
                  return;
              }
              querySnapshot.forEach(doc => {
                  const data = doc.data();
                  data.datestamp = data.datestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
                  createEventCardItem({...data, daysUntil: calculateDaysDifference(data.datestamp)}, templates.eventCard, elements.eventCards, doc.id);
              });
          })
          .catch(error => console.error("Error fetching upcoming events:", error));
    };
    

    function createActivityItem(data, template, container, isRecent, id) {
        const clone = template.content.cloneNode(true);
        clone.querySelector('a').href = `./event.html?id=${id}`;
        clone.querySelector('h5').textContent = data.name;
        const dateText = `${isRecent ? `${data.daysAgo} days ago` : `in ${data.daysUntil} days`}`;
        clone.querySelector('small').innerHTML = `<span style="color:${isRecent ? 'red' : 'green'}">${dateText}</span>`;
        clone.querySelector('p').textContent = truncateText(data.description, 100);
        container.appendChild(clone);
    }

    function createFriendSuggestionItem(friend, template, container) {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.card-title').textContent = friend.name;
        clone.querySelector('img').src = friend.img || './images/friend1.png'; // Fallback to default image if none is provided
    
        const addFriendButton = clone.querySelector('.add-friend-button');
        addFriendButton.setAttribute('data-recipient-id', friend.id);
        addFriendButton.addEventListener('click', async function(event) {
            this.disabled = true; // Disable button to prevent multiple clicks
            try {
                await sentToFriend(this.getAttribute('data-recipient-id'));
                this.parentElement.innerHTML += '<p class="result-text">Friend request sent successfully!</p>';
            } catch (error) {
                console.error('Failed to send friend request:', error);
                this.parentElement.innerHTML += '<p class="result-text">Failed to send friend request.</p>';
            }
        });
    
        container.appendChild(clone);
    }    

    function createEventCardItem(data, template, container, id) {
        const clone = template.content.cloneNode(true);
        clone.querySelector('.card-title').textContent = data.name;
        clone.querySelector('.card-text').textContent = truncateText(data.description, 100);
        clone.querySelector('img').src = `./images/${data.code}.jpg`;
    
        const daysUntil = calculateDaysDifference(data.datestamp);
        const dateText = `in ${daysUntil} days`;
        clone.querySelector('.date-info').innerHTML = `<span style="color:green">${dateText}</span>`;

        clone.querySelector('a').href = `./event.html?id=${id}`;
    
        container.appendChild(clone);
    }
    

    // Auth state change logic
    auth.onAuthStateChanged(user => {
        if (user) {
            safelyExecute(() => displayRecentActivities());
            safelyExecute(() => displayFriendSuggestions());
            safelyExecute(() => displayUpcomingEvents());
            // assuming displayFriendsRecentActivities function exists
        } else {
            console.log("No user is logged in.");
        }
    });
});
