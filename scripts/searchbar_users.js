// Description: This script is used to filter the user cards based on the search text entered in the search bar.

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchbar');
    const usersContainer = document.getElementById('users-go-here');

    // Add an input event listener to the search input
    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.trim().toLowerCase();

        // Get all the user cards
        const userCards = usersContainer.querySelectorAll('.container');

        userCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.trim().toLowerCase();

            // Check if the title contains the search text
            const matchesSearch = title.includes(searchText);

            // Show or hide the user card based on the search result for title
            card.style.display = matchesSearch ? 'block' : 'none';
        });
    });
});
