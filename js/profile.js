// Profile functionality - Handles user profile editing and storage

export function initProfile() {
    // Create profile modal if it doesn't exist
    createProfileModal();
    
    // Get DOM elements
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const closeModal = profileModal.querySelector('.close-modal');
    const saveButton = profileModal.querySelector('.save-button');
    const cancelButton = profileModal.querySelector('.cancel-button');
    const usernameInput = document.getElementById('profile-username');
    const avatarPreview = document.getElementById('avatar-preview');
    const fileInput = document.getElementById('avatar-upload');
    
    // Load user data from localStorage
    loadUserData();
    
    // Add event listener to edit profile button
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Populate form with current user data
        const userData = getUserData();
        usernameInput.value = userData.username;
        avatarPreview.src = userData.avatar;
        
        // Show modal
        profileModal.style.display = 'flex';
    });
    
    // Close modal when clicking the X button
    closeModal.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });
    
    // Close modal when clicking the Cancel button
    cancelButton.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
    
    // Handle file input change for avatar preview
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle save button click
    saveButton.addEventListener('click', () => {
        // Get form values
        const username = usernameInput.value.trim();
        const avatar = avatarPreview.src;
        
        // Validate username
        if (!username) {
            alert('Please enter a username');
            return;
        }
        
        // Save user data
        saveUserData(username, avatar);
        
        // Update UI
        updateUserInterface(username, avatar);
        
        // Close modal
        profileModal.style.display = 'none';
    });
    
    console.log('Profile functionality initialized');
}

// Create profile modal HTML
function createProfileModal() {
    // Check if modal already exists
    if (document.getElementById('profile-modal')) {
        return;
    }
    
    // Create modal HTML
    const modalHTML = `
    <div id="profile-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-icon">
                <i class="fas fa-user-edit"></i>
            </div>
            <h2>Edit Profile</h2>
            <div class="profile-form">
                <div class="avatar-upload-container">
                    <img id="avatar-preview" src="assets/avatar.png" alt="Avatar Preview">
                    <div class="avatar-upload-btn">
                        <label for="avatar-upload" class="upload-label">
                            <i class="fas fa-camera"></i> Change Avatar
                        </label>
                        <input type="file" id="avatar-upload" accept="image/*" style="display: none;">
                    </div>
                </div>
                <div class="form-group">
                    <label for="profile-username">Username</label>
                    <input type="text" id="profile-username" placeholder="Enter your username">
                </div>
                <div class="button-group">
                    <button class="cancel-button">Cancel</button>
                    <button class="save-button">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Get user data from localStorage
function getUserData() {
    const defaultData = {
        username: 'Vikas',
        avatar: 'assets/avatar.png',
        level: 5,
        xpProgress: 75
    };
    
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : defaultData;
}

// Save user data to localStorage
function saveUserData(username, avatar) {
    // Get existing data
    const userData = getUserData();
    
    // Update with new values
    userData.username = username;
    userData.avatar = avatar;
    
    // Save to localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Update user interface with new data
function updateUserInterface(username, avatar) {
    // Update username in sidebar
    const usernameElement = document.querySelector('.user-info h3');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    
    // Update all avatar instances (both in main sidebar and mini sidebar)
    const avatarElements = document.querySelectorAll('.user-avatar img');
    avatarElements.forEach(img => {
        img.src = avatar;
    });
    
    // Log update for debugging
    console.log('Updated user interface with new avatar:', avatar);
}

// Load user data from localStorage and update UI
function loadUserData() {
    const userData = getUserData();
    updateUserInterface(userData.username, userData.avatar);
}