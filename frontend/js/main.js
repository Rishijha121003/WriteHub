document.addEventListener('DOMContentLoaded', () => {
    const postsList = document.getElementById('postsList');

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/posts');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const posts = await response.json();

            if (postsList) {
                postsList.innerHTML = '';
            }

            if (posts.length === 0) {
                if (postsList) {
                    postsList.innerHTML = '<p>No posts yet. Create one!</p>';
                }
                return;
            }

            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.style.animationDelay = `${index * 0.1}s`;
                const summary = post.content.substring(0, 150) + '...';

                // Yahan check karein ki link mein id pass ho rahi hai
                postElement.innerHTML = `
                    <h3>
                        <a href="post.html?id=${post._id}">${post.title}</a>
                    </h3>
                    <p class="post-meta">
                        By <a href="my-posts.html?author=${post.author}" class="author-link">${post.author}</a> 
                        on ${new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p class="post-excerpt">${summary}</p>
                    <a href="post.html?id=${post._id}" class="read-more-btn">Read More &rarr;</a>
                `;

                if (postsList) {
                    postsList.appendChild(postElement);
                }
            });
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (postsList) {
                postsList.innerHTML = '<p>Could not load posts. Make sure the backend server is running.</p>';
            }
        }
    };

    fetchPosts();
});