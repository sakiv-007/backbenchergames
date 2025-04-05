/**
 * Notice popup functionality - REMOVED
 * This functionality has been replaced by the notifications toggle dropdown
 */

function initNotice() {
    // Feature update popup has been removed as it's now handled by the notification toggle
    // This function is kept as a no-op to maintain compatibility with any code that might call it
    console.log('Notice popup feature has been deprecated in favor of the notifications dropdown');
    return;
}

/**
 * Notification storage and management
 * Handles storing notifications in localStorage and tracking read status
 */

// Get stored notifications from localStorage
function getStoredNotifications() {
    const storedNotifications = localStorage.getItem('backbencherGamesNotifications');
    return storedNotifications ? JSON.parse(storedNotifications) : [];
}

// Save notifications to localStorage
function saveNotifications(notifications) {
    localStorage.setItem('backbencherGamesNotifications', JSON.stringify(notifications));
}

// Parse notifications from HTML content
function parseNotificationsFromHTML(notificationsBody) {
    if (!notificationsBody) return [];
    
    const noticeContent = notificationsBody.querySelector('.notice-content');
    if (!noticeContent) return [];
    
    const title = noticeContent.querySelector('h3')?.textContent || '';
    const paragraphs = Array.from(noticeContent.querySelectorAll('p:not(.notice-date)'));
    const content = paragraphs.map(p => p.textContent.trim()).join(' ');
    const date = noticeContent.querySelector('.notice-date')?.textContent || '';
    
    // Create a unique ID based on content to identify this notification
    const id = btoa(title + content).substring(0, 20);
    
    return [{
        id,
        title,
        content,
        date,
        timestamp: new Date().getTime(),
        read: false
    }];
}

// Check for new notifications by comparing with stored ones
function checkForNewNotifications(currentNotifications) {
    const storedNotifications = getStoredNotifications();
    
    // If no stored notifications, all current ones are new
    if (storedNotifications.length === 0) {
        saveNotifications(currentNotifications);
        return currentNotifications.length;
    }
    
    // Check for new notifications by comparing IDs
    let newCount = 0;
    const updatedNotifications = [...storedNotifications];
    
    currentNotifications.forEach(notification => {
        const existingIndex = storedNotifications.findIndex(n => n.id === notification.id);
        
        if (existingIndex === -1) {
            // This is a new notification
            updatedNotifications.push(notification);
            newCount++;
        }
    });
    
    // Save updated notifications list
    if (newCount > 0) {
        saveNotifications(updatedNotifications);
    }
    
    return newCount;
}

// Count unread notifications
function countUnreadNotifications() {
    const notifications = getStoredNotifications();
    return notifications.filter(notification => !notification.read).length;
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
    const notifications = getStoredNotifications();
    const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
    }));
    
    saveNotifications(updatedNotifications);
    updateNotificationCounter(0);
}

// Update notification counter badge
function updateNotificationCounter(count) {
    const notificationsBtn = document.getElementById('notifications-toggle-btn');
    if (!notificationsBtn) return;
    
    // Remove existing counter if present
    const existingCounter = notificationsBtn.querySelector('.notification-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    // Add counter badge if count > 0
    if (count > 0) {
        const counter = document.createElement('span');
        counter.className = 'notification-counter';
        counter.textContent = count > 99 ? '99+' : count.toString();
        notificationsBtn.appendChild(counter);
    }
}

/**
 * Notifications dropdown functionality
 * Toggles the notifications dropdown when the bell icon is clicked
 */
function initNotifications() {
    const notificationsBtn = document.getElementById('notifications-toggle-btn');
    const notificationsDropdown = document.querySelector('.notifications-dropdown');
    const notificationsClose = document.querySelector('.notifications-close');
    const notificationsBody = document.querySelector('.notifications-body');
    
    if (!notificationsBtn || !notificationsDropdown) return;
    
    // Parse current notifications from HTML
    const currentNotifications = parseNotificationsFromHTML(notificationsBody);
    
    // Check for new notifications and update counter
    const unreadCount = countUnreadNotifications();
    updateNotificationCounter(unreadCount);
    
    // Toggle notifications dropdown when bell icon is clicked
    notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsDropdown.classList.toggle('show');
        
        // Mark notifications as read when dropdown is opened
        if (notificationsDropdown.classList.contains('show')) {
            markAllNotificationsAsRead();
        }
    });
    
    // Close notifications when close button is clicked
    if (notificationsClose) {
        notificationsClose.addEventListener('click', () => {
            notificationsDropdown.classList.remove('show');
        });
    }
    
    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationsDropdown.contains(e.target) && e.target !== notificationsBtn) {
            notificationsDropdown.classList.remove('show');
        }
    });
    
    // Prevent clicks inside dropdown from closing it
    notificationsDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Check for new notifications on page load
    if (currentNotifications.length > 0) {
        const newCount = checkForNewNotifications(currentNotifications);
        if (newCount > 0) {
            updateNotificationCounter(unreadCount + newCount);
        }
    }
}

export { initNotice, initNotifications };