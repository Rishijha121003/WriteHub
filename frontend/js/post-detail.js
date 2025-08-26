document.addEventListener('DOMContentLoaded', () => {
    const postDetailContainer = document.getElementById('post-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const deletePost = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to delete a post.');
            return;
        }
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Post deleted successfully!');
                window.location.href = 'index.html';
            } else {
                const data = await response.json();
                alert(`Failed to delete the post: ${data.message}`);
            }
        } catch (error) { console.error('Error deleting post:', error); }
    };

    const fetchPostById = async () => {
        if (!postId) {
            postDetailContainer.innerHTML = '<h1>Post ID not found.</h1>';
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
            if (!response.ok) {
                postDetailContainer.innerHTML = '<h1>Post not found.</h1>';
                return;
            }
            const post = await response.json();
            const postDate = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            postDetailContainer.innerHTML = `
                <h1>${post.title}</h1>
                <p class="post-meta">
                    By <a href="my-posts.html?author=${post.author}" class="author-link">${post.author}</a> 
                    on ${postDate}
                </p>
                <hr>
                <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
                <hr>
                <div class="post-actions" style="display: none;">
                    <button id="updateBtn">Update Post</button>
                    <button id="deleteBtn">Delete Post</button>
                </div>
            `;

            const authorBoxContainer = document.getElementById('author-box-container');
            if (authorBoxContainer) {
                authorBoxContainer.innerHTML = `
                    <h3 class="widget-title">About the Author</h3>
                    <p>This post was written by <strong>${post.author}</strong>. Check out all their posts!</p>
                `;
                authorBoxContainer.style.display = 'block';
            }

            // --- YEH FINAL SECURITY CHECK HAI ---
            // Check karta hai ki user logged-in hai AUR (ya toh woh author hai YA woh admin hai)
            const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
            if (loggedInUser && (loggedInUser.username.toLowerCase() === post.author.toLowerCase() || loggedInUser.role === 'admin')) {
                const postActions = document.querySelector('.post-actions');
                if (postActions) postActions.style.display = 'flex'; // Sirf tabhi buttons ko dikhana

                document.getElementById('deleteBtn').addEventListener('click', deletePost);
                document.getElementById('updateBtn').addEventListener('click', () => {
                    window.location.href = `edit.html?id=${postId}`;
                });
            }

        } catch (error) {
            console.error('Error fetching post:', error);
            postDetailContainer.innerHTML = '<h1>Could not load the post.</h1>';
        }
    };

    fetchPostById();
});