document.addEventListener('DOMContentLoaded', () => {

    // --- DYNAMIC NAVBAR LOGIC ---
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutBtn = document.getElementById('logout-btn');

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (token && user) {
        // User is logged in
        if (guestLinks) guestLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex';
        if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${user.username}!`;

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // Confirmation dialog added here
                if (confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    alert('You have been logged out.');
                    window.location.href = 'login.html';
                }
            });
        }
    } else {
        // User is a guest
        if (guestLinks) guestLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }


    // --- DARK MODE TOGGLE LOGIC ---
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme');

        if (currentTheme) {
            document.documentElement.setAttribute('data-theme', currentTheme);
        }

        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});