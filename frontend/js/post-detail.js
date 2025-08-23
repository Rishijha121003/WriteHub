document.addEventListener('DOMContentLoaded', () => {
    const postDetailContainer = document.getElementById('post-detail-container');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const deletePost = async () => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Post deleted successfully!');
                window.location.href = 'index.html';
            } else {
                alert('Failed to delete the post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('An error occurred while deleting the post.');
        }
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

            // --- YEH SECTION UPDATE HUA HAI ---
            postDetailContainer.innerHTML = `
                <h1>${post.title}</h1>
                <p class="post-meta">
                    By <a href="my-posts.html?author=${post.author}" class="author-link">${post.author}</a> 
                    on ${new Date(post.createdAt).toLocaleDateString()}
                </p>
                <hr>
                <div class="post-content">${post.content.replace(/\n/g, '<br>')}</div>
                <hr>
                <div class="post-actions">
                    <button id="updateBtn">Update Post</button>
                    <button id="deleteBtn">Delete Post</button>
                </div>
            `;
            // ------------------------------------

            const deleteBtn = document.getElementById('deleteBtn');
            deleteBtn.addEventListener('click', deletePost);

            const updateBtn = document.getElementById('updateBtn');
            updateBtn.addEventListener('click', () => {
                window.location.href = `edit.html?id=${postId}`;
            });
        } catch (error) {
            console.error('Error fetching post:', error);
            postDetailContainer.innerHTML = '<h1>Could not load the post.</h1>';
        }
    };

    fetchPostById();
});