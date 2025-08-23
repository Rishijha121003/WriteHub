document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value; // <-- YEH LINE MISSING THI
        const password = document.getElementById('password').value;
        const submitButton = e.target.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = 'Signing Up...';

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Ab yahan 'email' ki sahi value jaayegi
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! You can now log in.');
                window.location.href = 'login.html';
            } else {
                alert(`Registration failed: ${data.message}`);
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Up';
        }
    });
});