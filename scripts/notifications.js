document.addEventListener("DOMContentLoaded", function() {
    const db = firebase.firestore();
    let currentUser;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            fetchAndDisplayFriendRequests();
            fetchAndDisplayReviewsAndCheckIns();
        }
    });

    function fetchAndDisplayFriendRequests() {
        currentUser.get().then(doc => {
            const userData = doc.data();
            const receivedFriendRequests = userData.received_friend_requests || [];
            
            receivedFriendRequests.forEach(userId => {
                db.collection('users').doc(userId).get().then(userDoc => {
                    const userName = userDoc.data().name;
                    displayFriendRequest(userName, userId);
                });
            });
        });
    }

    function displayFriendRequest(name, userId) {
        let template = document.getElementById('friend-request-template').content.cloneNode(true);
        template.querySelector('strong').textContent = name;
        
        const acceptButton = template.querySelector('.btn-primary');
        const deleteButton = template.querySelector('.btn-secondary');

        acceptButton.addEventListener('click', () => {
            // For now, do nothing
        });

        deleteButton.addEventListener('click', () => {
            // For now, do nothing
        });

        document.getElementById('friend-requests').appendChild(template);
    }

    // function removeFriendRequest(userId) {
    //     // removing the friend request ID from the currentUser's document
    //     currentUser.update({
    //         received_friend_requests: firebase.firestore.FieldValue.arrayRemove(userId)
    //     }).then(() => {
    //         // Reload friend requests to reflect changes
    //         document.getElementById('friend-requests').innerHTML = '';
    //         fetchAndDisplayFriendRequests();
    //     });
    // }

    function fetchAndDisplayReviewsAndCheckIns() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        // Fetch reviews
        db.collection('reviews').where('timestamp', '>=', weekAgo).get().then(snapshot => {
            snapshot.forEach(doc => {
                const review = doc.data();
                const reviewTimestamp = review.timestamp.toDate();

                db.collection('users').doc(review.userID).get().then(userDoc => {
                    const userName = userDoc.data().name;
                    displayNotification('review', userName, reviewTimestamp);
                });
            });
        });

        // Fetch check-ins
        db.collection('events').get().then(snapshot => {
            snapshot.forEach(eventDoc => {
                const event = eventDoc.data();
                event.check_ins.forEach(userId => {
                    db.collection('users').doc(userId).get().then(userDoc => {
                        const userName = userDoc.data().name;
                        const eventTimestamp = event.datestamp.toDate();
                        displayNotification('check-in', userName, eventTimestamp);
                    });
                });
            });
        });
    }

    function displayNotification(type, userName, timestamp) {
        let templateId = '';
        if (type === 'review') {
            templateId = 'review-template';
        } else if (type === 'check-in') {
            templateId = 'check-in-template';
        }

        let template = document.getElementById(templateId).content.cloneNode(true);
        template.querySelector('strong').textContent = userName;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const containerId = timestamp >= todayStart ? 'notifications-container' : 'last-7-days-container';
        document.getElementById(containerId).appendChild(template);
    }

});
