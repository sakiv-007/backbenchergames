// Games functionality

export function initGames() {
    const gameCards = document.querySelectorAll('.game-card');
    const playButtons = document.querySelectorAll('.play-button');
    const modal = document.getElementById('feature-modal');
    
    const playNowGames = [];
    
    // First pass: Identify all games with 'Play Now' and 'Coming Soon' buttons
    playButtons.forEach(button => {
        const gameCard = button.closest('.game-card');
        const buttonText = button.textContent.trim().toLowerCase();
        const gameTitle = gameCard.querySelector('h3').textContent.trim().toLowerCase();
        
        if (buttonText === 'play now') {
            playNowGames.push(gameCard);
        }
        
        if (buttonText === 'coming soon') {
            gameCard.setAttribute('data-category', 'coming-soon');
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const gameName = gameCard.querySelector('h3').textContent;
                document.querySelector('#feature-modal h2').textContent = `${gameName} - Coming Soon!`;
                document.querySelector('#feature-modal p').textContent = 
                    `We're working hard to bring you ${gameName}. Stay tuned for updates!`;
                modal.style.display = 'block';
            });
        }
        
        // Set specific games as 'popular'
        if (gameTitle.includes('tic tac toe') || 
            gameTitle.includes('custom tic tac toe') ||
            gameTitle.includes('fruit slasher')) {
            gameCard.setAttribute('data-category', 'popular');
        }
    });
    
    // Second pass: Mark the last three 'Play Now' games as 'new'
    if (playNowGames.length >= 3) {
        // Get the last three games with 'Play Now' buttons
        const newGames = playNowGames.slice(playNowGames.length - 3);
        
        // Mark these games as 'new' (unless they're already marked as 'popular')
        newGames.forEach(gameCard => {
            // Only set as 'new' if it's not already marked as 'popular'
            if (gameCard.getAttribute('data-category') !== 'popular') {
                gameCard.setAttribute('data-category', 'new');
            }
        });
    }
    
    console.log('Game categories initialized: Popular, New, and Coming Soon');
}