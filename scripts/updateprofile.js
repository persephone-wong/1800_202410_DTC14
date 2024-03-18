document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission behavior
  
      // Get values from the form fields
      const firstName = document.getElementById('inputFirstName').value;
      const lastName = document.getElementById('inputLastName').value;
      const username = document.getElementById('inputUsername').value;
      const email = document.getElementById('inputEmail').value;
      const address = document.getElementById('inputAddress').value;
      const postalCode = document.getElementById('inputPostalCode').value;
      const reportProblem = document.getElementById('inputReportProblem').value;
  
      // Update data in Firestore
      const db = firebase.firestore();
      const userRef = db.collection('users').doc(); // Replace 'user_id' with your actual collection and document ID
      return userRef.update({
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        address: address,
        postalCode: postalCode,
        reportProblem: reportProblem
      })
      .then(() => {
        console.log('Document successfully updated!');
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
        // Handle errors or display error messages as needed
      });
    });
  });
  