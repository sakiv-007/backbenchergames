// Search functionality

export function initSearch() {
    const searchInput = document.getElementById('game-search');
    const searchBtn = document.getElementById('search-btn');
    const gameCards = document.querySelectorAll('.game-card');
    const heroSection = document.querySelector('.hero');
    
    // Search function
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show hero section and all games
            heroSection.style.display = 'block';
            gameCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('highlighted');
            });
            return;
        }
        
        // Hide hero section when searching
        heroSection.style.display = 'none';
        
        // Filter games based on search term
        gameCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('highlighted');
            } else {
                card.style.display = 'none';
                card.classList.remove('highlighted');
            }
        });
    }
    
    // Search on input change for real-time filtering
    searchInput.addEventListener('input', performSearch);
    
    // Search button click handler
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key press
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}