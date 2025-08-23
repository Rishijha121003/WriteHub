document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitButton = e.target.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = 'Logging In...';

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // --- SABSE ZAROORI PART ---
                // Token aur user info ko browser ki localStorage mein save karna
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                alert('Login successful!');
                // User ko homepage par bhej do
                window.location.href = 'index.html';
            } else {
                alert(`Login failed: ${data.message}`);
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'Login';
        }
    });
});