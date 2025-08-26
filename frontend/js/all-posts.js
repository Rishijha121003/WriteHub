document.addEventListener('DOMContentLoaded', () => {
    const postsList = document.getElementById('postsList');
    const paginationContainer = document.getElementById('pagination-container');

    const fetchPosts = async (page = 1) => {
        try {
            // Backend se posts maangna (ek page par 10)
            const response = await fetch(`http://localhost:3000/api/posts?page=${page}&limit=5`);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const { posts, totalPages, currentPage } = data;

            postsList.innerHTML = '';
            if (posts.length === 0) {
                postsList.innerHTML = '<p>No posts found.</p>';
                return;
            }

            posts.forEach((post, index) => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                const summary = post.content.substring(0, 200) + '...';
                postElement.innerHTML = `
                    <h3><a href="post.html?id=${post._id}">${post.title}</a></h3>
                    <p class="post-meta">
                        By <a href="my-posts.html?author=${post.author}" class="author-link">${post.author}</a> 
                        on ${new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p class="post-excerpt">${summary}</p>
                    <a href="post.html?id=${post._id}" class="read-more-btn">Read More &rarr;</a>
                `;
                postsList.appendChild(postElement);
            });

            // Pagination buttons banana
            renderPagination(totalPages, currentPage);

        } catch (error) {
            console.error('Error fetching posts:', error);
            postsList.innerHTML = '<p>Could not load posts. Make sure the backend server is running.</p>';
        }
    };

    const renderPagination = (totalPages, currentPage) => {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'pagination-btn';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                fetchPosts(i);
                window.scrollTo(0, 0); // Page number click karne par upar scroll karein
            });
            paginationContainer.appendChild(pageButton);
        }
    };

    // Page load hone par pehla page fetch karna
    fetchPosts(1);
});