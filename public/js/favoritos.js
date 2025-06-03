const API_URL = 'http://localhost:3000';
AOS.init({ duration: 800, easing: 'ease-in-out', once: true, mirror: false });

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

async function loadFavorites() {
    const favorites = getFavorites();
    if (favorites.length === 0) {
        document.getElementById('favoritesGrid').innerHTML = '<div class="text-center text-secondary w-100">Nenhuma notícia favoritada.</div>';
        return;
    }
    const response = await fetch(`${API_URL}/news`);
    const news = await response.json();
    const favNews = news.filter(n => favorites.includes(Number(n.id)));
    const grid = document.getElementById('favoritesGrid');
    grid.innerHTML = '';
    favNews.forEach((item, index) => {
        grid.innerHTML += `
            <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="news-card">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="news-card-content">
                        <div class="d-flex flex-column align-items-center mb-2">
                            <span class="badge bg-primary text-light mb-2" style="font-size:0.95rem;">${item.topic || ''}</span>
                            <h3 class="mb-0 text-center">${item.title}</h3>
                        </div>
                        <p>${item.summary}</p>
                        <div class="news-card-actions">
                            <button class="btn btn-primary read-more" data-id="${item.id}">Ler mais</button>
                            <button class="btn btn-outline-danger unfavorite-btn" data-id="${item.id}"><i class="bi bi-heart-fill"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    AOS.refresh();
}

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

document.addEventListener('DOMContentLoaded', () => {
    updateLoginStatus();
    const user = JSON.parse(localStorage.getItem('userLogged') || 'null');
    if (!user) {
        document.getElementById('favLoginMsg').innerHTML = '<div class="alert alert-warning text-center">Você não está logado. Suas notícias favoritas não serão exibidas.</div>';
        return;
    }
    loadFavorites();
    document.getElementById('favoritesGrid').addEventListener('click', (e) => {
        if (e.target.closest('.unfavorite-btn')) {
            const btn = e.target.closest('.unfavorite-btn');
            const id = Number(btn.dataset.id);
            let favs = getFavorites();
            favs = favs.filter(f => f !== id);
            setFavorites(favs);
            loadFavorites();
        } else if (e.target.closest('.read-more')) {
            const btn = e.target.closest('.read-more');
            const id = btn.dataset.id;
            window.location.href = `detalhes.html?id=${id}`;
        }
    });
}); 