// update the notification content to show new notifications to the users

// Store notification data
let notifications = [];
let unseenCount = 0;

// Version control for default notification
const DEFAULT_NOTIFICATION_VERSION = '2.8'; // Increment this when default notification changes

// Check if we have stored notifications in localStorage
function loadNotifications() {
    // Check for stored notifications in localStorage
    const storedNotifications = localStorage.getItem('notifications');
    const storedVersion = localStorage.getItem('notification_version');

  
    // Type your new notification here

    const title = 'New Feature Alert!';

    const content = `We Updated and made the hero section game fully functional <br> <br>
    and we also added the feature to edit your profile that will store your data locally`;

    const date = 'Released: April 5, 2025';






    
    if (storedNotifications) {
        notifications = JSON.parse(storedNotifications);
        
        // Check if we need to add a new notification for the updated version
        if (storedVersion !== DEFAULT_NOTIFICATION_VERSION) {
            // Instead of updating the existing notification, add a new one
            // This preserves the history of notifications
            const newTitle = 'New Feature Alert!'; 
            addNotification(newTitle, content, date, true);
            
            // Update the version in localStorage
            localStorage.setItem('notification_version', DEFAULT_NOTIFICATION_VERSION);
        }
        
        updateUnseenCount();
    } else {
        // Initialize with a default notification if none exist
        addNotification(title, content, date, false);
        // Store the current version
        localStorage.setItem('notification_version', DEFAULT_NOTIFICATION_VERSION);
    }
}

// Add a new notification
function addNotification(title, content, date, unseen = true) {
    const notification = {
        id: Date.now(),
        title,
        content,
        date,
        seen: !unseen
    };
    
    notifications.unshift(notification); // Add to beginning of array
    saveNotifications();
    updateUnseenCount();
}

// Save notifications to localStorage
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Update the count of unseen notifications
function updateUnseenCount() {
    unseenCount = notifications.filter(notification => !notification.seen).length;
    updateNotificationBadge();
}

// Update the notification badge with the current count
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        if (unseenCount > 0) {
            badge.textContent = unseenCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Mark all notifications as seen
function markAllAsSeen() {
    notifications.forEach(notification => {
        notification.seen = true;
    });
    saveNotifications();
    updateUnseenCount();
}

// Toggle the notification popup
function toggleNotificationPopup() {
    const noticePopup = document.querySelector('.notice-popup');
    
    if (noticePopup) {
        // If popup exists, close it
        noticePopup.classList.remove('show');
        setTimeout(() => {
            noticePopup.remove();
        }, 300);
    } else {
        // Create and show popup
        showNotificationPopup();
        markAllAsSeen();
    }
}

// Show the notification popup with all notifications
function showNotificationPopup() {
    // Create notice popup element
    const noticePopup = document.createElement('div');
    noticePopup.className = 'notice-popup';
    noticePopup.innerHTML = `
        <div class="notice-header">
            <h4>Notifications</h4>
            <button class="notice-close" aria-label="Close notice">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notice-body">
            ${generateNotificationContent()}
        </div>
    `;
    
    // Add to document body
    document.body.appendChild(noticePopup);
    
    // Show the notice popup
    setTimeout(() => {
        noticePopup.classList.add('show');
    }, 10);
    
    // Close button functionality
    const closeButton = noticePopup.querySelector('.notice-close');
    closeButton.addEventListener('click', () => {
        noticePopup.classList.remove('show');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            noticePopup.remove();
        }, 300);
    });
}

// Generate HTML content for all notifications
function generateNotificationContent() {
    if (notifications.length === 0) {
        return '<div class="notice-content"><p>No notifications yet.</p></div>';
    }
    
    return notifications.map(notification => `
        <div class="notice-content" data-id="${notification.id}">
            <h3>${notification.title}</h3>
            <p>${notification.content}</p>
            <p class="notice-date">${notification.date}</p>
        </div>
    `).join('<hr class="notice-divider">');
}

// Initialize notification functionality
function initNotification() {
    // Create notification toggle button
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const notificationToggle = document.createElement('div');
        notificationToggle.className = 'notification-toggle';
        notificationToggle.innerHTML = `
            <button id="notification-toggle-btn" aria-label="Toggle notifications">
                <i class="fas fa-bell"></i>
                <span class="notification-badge">0</span>
            </button>
        `;
        
        // Insert before theme toggle with 20px margin
        themeToggle.parentNode.insertBefore(notificationToggle, themeToggle);
        
        // Add click event listener
        const notificationBtn = document.getElementById('notification-toggle-btn');
        notificationBtn.addEventListener('click', toggleNotificationPopup);
    }
    
    // Load existing notifications
    loadNotifications();
    
    console.log('Notification functionality initialized');
}

// Export the initialization function
export { initNotification, addNotification };