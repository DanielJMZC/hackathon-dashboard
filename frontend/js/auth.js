const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
localStorage.removeItem('user');

        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'index.html';
            } else {
                alert(result.message || 'Login Failed');
            }

        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    });

    localStorage.removeItem('user');


    const user = JSON.parse(localStorage.getItem('user'));
    if (user) window.location.href = 'index.html';
}


if (registerForm)  {
        registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());


        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                localStorage.setItem('user', JSON.stringify(result.user));
                window.location.href = 'index.html';
            } else {
                alert(result.message || 'Registration Failed');
            }

        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    });
}