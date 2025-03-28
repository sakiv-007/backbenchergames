// Sidebar functionality

export function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileSidebarToggle = document.querySelector('.mobile-sidebar-toggle');
    const userAvatar = document.querySelector('.user-avatar');
    
    // Set sidebar to expanded by default ONLY on desktop devices
    if (window.innerWidth > 768) {
        sidebar.classList.add('expanded');
    } else {
        // Ensure sidebar is closed by default on mobile
        sidebar.classList.remove('active');
    }
    
    // Toggle sidebar on mobile toggle button click
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default behavior
            sidebar.classList.toggle('active');
            console.log('Sidebar toggle clicked');
        });
    }
    
    // Toggle sidebar expansion on desktop or close on mobile (user avatar click)
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                // On mobile, clicking avatar should close the sidebar
                sidebar.classList.remove('active');
                console.log('Sidebar closed on mobile via avatar click');
            } else {
                // On desktop, maintain the expand/collapse behavior
                sidebar.classList.toggle('expanded');
                console.log('Sidebar expanded/collapsed on desktop');
            }
        });
    }
    
    // Add keyboard shortcut (Ctrl+B) to toggle sidebar
    document.addEventListener('keydown', (e) => {
        // Check if Ctrl+B was pressed (B keycode is 66)
        if (e.ctrlKey && e.keyCode === 66) {
            e.preventDefault(); // Prevent default browser behavior
            
            // Toggle sidebar based on screen size
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('expanded');
            }
            
            console.log('Sidebar toggled with keyboard shortcut Ctrl+B');
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== mobileSidebarToggle && !mobileSidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // Handle window resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('expanded');
            // Ensure sidebar stays closed on mobile when resizing from desktop
            sidebar.classList.remove('active');
        } else {
            // Restore expanded state on desktop
            sidebar.classList.add('expanded');
        }
    });
}