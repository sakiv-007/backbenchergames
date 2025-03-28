// Feedback form functionality

export function initFeedback() {
    const fileInput = document.getElementById('feedback-file');
    const previewContainer = document.querySelector('.attachment-preview');
    
    if (!fileInput || !previewContainer) return;
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        previewContainer.innerHTML = ''; // Clear previous previews
        
        if (this.files.length > 0) {
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                const attachmentItem = document.createElement('div');
                attachmentItem.className = 'attachment-item';
                
                // Create preview based on file type
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    attachmentItem.appendChild(img);
                } else if (file.type.startsWith('video/')) {
                    const video = document.createElement('video');
                    video.src = URL.createObjectURL(file);
                    video.setAttribute('muted', 'true');
                    attachmentItem.appendChild(video);
                    
                    // Add file type indicator
                    const fileType = document.createElement('div');
                    fileType.className = 'file-type';
                    fileType.textContent = 'VIDEO';
                    attachmentItem.appendChild(fileType);
                }
                
                // Add remove button
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-attachment';
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    attachmentItem.remove();
                    
                    // Create a new FileList without this file
                    // Note: FileList is immutable, so we'd need to reset the input
                    // This is a simplified approach
                    if (previewContainer.children.length === 0) {
                        fileInput.value = '';
                    }
                });
                
                attachmentItem.appendChild(removeBtn);
                previewContainer.appendChild(attachmentItem);
            }
        }
    });
    
    // Handle form submission
    const feedbackForm = document.querySelector('.feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const feedbackText = this.querySelector('textarea').value;
            const files = fileInput.files;
            
            // Here you would normally send the data to your server
            console.log('Feedback submitted:', feedbackText);
            console.log('Files attached:', files.length);
            
            // Show success message
            alert('Thank you for your feedback!');
            
            // Reset form
            this.reset();
            previewContainer.innerHTML = '';
        });
    }
}