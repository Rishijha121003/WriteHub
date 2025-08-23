document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('postForm');

    // Event listener for the form submission
    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const content = document.getElementById('content').value;
        const submitButton = e.target.querySelector('button[type="submit"]');

        // Disable button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = 'Publishing...';

        try {
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, author, content }),
            });

            if (response.ok) {
                alert('Post created successfully!');
                // Agar post create ho jaaye, toh user ko homepage par bhej do
                window.location.href = 'index.html';
            } else {
                alert('Failed to create post.');
                submitButton.disabled = false;
                submitButton.textContent = 'Publish Post';
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post.');
            submitButton.disabled = false;
            submitButton.textContent = 'Publish Post';
        }
    });
});