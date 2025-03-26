// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Side panel toggle functionality
    const userAvatar = document.querySelector('.user-avatar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main');
    
    if (userAvatar) {
        userAvatar.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // Search functionality with auto-suggestions
    const searchInput = document.getElementById('game-search');
    const searchBtn = document.getElementById('search-btn');
    const gamesContainer = document.querySelector('.games-grid');
    const gameCards = document.querySelectorAll('.game-card');
    
    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    document.querySelector('.search-box').appendChild(suggestionsContainer);
    
    // Get all game titles
    const games = Array.from(gameCards).map(card => {
        return {
            title: card.querySelector('h3').textContent,
            element: card
        };
    });
    
    // Function to show suggestions
    function showSuggestions(input) {
        // Clear previous suggestions
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.style.display = 'none';
        
        if (!input) {
            // If search is empty, reset the view
            highlightGame('');
            return;
        }
        
        // Filter games based on input
        const filteredGames = games.filter(game => 
            game.title.toLowerCase().includes(input.toLowerCase())
        );
        
        if (filteredGames.length === 0) return;
        
        // Show suggestions container
        suggestionsContainer.style.display = 'block';
        
        // Add suggestions
        filteredGames.forEach(game => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion';
            suggestion.textContent = game.title;
            
            suggestion.addEventListener('click', () => {
                searchInput.value = game.title;
                suggestionsContainer.style.display = 'none';
                highlightGame(game.title);
            });
            
            suggestionsContainer.appendChild(suggestion);
        });
    }
    
    // Function to highlight matching games
    function highlightGame(searchTerm) {
        if (!searchTerm) {
            // If search is empty, show all games
            gameCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('highlighted');
            });
            return;
        }
        
        searchTerm = searchTerm.toLowerCase();
        
        // Filter and highlight games
        gameCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            
            if (title.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.add('highlighted');
                // Scroll to the first match
                if (title === searchTerm.toLowerCase()) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('highlighted');
            }
        });
    }
    
    // Event listeners for search
    searchInput.addEventListener('input', () => {
        showSuggestions(searchInput.value);
        
        // If search input is empty, reset the view
        if (!searchInput.value) {
            highlightGame('');
        }
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            highlightGame(searchInput.value);
            suggestionsContainer.style.display = 'none';
        }
    });
    
    searchBtn.addEventListener('click', () => {
        highlightGame(searchInput.value);
        suggestionsContainer.style.display = 'none';
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Add hover effects for game cards
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply the saved theme or use the preferred color scheme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save theme preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
    
    // Listen for changes in the preferred color scheme
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
});