// Description: This script is responsible for displaying friend suggestions on the friends page.

document.addEventListener("DOMContentLoaded", async () => {
  const db = firebase.firestore();
  const auth = firebase.auth();

  const elements = {
    suggestionsList: document.getElementById("suggestionsList"),
  };

  // Utilize template literals for IDs
  const templates = {
    friendSuggestion: document.getElementById("friendSuggestionTemplate"),
  };

  // Error handling wrapper
  const safelyExecute = async (operation, errorHandler = console.error) => {
    try {
      await operation();
    } catch (error) {
      errorHandler(error);
    }
  };

  // Display friend suggestions
  const displayFriendSuggestions = async () => {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      console.log("No user is logged in.");
      return; // Exit if no user is logged in
    }
    const currentUserId = currentUser.uid; // Get the current user's ID

    const querySnapshot = await db.collection("users").limit(10).get();
    const friends = [];
    querySnapshot.forEach((doc) => {
      if (doc.id !== currentUserId) {
        // Exclude the current user
        const friendWithId = { id: doc.id, ...doc.data() }; // Include the document ID
        friends.push(friendWithId);
      }
    });

    // Randomly select 4 friends from the list
    const selectedFriends = friends.sort(() => 0.5 - Math.random()).slice(0, 4);
    selectedFriends.forEach((friend) =>
      createFriendSuggestionItem(
        friend,
        templates.friendSuggestion,
        elements.suggestionsList
      )
    );
  };

  // Create a friend suggestion item
  function createFriendSuggestionItem(friend, template, container) {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".card-title").textContent = friend.name;

    // Check if friend.img exists and is not empty, else set default image
    const profilePicUrl =
      friend.profile_pic && friend.profile_pic.trim() !== ""
        ? friend.profile_pic
        : "https://img.icons8.com/ios/500/000c5c/user-male-circle--v1.png";
    clone.querySelector("img").src = profilePicUrl; // Set the src attribute to either the friend's image or the default image
    clone.querySelector("img").alt = friend.name; // Set alt text to friend's name for accessibility

    // Add event listener to the "Add Friend" button
    const addFriendButton = clone.querySelector(".add-friend-button");
    addFriendButton.setAttribute("data-recipient-id", friend.id);
    addFriendButton.addEventListener("click", async function (event) {
      this.disabled = true; // Disable button to prevent multiple clicks
      try {
        // Call the existing function from addFriends.js without changing its implementation
        await sentToFriend(this.getAttribute("data-recipient-id"));
        this.parentElement.innerHTML +=
          '<p class="result-text">Friend request sent successfully!</p>';
      } catch (error) {
        console.error("Failed to send friend request:", error);
        this.parentElement.innerHTML +=
          '<p class="result-text">Failed to send friend request.</p>';
      }
    });

    container.appendChild(clone);
  }

  // Auth state change logic
  auth.onAuthStateChanged((user) => {
    if (user) {
      safelyExecute(() => displayFriendSuggestions());
    } else {
      console.log("No user is logged in.");
    }
  });
});
