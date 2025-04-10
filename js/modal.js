// Modal functionality

export function initModal() {
    const modal = document.getElementById('feature-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalButton = document.querySelector('.modal-button');
    
    // Get all sidebar links with data-feature attribute
    const sidebarLinks = document.querySelectorAll('#sidebar a[data-feature]');
    
    // Get all play buttons
    const playButtons = document.querySelectorAll('.play-button');
    
    // Add click event to all sidebar links with data-feature
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const featureName = link.getAttribute('data-feature');
            
            // Update modal content with feature name
            document.querySelector('#feature-modal h2').textContent = `${featureName} - Coming Soon!`;
            document.querySelector('#feature-modal p').textContent = 
                `We're working hard to bring you the ${featureName} feature. Stay tuned for updates!`;
            
            // Show modal
            modal.style.display = 'block';
        });
    });
    
    // Add click event to "Coming soon" buttons only
    playButtons.forEach(button => {
        // Only add modal event to buttons with 'Coming soon' text
        // This ensures buttons with href attributes pointing to detail pages work normally
        if (button.textContent.trim() === 'Coming soon') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get game name from the closest game-info div
                const gameName = button.closest('.game-info').querySelector('h3').textContent;
                
                // Update modal content with game name
                document.querySelector('#feature-modal h2').textContent = `${gameName} - Coming Soon!`;
                document.querySelector('#feature-modal p').textContent = 
                    `We're working hard to bring you ${gameName}. Stay tuned for updates!`;
                
                // Show modal
                modal.style.display = 'block';
            });
        }
    });
    
    // Close modal when clicking the X button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking the "Got it" button
    if (modalButton) {
        modalButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    console.log('Modal functionality initialized');
}