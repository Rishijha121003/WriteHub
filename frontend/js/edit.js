document.addEventListener('DOMContentLoaded', () => {
    const editPostForm = document.getElementById('editPostForm');
    const titleInput = document.getElementById('edit-title');
    const contentInput = document.getElementById('edit-content');
    const backBtn = document.getElementById('backToPostBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const populateForm = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
            if (!response.ok) { throw new Error('Post not found'); }
            const post = await response.json();
            titleInput.value = post.title;
            contentInput.value = post.content;
            if (backBtn) backBtn.href = `post.html?id=${postId}`;
        } catch (error) {
            console.error('Error fetching post for edit:', error);
            document.body.innerHTML = '<h1>Post not found</h1>';
        }
    };

    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedPost = { title: titleInput.value, content: contentInput.value };
        try {
            // YAHAN localStorage ki jagah sessionStorage se token lena hai
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('You are not logged in!');
                window.location.href = 'login.html';
                return;
            }
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Token ko header mein bhejna
                },
                body: JSON.stringify(updatedPost)
            });
            if (response.ok) {
                alert('Post updated successfully!');
                window.location.href = `post.html?id=${postId}`;
            } else {
                const data = await response.json();
                alert(`Failed to update post: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('An error occurred while updating the post.');
        }
    });

    populateForm();
});