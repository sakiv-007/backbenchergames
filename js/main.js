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

// DOM Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const featureLinks = document.querySelectorAll('[data-feature]');
const featureModal = document.getElementById('feature-modal');
const closeModal = document.querySelector('.close-modal');
const modalButton = document.querySelector('.modal-button');
const achievementNotification = document.getElementById('achievement-notification');
const filterButtons = document.querySelectorAll('.filter-btn');
const gameCards = document.querySelectorAll('.game-card');

// Note: Sidebar functionality has been moved to sidebar.js

// Toggle sidebar on avatar click is handled in sidebar.js

// Theme toggle functionality
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    // Save theme preference to localStorage
    const isDarkTheme = !document.body.classList.contains('light-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('darkTheme');
if (savedTheme === 'false') {
    document.body.classList.add('light-theme');
}

// Feature modal for coming soon features
featureLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const featureName = link.getAttribute('data-feature');
        const modalTitle = featureModal.querySelector('h2');
        const modalText = featureModal.querySelector('p');
        
        modalTitle.textContent = featureName + ' - Coming Soon!';
        modalText.textContent = `We're working hard to bring you the ${featureName} feature. Stay tuned for updates!`;
        
        featureModal.style.display = 'flex';
    });
});

// Close modal
function closeFeatureModal() {
    featureModal.style.display = 'none';
}

closeModal.addEventListener('click', closeFeatureModal);
modalButton.addEventListener('click', closeFeatureModal);
window.addEventListener('click', (e) => {
    if (e.target === featureModal) {
        closeFeatureModal();
    }
});

// Show achievement notification
function showAchievement() {
    // Check if this is the first visit
    if (!localStorage.getItem('firstVisit')) {
        setTimeout(() => {
            achievementNotification.classList.add('show');
            localStorage.setItem('firstVisit', 'true');
            
            // Hide notification after 5 seconds
            setTimeout(() => {
                achievementNotification.classList.remove('show');
            }, 5000);
        }, 2000);
    }
}

// Game filtering
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter game cards
            gameCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Animated typing effect for hero heading
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect to hero heading if it exists
const heroHeading = document.querySelector('.hero h1');
if (heroHeading) {
    const originalText = heroHeading.textContent;
    window.addEventListener('load', () => {
        typeWriter(heroHeading, originalText, 70);
    });
}

// Initialize achievement notification
showAchievement();

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
}

// Add game stats counters
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target > 0 ? 1 : 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = start;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, stepTime);
}

// Animate stats when they come into view
const statsElements = document.querySelectorAll('.game-stats span');
if (statsElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valueElement = entry.target.querySelector('i').nextSibling;
                const targetValue = parseInt(valueElement.textContent);
                animateCounter(valueElement, targetValue);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsElements.forEach(stat => observer.observe(stat));
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

