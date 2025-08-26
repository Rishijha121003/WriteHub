document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // Step 1: Security Check - Kya user Admin hai?
    // ======================================================
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    if (!user || user.role !== 'admin') {
        alert('Access Denied. You must be an admin to view this page.');
        window.location.href = 'index.html';
        return; // Yahan se aage code nahi chalega
    }

    // ======================================================
    // Step 2: HTML Elements ko Select Karna
    // ======================================================
    const userListBody = document.getElementById('user-list');
    const totalUsersEl = document.getElementById('total-users');
    const totalPostsEl = document.getElementById('total-posts');
    const popularPostsListEl = document.getElementById('popular-posts-list');

    // ======================================================
    // Step 3: Backend se Data Fetch karna aur Dikhana
    // ======================================================
    const loadDashboardData = async () => {
        try {
            // Users ka data fetch karna
            const usersResponse = await fetch('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!usersResponse.ok) throw new Error('Could not fetch users.');
            const users = await usersResponse.json();

            // --- YEH HISSA UPDATE HUA HAI ---
            // Posts ka count fetch karna (Naye route se)
            const postsCountResponse = await fetch('http://localhost:3000/api/posts/stats/count');
            if (!postsCountResponse.ok) throw new Error('Could not fetch post count.');
            const postsCountData = await postsCountResponse.json();
            // ---------------------------------

            // Popular posts ka data fetch karna
            const popularPostsResponse = await fetch('http://localhost:3000/api/posts/stats/popular');
            if (!popularPostsResponse.ok) throw new Error('Could not fetch popular posts.');
            const popularPosts = await popularPostsResponse.json();

            // Page par stats update karna
            if (totalUsersEl) totalUsersEl.textContent = users.length;
            if (totalPostsEl) totalPostsEl.textContent = postsCountData.totalPosts;

            // Page par users ki table banana
            if (userListBody) {
                userListBody.innerHTML = '';
                users.forEach(u => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${u.username}</td>
                        <td>${u.email}</td>
                        <td>${u.role}</td>
                        <td><button class="btn-danger" data-id="${u._id}" data-username="${u.username}">Delete</button></td>
                    `;
                    userListBody.appendChild(row);
                });
            }

            // Page par popular posts ki list banana
            if (popularPostsListEl) {
                popularPostsListEl.innerHTML = '';
                if (popularPosts.length > 0) {
                    popularPosts.forEach(post => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                <div class="popular-post-info">
                    <a href="post.html?id=${post._id}">${post.title}</a>
                    <small>by ${post.author}</small>
                </div>
                <span>${post.views} views</span>
            `;
                        popularPostsListEl.appendChild(listItem);
                    });
                } else {
                    popularPostsListEl.innerHTML = '<li>No posts have been viewed yet.</li>';
                }
            }

        } catch (error) {
            console.error("Error loading dashboard data:", error);
            if (userListBody) userListBody.innerHTML = '<tr><td colspan="4">Could not load data.</td></tr>';
        }
    };

    // ======================================================
    // Step 4: Delete User Button ke Liye Event Listener
    // ======================================================
    const handleDeleteClick = async (e) => {
        if (e.target && e.target.classList.contains('btn-danger')) {
            const userId = e.target.dataset.id;
            const username = e.target.dataset.username;

            if (confirm(`Are you sure you want to delete the user '${username}'?`)) {
                try {
                    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    alert(data.message);
                    if (response.ok) {
                        loadDashboardData(); // List ko refresh karna
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    alert('An error occurred.');
                }
            }
        }
    };

    if (userListBody) {
        userListBody.addEventListener('click', handleDeleteClick);
    }

    // Page load hote hi saara data load karna
    loadDashboardData();
});