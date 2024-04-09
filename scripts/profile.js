document.addEventListener("DOMContentLoaded", function() {
    const db = firebase.firestore();
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // Fetch the user's profile data
            db.collection("users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    updateProfile(userData);
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
        } else {
            window.location.href = "index.html"; // Redirect to login page if not logged in
        }
    });
    
    function updateProfile(userData) {
        const profilePicUrl = userData.profile_pic && userData.profile_pic.trim() !== "" ?
            userData.profile_pic :
            "https://img.icons8.com/ios/500/000c5c/user-male-circle--v1.png"; // Default profile picture URL
    
        const userName = userData.name || "No Name"; // Default name if not provided
    
        document.querySelector(".avatar").src = profilePicUrl;
        document.getElementById("userName").textContent = userName;
    }
});
