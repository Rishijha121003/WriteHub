document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. DYNAMIC NAVBAR LOGIC (For Icon-based Navbar)
    // ======================================================
    const guestLinks = document.getElementById('guest-links');
    const userLinks = document.getElementById('user-links'); // This is now the dropdown container
    const welcomeMessage = document.getElementById('welcome-message');
    const myPostsLink = document.getElementById('my-posts-link');
    const adminLink = document.getElementById('admin-link');

    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    if (token && user) {
        // User is logged in
        if (guestLinks) guestLinks.style.display = 'none';
        if (userLinks) userLinks.style.display = 'flex'; // Use flex for the user actions group
        if (welcomeMessage) welcomeMessage.textContent = `Hi, ${user.username}!`; // Welcome message in dropdown
        if (myPostsLink) myPostsLink.href = `my-posts.html?author=${user.username}`;

        // Admin link ko dropdown ke andar dikhana
        if (adminLink && user.role === 'admin') {
            adminLink.style.display = 'block';
        }
    } else {
        // User is a guest
        if (guestLinks) guestLinks.style.display = 'flex';
        if (userLinks) userLinks.style.display = 'none';
    }

    // ======================================================
    // 2. "BULLETPROOF" HAMBURGER MENU LOGIC
    // ======================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');

    const buildMobileMenu = () => {
        if (!mobileNav) return;
        mobileNav.innerHTML = '';

        const commonLinks = [
            { text: 'Home', href: 'index.html' },
            { text: 'All Posts', href: 'all-posts.html' }
        ];
        let linksToShow = [];

        if (token && user) { // Logged-in User ke links
            const userSpecificLinks = [
                { text: 'My Posts', href: `my-posts.html?author=${user.username}` },
                { text: 'Create New Post', href: 'create.html', isButton: true },
                { text: 'Logout', isLogout: true }
            ];
            if (user.role === 'admin') {
                linksToShow.push({ text: 'Admin Panel', href: 'admin.html' });
            }
            linksToShow = [...commonLinks, ...userSpecificLinks];
        } else { // Guest user ke links
            linksToShow = [
                ...commonLinks,
                { text: 'Login', href: 'login.html' },
                { text: 'Sign Up', href: 'signup.html', isButton: true }
            ];
        }

        // Ek-ek karke saare links banana
        linksToShow.forEach(linkInfo => {
            const el = linkInfo.isLogout ? document.createElement('button') : document.createElement('a');
            el.textContent = linkInfo.text;
            if (linkInfo.href) el.href = linkInfo.href;
            if (linkInfo.isButton) el.className = 'create-post-btn';
            if (linkInfo.isLogout) el.id = 'mobile-logout-btn';
            mobileNav.appendChild(el);
        });
    };

    if (hamburgerBtn && mobileNav) {
        buildMobileMenu();
        hamburgerBtn.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            hamburgerBtn.classList.toggle('active');
        });
    }

    // ======================================================
    // 3. LOGOUT & THEME TOGGLE LOGIC (Event Delegation)
    // ======================================================
    document.body.addEventListener('click', (e) => {
        // Desktop aur Mobile, dono logout buttons ko handle karna
        if (e.target.matches('#logout-btn') || e.target.matches('#mobile-logout-btn')) {
            if (confirm('Are you sure you want to log out?')) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                alert('You have been logged out.');
                window.location.href = 'login.html';
            }
        }
        // Theme Toggle Icon ko handle karna
        if (e.target.closest('#theme-toggle')) {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        }
    });

    // Page load par theme set karna
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
});