document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.getElementById('comments-container');
    
    // Cloudflare Workers endpoint
    const WORKER_URL = 'https://machine-love-comments.your-worker.workers.dev';
    
    // Function to fetch comments
    async function fetchComments() {
        try {
            const response = await fetch(`${WORKER_URL}/comments`);
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            
            const comments = await response.json();
            displayComments(comments);
        } catch (error) {
            commentsContainer.innerHTML = `
                <div class="error-message">
                    <p>Failed to load comments. Please try again later.</p>
                    <button class="pixel-button" onclick="fetchComments()">Retry</button>
                </div>
            `;
            console.error('Error fetching comments:', error);
        }
    }
    
    // Function to display comments
    function displayComments(comments) {
        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to leave a comment!</p>';
            return;
        }
        
        let commentsHTML = '';
        comments.forEach(comment => {
            const date = new Date(comment.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            commentsHTML += `
                <div class="comment">
                    <div class="comment-avatar">
                        <img src="default-pfp-2.jpg" alt="Profile Picture" class="profile-pic">
                    </div>
                    <div class="comment-content">
                        <div class="comment-meta">
                            <span class="comment-author">${escapeHTML(comment.name)}</span>
                            <span class="comment-date">${date}</span>
                        </div>
                        <p>${escapeHTML(comment.comment)}</p>
                    </div>
                </div>
            `;
        });
        
        commentsContainer.innerHTML = commentsHTML;
    }
    
    // Helper function to escape HTML
    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[tag]));
    }
    
    // Handle form submission
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const comment = document.getElementById('comment').value;
            
            // Simple validation
            if (!name || !comment) {
                alert('Please fill in all fields');
                return;
            }
            
            const submitBtn = commentForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                const response = await fetch(`${WORKER_URL}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        comment,
                        timestamp: new Date().toISOString()
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Failed to submit comment');
                }
                
                // Reset form
                commentForm.reset();
                alert('Comment submitted successfully!');
                
                // Refresh comments
                fetchComments();
            } catch (error) {
                alert('Failed to submit comment. Please try again later.');
                console.error('Error submitting comment:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Comment';
            }
        });
    }
    
    // Initial load of comments
    fetchComments();
});