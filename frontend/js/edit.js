document.addEventListener('DOMContentLoaded', () => {
    const editPostForm = document.getElementById('editPostForm');
    const titleInput = document.getElementById('edit-title');
    const contentInput = document.getElementById('edit-content');
    const backBtn = document.getElementById('backToPostBtn'); // <-- Yahan 'backToPostBtn' use ho raha hai

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // 1. Form mein purana data laakar bharna
    const populateForm = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`);
            if (!response.ok) { throw new Error('Post not found'); }
            const post = await response.json();
            titleInput.value = post.title;
            contentInput.value = post.content;
            backBtn.href = `post.html?id=${postId}`; // <-- Yahan 'backBtn' use ho raha hai
        } catch (error) {
            console.error('Error fetching post for edit:', error);
            document.body.innerHTML = '<h1>Post not found</h1>';
        }
    };

    // 2. Form submit hone par data ko update karna
    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedPost = {
            title: titleInput.value,
            content: contentInput.value
        };
        try {
            const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost)
            });

            if (response.ok) {
                window.location.href = `post.html?id=${postId}`;
            } else {
                alert('Failed to update post.');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('An error occurred while updating the post.');
        }
    });

    populateForm();
});