document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.trim().toLowerCase(); // Get the lowercase search text
        
        // Get all the event divs
        const events = document.querySelectorAll('#list-events > div');
        
        // Loop through each event div
        events.forEach(eventDiv => {
            const eventTitle = eventDiv.querySelector('.card-title');
            const titleText = eventTitle.textContent.trim().toLowerCase();
            
            // Check if the event title contains the search text
            if (titleText.includes(searchText)) {
                eventDiv.style.display = 'block'; // Show the event div
            } else {
                eventDiv.style.display = 'none'; // Hide the event div
            }
        });
    });
});

console.log('banana')