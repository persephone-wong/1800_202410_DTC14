document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchbar');
    const usersContainer = document.getElementById('users-go-here');

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
