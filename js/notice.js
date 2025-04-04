/**
 * Notice popup functionality
 * Displays a small popup with the latest feature updates
 * Appears on every page load/refresh
 */

function initNotice() {
    // Check if notice was recently closed
    const lastClosedTime = localStorage.getItem('noticeLastClosed');
    const currentTime = new Date().getTime();
    const oneHour = 60 * 60 * 1000; // one hour in milliseconds
    
    if (lastClosedTime && currentTime - parseInt(lastClosedTime) < oneHour) {
        // Don't show notice if it was closed less than an hour ago
        return;
    }
    
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
        
        // Store the current timestamp when notice is closed
        localStorage.setItem('noticeLastClosed', new Date().getTime().toString());
        
        setTimeout(() => {
            noticePopup.remove();
        }, 300);
    });
}

export { initNotice };