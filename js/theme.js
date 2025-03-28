// Theme toggle functionality

export function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Always default to dark mode unless explicitly set to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== 'light') {
        document.body.classList.add('dark-mode');
    }
    
    // Toggle theme when button is clicked
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save theme preference
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
    
    console.log('Theme functionality initialized');
}