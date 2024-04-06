document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchbar');
    const requestsContainer = document.getElementById('requests-go-here');

    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.trim().toLowerCase();

        // Get all the request cards
        const requestCards = requestsContainer.querySelectorAll('.col-md-20');

        requestCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.trim().toLowerCase();

            // Check if the title contains the search text
            const matchesSearch = title.includes(searchText);

            // Show or hide the request card based on the search result for title
            card.style.display = matchesSearch ? 'block' : 'none';
        });
    });
});
