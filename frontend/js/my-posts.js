document.addEventListener('DOMContentLoaded', () => {
    const postsList = document.getElementById('postsList');
    const pageTitle = document.getElementById('page-title');

    // URL se author ka naam nikalna (e.g., ?author=Rishi)
    const urlParams = new URLSearchParams(window.location.search);
    const authorName = urlParams.get('author');

    if (!authorName) {
        pageTitle.textContent = 'Author not specified!';
        return;
    }

    pageTitle.textContent = `Posts by ${authorName}`;

    const fetchPostsByAuthor = async () => {
        try {
            // Naye backend route ko call karna
            const response = await fetch(`http://localhost:3000/api/posts/author/${authorName}`);
            if (!response.ok) {
                throw new Error('Could not fetch posts');
            }
            const posts = await response.json();

            postsList.innerHTML = ''; // Clear existing list

            if (posts.length === 0) {
                postsList.innerHTML = `<p>No posts found for ${authorName}.</p>`;
                return;
            }

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                const summary = post.content.substring(0, 150) + '...';
                postElement.innerHTML = `
                    <h3><a href="post.html?id=${post._id}">${post.title}</a></h3>
                    <p class="post-meta">By ${post.author} on ${new Date(post.createdAt).toLocaleDateString()}</p>
                    <p class="post-excerpt">${summary}</p>
                    <a href="post.html?id=${post._id}" class="read-more-btn">Read More &rarr;</a>
                `;
                postsList.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error:', error);
            postsList.innerHTML = '<p>Could not load posts.</p>';
        }
    };

    fetchPostsByAuthor();
});