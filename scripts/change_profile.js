function getuser() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user);
            display_current_profile(user);} 
        else {
            console.log("No user is signed in");}});}

// Function to display the current user's profile picture
function display_current_profile(user){
    db.collection("users").doc(user.uid).get()
    .then(userDoc => {
    // Get the profile picture URL from the user document in Firestore
    var pfp = userDoc.data().profile_pic && userDoc.data().profile_pic.trim() !== "" ?
    userDoc.data().profile_pic :
    "https://img.icons8.com/ios/500/000c5c/user-male-circle--v1.png"; // Default profile picture URL
    console.log(pfp);
    // Set the profile picture URL in local storage
    localStorage.setItem('profilePicUrl', pfp); //profile picture url is stored in local storage, string
    var imgElement = document.getElementById("currentPfp"); // imgelement is the element with the id "currentPfp"
    // Set the source of the image element to the profile picture URL
    imgElement.src = pfp; // Assuming 'pfp' is a valid URL to the profile picture
})
    .catch(error => {
        console.log("Error getting user document:", error);
    });
}

var ImageFile;
function listenFileSelect(){
    var fileInput = document.getElementById("mypic-input");
    fileInput.addEventListener('change', function (e) {
        ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);
        document.getElementById("mypic-goes-here").src = blob; // Display the selected image
    });
}

listenFileSelect();

function savePost() {
    var storageRef = storage.ref("images/" + firebase.auth().currentUser.uid + ".jpg");

    storageRef.put(ImageFile)
    .then(function () {
        console.log('Uploaded to Cloud Storage.');

        storageRef.getDownloadURL()
        .then(function (url) {
            console.log("Got the download URL:", url);
            
            // Update the profile_pic field for the user in Firestore
            db.collection("users").doc(firebase.auth().currentUser.uid).update({
                profile_pic: url
            })
            .then(() => {
                console.log('Profile picture updated in Firestore.');
                alert("Profile picture updated successfully!");

                // Display the updated profile picture on the page
                document.getElementById("currentPfp").src = url;

                // Update the profile picture URL in local storage
                localStorage.setItem('profilePicUrl', url);
            })
            .catch(error => {
                console.error("Error updating profile picture in Firestore:", error);
            });
        })
        .catch(error => {
            console.log("Error getting download URL:", error);
        });
    })
    .catch(error => {
        console.log("Error uploading to cloud storage:", error);
    });
}

// Check if the profile picture URL is in local storage
window.onload = function() {

    var profilePicUrl = localStorage.getItem('profilePicUrl');
    if (profilePicUrl) {
        document.getElementById("currentPfp").src = profilePicUrl;
    }
}

getuser();

