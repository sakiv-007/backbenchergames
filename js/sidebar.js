// Sidebar functionality - Consolidated all sidebar features in one place

export function initSidebar() {
    // Initialize all sidebar elements and functionality in one place
    const sidebar = document.getElementById('sidebar');
    const mobileSidebarToggle = document.querySelector('.mobile-sidebar-toggle');
    const userAvatar = document.querySelector('.user-avatar');
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const playWithFriendsBtn = document.querySelector('.play-with-friends');
    
    // Track sidebar collapsed state for CSS styling
    let sidebarCollapsed = false;
    
    // Ensure sidebar is closed by default on mobile devices
    if (window.innerWidth <= 992) {
        sidebar.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
    
    // Function to set up tooltips for mini sidebar
    function setupMiniSidebarTooltips() {
        // Set data-title attributes for all sidebar links
        const sidebarLinks = sidebar.querySelectorAll('.sidebar-nav a, .sidebar-footer a, .play-btn');
        
        sidebarLinks.forEach(link => {
            // Get the text content of the span inside the link
            const linkText = link.querySelector('span')?.textContent.trim() || '';
            if (linkText) {
                link.setAttribute('data-title', linkText);
            }
        });
    }
    
    // Function to adjust layout based on sidebar state
    function adjustLayout() {
        // Toggle sidebar-collapsed class on body for CSS styling
        if (!sidebar.classList.contains('expanded') && window.innerWidth > 768) {
            document.body.classList.add('sidebar-collapsed');
            sidebar.classList.add('collapsed');
        } else {
            document.body.classList.remove('sidebar-collapsed');
            sidebar.classList.remove('collapsed');
        }
        if (window.innerWidth <= 768) {
            // Mobile layout - ensure sidebar overlays content without pushing it
            // Reset all margin and width styles to ensure content takes full width
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
            header.style.marginLeft = '0';
            header.style.width = '100%';
            footer.style.marginLeft = '0';
            footer.style.width = '100%';
            
            // Ensure transform is reset
            mainContent.style.transform = 'translateX(0)';
            header.style.transform = 'translateX(0)';
            footer.style.transform = 'translateX(0)';
        } else {
            // Desktop layout
            if (sidebar.classList.contains('expanded')) {
                sidebar.classList.remove('mini-sidebar');
                mainContent.style.marginLeft = '280px';
                mainContent.style.width = 'calc(100% - 280px)';
                header.style.marginLeft = '280px';
                header.style.width = 'calc(100% - 280px)';
                footer.style.marginLeft = '280px';
                footer.style.width = 'calc(100% - 280px)';
                
                // Reset margin for play with friends button when sidebar is expanded
                const playWithFriendsBtn = sidebar.querySelector('.play-with-friends');
                if (playWithFriendsBtn) {
                    playWithFriendsBtn.style.marginTop = '';
                }
                
                // Show play online text when sidebar is expanded
                const playOnlineText = sidebar.querySelector('.play-online-section h3');
                if (playOnlineText) {
                    playOnlineText.style.display = '';
                }
                
                // Show user card elements when sidebar is expanded
                const userCard = sidebar.querySelector('.user-card');
                const userInfo = sidebar.querySelector('.user-info');
                const editProfileBtn = sidebar.querySelector('.edit-profile-btn');
                if (userCard) {
                    userCard.style.flexDirection = 'column';
                    userCard.style.alignItems = 'center';
                }
                if (userInfo) {
                    userInfo.style.display = '';
                    userInfo.style.visibility = 'visible';
                    userInfo.style.opacity = '1';
                    userInfo.style.width = '100%';
                }
                if (editProfileBtn) {
                    editProfileBtn.style.display = '';
                    editProfileBtn.style.visibility = 'visible';
                    editProfileBtn.style.opacity = '1';
                }
            } else {
                sidebar.classList.add('mini-sidebar');
                mainContent.style.marginLeft = '70px';
                mainContent.style.width = 'calc(100% - 70px)';
                header.style.marginLeft = '70px';
                header.style.width = 'calc(100% - 70px)';
                footer.style.marginLeft = '70px';
                footer.style.width = 'calc(100% - 70px)';
                
                // Add margin-top to play with friends button when sidebar is collapsed
                const playWithFriendsBtn = sidebar.querySelector('.play-with-friends');
                if (playWithFriendsBtn) {
                    playWithFriendsBtn.style.marginTop = '50px';
                }
                
                // Hide play online text when sidebar is collapsed
                const playOnlineText = sidebar.querySelector('.play-online-section h3');
                if (playOnlineText) {
                    playOnlineText.style.display = 'none';
                    playOnlineText.style.visibility = 'hidden';
                    playOnlineText.style.opacity = '0';
                    playOnlineText.style.width = '0';
                    playOnlineText.style.height = '0';
                    playOnlineText.style.overflow = 'hidden';
                }
                
                // Hide user info and edit profile button when sidebar is collapsed
                const userCard = sidebar.querySelector('.user-card');
                const userInfo = sidebar.querySelector('.user-info');
                const editProfileBtn = sidebar.querySelector('.edit-profile-btn');
                if (userCard) {
                    userCard.style.flexDirection = 'row';
                    userCard.style.alignItems = 'center';
                }
                if (userInfo) {
                    userInfo.style.display = 'none';
                    userInfo.style.visibility = 'hidden';
                    userInfo.style.opacity = '0';
                    userInfo.style.width = '0';
                }
                if (editProfileBtn) {
                    editProfileBtn.style.display = 'none';
                    editProfileBtn.style.visibility = 'hidden';
                    editProfileBtn.style.opacity = '0';
                }
            }
        }
    }
    
    // Set sidebar to expanded by default ONLY on desktop devices
    if (window.innerWidth > 768) {
        sidebar.classList.add('expanded');
    } else {
        // Ensure sidebar is closed by default on mobile
        sidebar.classList.remove('active');
    }
    
    // Set up tooltips for mini sidebar
    setupMiniSidebarTooltips();
    
    // Initial layout adjustment
    adjustLayout();
    
    // Create sidebar overlay if it doesn't exist
    let sidebarOverlay = document.querySelector('.sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.insertBefore(sidebarOverlay, document.body.firstChild);
        
        // Add click event to overlay to close sidebar
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebar.classList.remove('expanded');
            document.body.classList.remove('sidebar-open');
            adjustLayout();
        });
    }
    
    // Toggle sidebar on mobile toggle button click
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default behavior
            sidebar.classList.toggle('active');
            
            // For mobile devices, we need to handle collapsed state differently
            if (window.innerWidth <= 768) {
                // Mobile sidebar toggle logic - always show full sidebar, not mini
                sidebar.classList.remove('mini-sidebar');
                // Add expanded class to ensure full sidebar view on mobile
                sidebar.classList.add('expanded');
                // Toggle body class for overlay
                document.body.classList.toggle('sidebar-open');
            } else {
                // Desktop sidebar toggle logic
                sidebar.classList.toggle('expanded');
                if (!sidebar.classList.contains('expanded')) {
                    sidebar.classList.add('mini-sidebar');
                    document.body.classList.add('sidebar-collapsed');
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('mini-sidebar');
                    document.body.classList.remove('sidebar-collapsed');
                    sidebar.classList.remove('collapsed');
                }
            }
            
            adjustLayout();
            console.log('Sidebar toggle clicked');
        });
    }
    
    // Toggle sidebar expansion on desktop or close on mobile (user avatar click)
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            // For both mobile and desktop, use the avatar to toggle sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('expanded');
                // Ensure proper positioning when toggling sidebar
                if (!sidebar.classList.contains('expanded')) {
                    sidebar.classList.add('mini-sidebar');
                    document.body.classList.add('sidebar-collapsed');
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('mini-sidebar');
                    document.body.classList.remove('sidebar-collapsed');
                    sidebar.classList.remove('collapsed');
                }
            }
            
            // Force layout adjustment after toggling
            setTimeout(() => {
                adjustLayout();
                console.log('Sidebar toggled via avatar click');
            }, 10);
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
                // Ensure proper class toggling for collapsed state
                if (!sidebar.classList.contains('expanded')) {
                    sidebar.classList.add('mini-sidebar');
                    document.body.classList.add('sidebar-collapsed');
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('mini-sidebar');
                    document.body.classList.remove('sidebar-collapsed');
                    sidebar.classList.remove('collapsed');
                }
            }
            
            adjustLayout();
            console.log('Sidebar toggled with keyboard shortcut Ctrl+B');
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== mobileSidebarToggle && !mobileSidebarToggle.contains(e.target)) {
                sidebar.classList.remove('active');
                // Remove expanded class when closing sidebar on mobile
                sidebar.classList.remove('expanded');
                // Remove sidebar-open class from body
                document.body.classList.remove('sidebar-open');
                adjustLayout();
            }
        }
    });
    
    // Handle window resize events
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('expanded');
            // Ensure sidebar stays closed on mobile when resizing from desktop
            sidebar.classList.remove('active');
            // Remove collapsed classes when switching to mobile
            document.body.classList.remove('sidebar-collapsed');
            sidebar.classList.remove('collapsed');
        } else {
            // Restore expanded state on desktop
            sidebar.classList.add('expanded');
            // Remove collapsed classes when switching to desktop expanded view
            document.body.classList.remove('sidebar-collapsed');
            sidebar.classList.remove('collapsed');
        }
        adjustLayout();
    });
    
    // Add event listener for Play with Friends button to open sidebar when clicked
    if (playWithFriendsBtn) {
        playWithFriendsBtn.addEventListener('click', () => {
            // Check if sidebar is collapsed/mini
            if (!sidebar.classList.contains('expanded') || sidebar.classList.contains('mini-sidebar') || 
                sidebar.classList.contains('collapsed') || document.body.classList.contains('sidebar-collapsed')) {
                
                // For mobile devices
                if (window.innerWidth <= 768) {
                    sidebar.classList.add('active');
                } else {
                    // For desktop devices
                    sidebar.classList.add('expanded');
                    sidebar.classList.remove('mini-sidebar');
                    document.body.classList.remove('sidebar-collapsed');
                    sidebar.classList.remove('collapsed');
                }
                
                // Force layout adjustment after expanding
                setTimeout(() => {
                    adjustLayout();
                    console.log('Sidebar expanded via Play with Friends button click');
                }, 10);
            }
        });
    }
}