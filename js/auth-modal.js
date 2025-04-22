// Authentication Modal functionality

export function initAuthModal() {
    // Check if the auth modal already exists in the DOM
    let authModal = document.getElementById('auth-modal');
    
    // If the modal doesn't exist, create it and append to body
    if (!authModal) {
        // Create the modal HTML structure based on join-now.html
        const modalHTML = `
        <div id="auth-modal" class="auth-modal">
            <div class="auth-modal-content">
                <span class="close-modal">&times;</span>
                
                <div class="auth-header">
                    <h2>Welcome to BackbencherGames</h2>
                    <p>Join our gaming community to play with friends and compete in tournaments</p>
                </div>
                
                <div class="auth-tabs">
                    <div class="auth-tab" data-tab="signin">Sign In</div>
                    <div class="auth-tab active" data-tab="signup">Sign Up</div>
                </div>
                
                <div class="auth-form-container">
                    <!-- Sign Up Form -->
                    <form class="auth-form active" id="signup-form">
                        <div class="form-group">
                            <label for="signup-username">Username</label>
                            <input type="text" id="signup-username" placeholder="Choose a unique username" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" placeholder="Enter your email address" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <div class="password-input">
                                <input type="password" id="signup-password" placeholder="Create a strong password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="signup-confirm-password">Confirm Password</label>
                            <div class="password-input">
                                <input type="password" id="signup-confirm-password" placeholder="Confirm your password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <button type="submit" class="submit-btn">Create Account</button>
                        
                        <div class="social-login">
                            <p>Or sign up with</p>
                            <div class="social-buttons">
                                <div class="social-btn google"><i class="fab fa-google"></i></div>
                                <div class="social-btn facebook"><i class="fab fa-facebook-f"></i></div>
                                <div class="social-btn github"><i class="fab fa-github"></i></div>
                                <div class="social-btn discord"><i class="fab fa-discord"></i></div>
                            </div>
                        </div>
                        
                        <div class="form-footer">
                            Already have an account? <a href="javascript:void(0)" class="switch-form" data-form="signin">Sign In</a>
                        </div>
                    </form>
                    
                    <!-- Sign In Form -->
                    <form class="auth-form" id="signin-form">
                        <div class="form-group">
                            <label for="signin-email">Email</label>
                            <input type="email" id="signin-email" placeholder="Enter your email address" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="signin-password">Password</label>
                            <div class="password-input">
                                <input type="password" id="signin-password" placeholder="Enter your password" required>
                                <i class="fas fa-eye toggle-password"></i>
                            </div>
                        </div>
                        
                        <div class="remember-forgot">
                            <div class="remember-me">
                                <input type="checkbox" id="remember-me">
                                <label for="remember-me">Remember me</label>
                            </div>
                            <a href="javascript:void(0)" class="forgot-password">Forgot Password?</a>
                        </div>
                        
                        <button type="submit" class="submit-btn">Sign In</button>
                        
                        <div class="social-login">
                            <p>Or sign in with</p>
                            <div class="social-buttons">
                                <div class="social-btn google"><i class="fab fa-google"></i></div>
                                <div class="social-btn facebook"><i class="fab fa-facebook-f"></i></div>
                                <div class="social-btn github"><i class="fab fa-github"></i></div>
                                <div class="social-btn discord"><i class="fab fa-discord"></i></div>
                            </div>
                        </div>
                        
                        <div class="form-footer">
                            Don't have an account? <a href="javascript:void(0)" class="switch-form" data-form="signup">Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        `;
        
        // Append the modal to the body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        authModal = document.getElementById('auth-modal');
    }
    
    // Add Join Now button to the hero section if it doesn't exist
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons && !document.querySelector('.join-now-button')) {
        const joinNowButton = document.createElement('a');
        joinNowButton.href = 'javascript:void(0)';
        joinNowButton.className = 'cta-button join-now-button';
        joinNowButton.innerHTML = `
            <span class="button-icon"><i class="fas fa-sign-in-alt"></i></span>
            <span>Join Now</span>
        `;
        heroButtons.appendChild(joinNowButton);
    }
    
    // Get DOM elements
    const closeModalBtn = authModal.querySelector('.close-modal');
    const authTabs = authModal.querySelectorAll('.auth-tab');
    const authForms = authModal.querySelectorAll('.auth-form');
    const switchFormLinks = authModal.querySelectorAll('.switch-form');
    const togglePasswordButtons = authModal.querySelectorAll('.toggle-password');
    const joinNowBtn = document.querySelector('.join-now-button');
    
    // Show auth modal when Join Now button is clicked
    if (joinNowBtn) {
        joinNowBtn.addEventListener('click', () => {
            authModal.style.display = 'block';
        });
    }
    
    // Close modal when X button is clicked
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Tab switching functionality
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            authTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding form
            const formId = tab.getAttribute('data-tab');
            const forms = authModal.querySelectorAll('.auth-form');
            forms.forEach(form => form.classList.remove('active'));
            
            if (formId === 'signup') {
                authModal.querySelector('#signup-form').classList.add('active');
            } else {
                authModal.querySelector('#signin-form').classList.add('active');
            }
        });
    });
    
    // Switch between forms using the links
    if (switchFormLinks) {
        switchFormLinks.forEach(link => {
            link.addEventListener('click', function() {
                const formId = this.getAttribute('data-form');
                
                // Activate corresponding tab
                authTabs.forEach(tab => {
                    if (tab.getAttribute('data-tab') === formId) {
                        tab.click();
                    }
                });
            });
        });
    }
    
    // Toggle password visibility
    if (togglePasswordButtons) {
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.classList.remove('fa-eye');
                    this.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.classList.remove('fa-eye-slash');
                    this.classList.add('fa-eye');
                }
            });
        });
    }
    
    // Form submission handling (placeholder for actual authentication)
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    
    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would normally handle the authentication
            console.log('Sign in form submitted');
            // For demo purposes, close the modal after submission
            authModal.style.display = 'none';
            // Show a success notification
            showAuthNotification('Successfully signed in!', 'success');
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would normally handle the registration
            console.log('Sign up form submitted');
            // For demo purposes, close the modal after submission
            authModal.style.display = 'none';
            // Show a success notification
            showAuthNotification('Account created successfully!', 'success');
        });
    }
    
    // Social login buttons (placeholder functionality)
    const socialButtons = authModal.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the provider from the icon class
            const iconElement = button.querySelector('i');
            let provider = 'Social Provider';
            
            if (iconElement.classList.contains('fa-google')) provider = 'Google';
            else if (iconElement.classList.contains('fa-facebook-f')) provider = 'Facebook';
            else if (iconElement.classList.contains('fa-github')) provider = 'GitHub';
            else if (iconElement.classList.contains('fa-discord')) provider = 'Discord';
            
            console.log(`Attempting to sign in with ${provider}`);
            // Here you would normally handle the social authentication
            // For demo purposes, close the modal after clicking
            authModal.style.display = 'none';
            // Show a success notification
            showAuthNotification(`Signed in with ${provider}!`, 'success');
        });
    });
    
    // Forgot password functionality (placeholder)
    const forgotPasswordLink = authModal.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', () => {
            // Here you would normally show a password reset form
            alert('Password reset functionality would be implemented here.');
        });
    }
    
    console.log('Auth modal functionality initialized');
}

// Helper function to show authentication notifications
function showAuthNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.auth-notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'auth-notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}