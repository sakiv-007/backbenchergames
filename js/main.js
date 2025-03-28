// Main JavaScript file that imports and initializes all modules

// Import modules
import { initSidebar } from './sidebar.js';
import { initTheme } from './theme.js';
import { initModal } from './modal.js';
import { initFeedback } from './feedback.js';
import { initSearch } from './search.js';
import { initGames } from './games.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initTheme();
    initModal();
    initFeedback();
    initSearch();
    initGames();
    
    console.log('BackbencherGames initialized successfully!');
});