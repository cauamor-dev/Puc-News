const API_URL = 'http://localhost:3000';

function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

function isFavorited(newsId) {
    newsId = Number(newsId);
    const favs = getFavorites();
    return favs.includes(newsId);
}

async function loadNewsDetails() {
    const id = getIdFromUrl();
    if (!id) {
        document.getElementById('newsDetails').innerHTML = '<div class="alert alert-danger">Notícia não encontrada.</div>';
        return;
    }
    try {
        const response = await fetch(`${API_URL}/news/${id}`);
        if (!response.ok) throw new Error('Notícia não encontrada');
        const news = await response.json();

        // Favorito
        const favorited = isFavorited(news.id);
        const favoriteIcon = favorited ? 'bi-heart-fill' : 'bi-heart';
        const favoriteTitle = favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos';

        document.getElementById('newsDetails').innerHTML = `
            <div class="card bg-dark text-white shadow-lg border-0 mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h1 class="card-title display-5 mb-0">${news.title}</h1>
                        <button class="btn btn-outline-primary favorite-btn" id="favoriteBtn" title="${favoriteTitle}">
                            <i class="bi ${favoriteIcon}" style="font-size:2rem;"></i>
                        </button>
                    </div>
                    <div class="mb-2 text-secondary small"><i class="bi bi-calendar-event"></i> ${news.date || ''} &nbsp; <span class="badge bg-primary">${news.topic || ''}</span></div>
                    <h5 class="mb-3">${news.summary}</h5>
                    <p class="card-text fs-5">${news.content}</p>
                </div>
            </div>
        `;

        // Galeria de fotos (simulação)
        let images = [news.image];
        if (news.gallery && Array.isArray(news.gallery) && news.gallery.length > 0) {
            images = news.gallery;
        } else {
            // Simula 4 imagens se não houver galeria
            images = [news.image, news.image, news.image, news.image];
        }
        document.getElementById('newsGallery').innerHTML = `
            <h4 class="mb-3 text-white">Fotos da Notícia</h4>
            <div class="row g-3 flex-nowrap overflow-auto" style="white-space:nowrap;">
                ${images.map(img => `
                    <div class="col-6 col-md-3">
                        <div class="gallery-img-card bg-dark rounded shadow-sm">
                            <img src="${img}" alt="Foto da notícia" class="img-fluid rounded gallery-img">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Favoritar/desfavoritar
        document.getElementById('favoriteBtn').addEventListener('click', function() {
            let favs = getFavorites();
            const icon = this.querySelector('i');
            const newsId = Number(news.id);
            if (!favs.includes(newsId)) {
                favs.push(newsId);
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                this.title = 'Remover dos favoritos';
            } else {
                favs = favs.filter(f => f !== newsId);
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                this.title = 'Adicionar aos favoritos';
            }
            setFavorites(favs);
        });
    } catch (error) {
        document.getElementById('newsDetails').innerHTML = '<div class="alert alert-danger">Notícia não encontrada.</div>';
    }
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
    loadNewsDetails();
}); 