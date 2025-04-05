/**
 * Notice popup functionality
 * Displays a small popup with the latest feature updates
 * Appears on every page load/refresh
 */

function initNotice() {
    // Create notice popup element
    const noticePopup = document.createElement('div');
    noticePopup.className = 'notice-popup';
    noticePopup.innerHTML = `
        <div class="notice-header">
            <h4>Feature Update</h4>
            <button class="notice-close" aria-label="Close notice">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notice-body">
            <!-- Notice content will be loaded here -->
        </div>
    `;
    
    // Add to document body
    document.body.appendChild(noticePopup);
    
    // Load notice content from notice.html
    fetch('notice.html')
        .then(response => response.text())
        .then(html => {
            const noticeBody = noticePopup.querySelector('.notice-body');
            noticeBody.innerHTML = html;
            
            // Show the notice popup after a short delay
            setTimeout(() => {
                noticePopup.classList.add('show');
            }, 500);
        })
        .catch(error => {
            console.error('Error loading notice content:', error);
        });
    
    // Close button functionality
    const closeButton = noticePopup.querySelector('.notice-close');
    closeButton.addEventListener('click', () => {
        noticePopup.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            noticePopup.remove();
        }, 300);
    });
    
    console.log('Notice functionality initialized');
}

// Export the initialization function
export { initNotice };