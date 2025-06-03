const API_URL = 'http://localhost:3000';

function showMessage(msg, type = 'info') {
    const el = document.getElementById('loginMessage');
    el.textContent = msg;
    el.style.color = type === 'error' ? '#ff4444' : 'var(--primary-light)';
}

// Mostrar/ocultar senha
const passwordInput = document.getElementById('password');
document.getElementById('togglePassword').addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        document.querySelector('#togglePassword i').classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        document.querySelector('#togglePassword i').classList.replace('bi-eye-slash', 'bi-eye');
    }
});

// Alternar entre login e cadastro
const registerArea = document.getElementById('registerArea');
document.getElementById('registerBtn').addEventListener('click', () => {
    registerArea.style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    showMessage('Preencha os dados para se cadastrar:', 'info');
});
document.getElementById('cancelRegisterBtn').addEventListener('click', () => {
    registerArea.style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    showMessage('');
});

// Lembrar usuário
window.addEventListener('DOMContentLoaded', () => {
    const remembered = localStorage.getItem('rememberedUser');
    if (remembered) {
        document.getElementById('email').value = remembered;
        document.getElementById('rememberMe').checked = true;
    }
    updateLoginStatus();
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('rememberMe').checked;
    try {
        const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
        const users = await res.json();
        const user = users.find(u => u.password === password);
        if (!user) {
            showMessage('E-mail ou senha inválidos.', 'error');
            return;
        }
        // Lembrar usuário
        if (remember) {
            localStorage.setItem('rememberedUser', email);
        } else {
            localStorage.removeItem('rememberedUser');
        }
        // Salvar login
        localStorage.setItem('userLogged', JSON.stringify({ name: user.name, email: user.email, userType: user.userType }));
        showMessage(`Seja bem-vindo, ${user.name}!`, 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1200);
    } catch (err) {
        showMessage('Erro ao tentar logar.', 'error');
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const userType = document.getElementById('userType').value;
    if (!name || !email || !password || !userType) {
        showMessage('Preencha todos os campos.', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showMessage('As senhas não coincidem.', 'error');
        return;
    }
    try {
        // Verifica se já existe
        const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}`);
        const users = await res.json();
        if (users.length > 0) {
            showMessage('E-mail já cadastrado.', 'error');
            return;
        }
        // Cadastra
        await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, userType })
        });
        showMessage('Cadastro realizado! Agora faça login.', 'info');
        registerArea.style.display = 'none';
        document.getElementById('loginForm').style.display = 'block';
    } catch (err) {
        showMessage('Erro ao cadastrar usuário.', 'error');
    }
});

function updateLoginStatus() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    let loginBtn = navLinks.querySelector('a[href="login.html"]');
    let logoutBtn = navLinks.querySelector('a#logoutBtn');
    const user = JSON.parse(localStorage.getItem('userLogged') || 'null');
    if (user) {
        if (loginBtn) {
            const logout = document.createElement('a');
            logout.className = 'nav-link hover-effect';
            logout.id = 'logoutBtn';
            logout.href = '#';
            logout.textContent = 'Logout';
            loginBtn.replaceWith(logout);
        }
        logoutBtn = navLinks.querySelector('a#logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                localStorage.removeItem('userLogged');
                window.location.reload();
            };
        }
    } else {
        if (!loginBtn && navLinks.querySelector('a#logoutBtn')) {
            const login = document.createElement('a');
            login.className = 'nav-link hover-effect';
            login.href = 'login.html';
            login.textContent = 'Login';
            navLinks.querySelector('a#logoutBtn').replaceWith(login);
        }
    }
} 