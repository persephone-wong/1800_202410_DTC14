document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.trim().toLowerCase(); // Get the lowercase search text

        // Clear previous search results
        searchResults.innerHTML = '';

        // Only display search results when there is text in the search bar
        if (searchText !== '') {
            const elementsToSearch = document.querySelectorAll('[data-url^="favorite.html"], [data-url^="friends.html"]');
            elementsToSearch.forEach(element => {
                const elementText = element.textContent.trim().toLowerCase();
                if (elementText.startsWith(searchText)) {
                    const li = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = element.getAttribute('data-url');
                    link.textContent = elementText;
                    li.appendChild(link);
                    searchResults.appendChild(li);
                }
            });
        }
    });
});







console.log('ervfnvkjnvdknfjv')
