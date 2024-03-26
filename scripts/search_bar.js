document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const eventsContainer = document.getElementById('events-go-here');

    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.trim().toLowerCase();

        // Get all the event cards
        const eventCards = eventsContainer.querySelectorAll('.rounded-5');

        eventCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.trim().toLowerCase();

            // Check if the title contains the search text
            const matchesSearch = title.includes(searchText);

            // Show or hide the event card based on the search result for title
            card.style.display = matchesSearch ? 'block' : 'none';
        });
    });
});


console.log('banana')