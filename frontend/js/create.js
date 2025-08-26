document.addEventListener('DOMContentLoaded', () => {
    const createPostForm = document.getElementById('postForm');

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = e.target.querySelector('button[type="submit"]');

        // --- YEH NAYA CHECK HAI ---
        // Agar button pehle se hi disabled hai, toh kuch na karein
        if (submitButton.disabled) {
            return;
        }
        // -------------------------

        // Button ko turant disable kar dein
        submitButton.disabled = true;
        submitButton.textContent = 'Publishing...';

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            const token = sessionStorage.getItem('token');
            if (!token) { /* ... */ }

            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                alert('Post created successfully!');
                window.location.href = 'index.html';
            } else {
                const data = await response.json();
                alert(`Failed to create post: ${data.message}`);
                submitButton.disabled = false; // Error aane par button wapas enable karein
                submitButton.textContent = 'Publish Post';
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred while creating the post.');
            submitButton.disabled = false; // Error aane par button wapas enable karein
            submitButton.textContent = 'Publish Post';
        }
    });
})