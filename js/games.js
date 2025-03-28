// Games functionality

export function initGames() {
    // Handle "Coming soon" play buttons
    const playButtons = document.querySelectorAll('.play-button');
    const modal = document.getElementById('feature-modal');
    
    playButtons.forEach(button => {
        if (button.textContent.trim().toLowerCase() === 'coming soon') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const gameName = e.target.closest('.game-card').querySelector('h3').textContent;
                document.querySelector('#feature-modal h2').textContent = `${gameName} - Coming Soon!`;
                document.querySelector('#feature-modal p').textContent = 
                    `We're working hard to bring you ${gameName}. Stay tuned for updates!`;
                modal.style.display = 'block';
            });
        }
    });
}