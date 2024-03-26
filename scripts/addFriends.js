function sendFriendRequest(senderId, recipientId) {
    const senderRef = database.ref(`/users/${senderId}`);
    const recipientRef = database.ref(`/users/${recipientId}`);

    const senderRequestKey = senderRef.child('sent_friends_requests').push().key;
    const recipientRequestKey = recipientRef.child('received_friends_requests').push().key;

    const senderRequest = {
        to_user_id: recipientId,
        status: "pending"
    };

    const recipientRequest = {
        from_user_id: senderId,
        status: "pending"
    };

    const updates = {};
    updates[`/users/${senderId}/friend_requests_sent/${senderRequestKey}`] = senderRequest;
    updates[`/users/${recipientId}/friend_requests_received/${recipientRequestKey}`] = recipientRequest;

    return database.ref().update(updates)
        .then(() => {
            console.log('Friend request sent successfully!');

            // Check if the recipient has accepted the friend request
            return recipientRef.child(`friend_requests_received/${recipientRequestKey}`).once('value');
        })
        .then((snapshot) => {
            const request = snapshot.val();
            if (request && request.status === "accepted") {
                // Update sender's friend list
                const senderFriendRef = senderRef.child('friends');
                senderFriendRef.update({ [recipientId]: true });

                // Update recipient's friend list
                const recipientFriendRef = recipientRef.child('friends');
                recipientFriendRef.update({ [senderId]: true });

                console.log('Friend request accepted! Users are now friends.');
            } else {
                console.log('Friend request is pending acceptance.');
            }
        })
        .catch((error) => {
            console.error('Error sending friend request:', error);
        });
}

// Usage example
const senderId = "sender_user_id"; // ID of the user sending the request
const recipientId = "recipient_user_id"; // ID of the user receiving the request

sendFriendRequest(senderId, recipientId);
