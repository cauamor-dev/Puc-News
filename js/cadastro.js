const API_URL = 'http://localhost:3000';
AOS.init({ duration: 800, easing: 'ease-in-out', once: true, mirror: false });

let editingNews = null;

async function loadAdminNews() {
    const response = await fetch(`${API_URL}/news`);
    const news = await response.json();
    const grid = document.getElementById('adminNewsGrid');
    grid.innerHTML = '';
    news.forEach((item, index) => {
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
                            <button class="btn btn-warning btn-sm edit-btn" data-id="${item.id}"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    AOS.refresh();
}

function showForm(news = null) {
    editingNews = news;
    const galleryValue = news && news.gallery ? news.gallery.join('\n') : '';
    const form = `
        <form id="newsForm" class="card card-body bg-dark text-white">
            <div class="row g-3">
                <div class="col-12">
                    <label class="form-label">Título</label>
                    <input type="text" class="form-control" name="title" value="${news ? news.title : ''}" required>
                </div>
                <div class="col-12">
                    <label class="form-label">Resumo</label>
                    <input type="text" class="form-control" name="summary" value="${news ? news.summary : ''}" required>
                </div>
                <div class="col-12">
                    <label class="form-label">Conteúdo</label>
                    <textarea class="form-control" name="content" rows="3" required>${news ? news.content : ''}</textarea>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label">Imagem (URL)</label>
                    <input type="text" class="form-control" name="image" value="${news ? news.image : ''}" required>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label">Tópico</label>
                    <select class="form-select" name="topic" required>
                        <option value="">Selecione...</option>
                        <option value="Cotidiano" ${news && news.topic === 'Cotidiano' ? 'selected' : ''}>Cotidiano</option>
                        <option value="Internacional" ${news && news.topic === 'Internacional' ? 'selected' : ''}>Internacional</option>
                        <option value="Trabalho e Carreira" ${news && news.topic === 'Trabalho e Carreira' ? 'selected' : ''}>Trabalho e Carreira</option>
                        <option value="Justiça" ${news && news.topic === 'Justiça' ? 'selected' : ''}>Justiça</option>
                        <option value="Ciência e Tecnologia" ${news && news.topic === 'Ciência e Tecnologia' ? 'selected' : ''}>Ciência e Tecnologia</option>
                        <option value="Economia" ${news && news.topic === 'Economia' ? 'selected' : ''}>Economia</option>
                    </select>
                </div>
                <div class="col-12">
                    <label class="form-label">Fotos da Notícia (1 URL por linha)</label>
                    <textarea class="form-control" name="gallery" rows="2" placeholder="Cole aqui as URLs das imagens, uma por linha...">${galleryValue}</textarea>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label">Data</label>
                    <input type="date" class="form-control" name="date" value="${news ? news.date : ''}" required>
                </div>
                <div class="col-12 col-md-6">
                    <label class="form-label">Destaque</label>
                    <select class="form-select" name="featured">
                        <option value="false" ${news && !news.featured ? 'selected' : ''}>Não</option>
                        <option value="true" ${news && news.featured ? 'selected' : ''}>Sim</option>
                    </select>
                </div>
            </div>
            <div class="mt-4 d-flex gap-2">
                <button type="submit" class="btn btn-success">${news ? 'Salvar Alterações' : 'Adicionar Notícia'}</button>
                <button type="button" class="btn btn-secondary" id="cancelFormBtn">Cancelar</button>
            </div>
        </form>
    `;
    const container = document.getElementById('formContainer');
    container.innerHTML = form;
    container.style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('formContainer').innerHTML = '';
    editingNews = null;
}

async function addNews(data) {
    data.featured = data.featured === 'true';
    const response = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    hideForm();
    loadAdminNews();
}

async function updateNews(id, data) {
    data.featured = data.featured === 'true';
    const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    hideForm();
    loadAdminNews();
}

async function removeNews(id) {
    if (!confirm('Tem certeza que deseja remover esta notícia?')) return;
    await fetch(`${API_URL}/news/${id}`, { method: 'DELETE' });
    loadAdminNews();
}

function updateLoginStatus() {
    const navLinks = document.querySelector('.nav-links');
    let loginBtn = navLinks.querySelector('a[href="login.html"]');
    let logoutBtn = navLinks.querySelector('a#logoutBtn');
    const user = JSON.parse(localStorage.getItem('userLogged') || 'null');
    if (user) {
        // Troca Login por Logout
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
        // Troca Logout por Login se necessário
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
    // Verifica se é admin
    const user = JSON.parse(localStorage.getItem('userLogged') || 'null');
    if (!user || user.userType !== 'admin') {
        document.body.innerHTML = '<div class="container py-5 text-center"><h2 class="text-danger">Acesso restrito!</h2><p>Você precisa estar logado como <b>administrador</b> para acessar o cadastro de notícias.</p><a href="login.html" class="btn btn-primary mt-3">Fazer Login</a><br><a href="index.html" class="btn btn-outline-light mt-3">Voltar para Home</a></div>';
        return;
    }
    loadAdminNews();
    document.getElementById('addBtn').addEventListener('click', () => showForm());
    document.getElementById('adminNewsGrid').addEventListener('click', (e) => {
        if (e.target.closest('.edit-btn')) {
            const id = e.target.closest('.edit-btn').dataset.id;
            fetch(`${API_URL}/news/${id}`)
                .then(res => res.json())
                .then(news => showForm(news));
        } else if (e.target.closest('.remove-btn')) {
            const id = e.target.closest('.remove-btn').dataset.id;
            removeNews(id);
        }
    });
    document.getElementById('formContainer').addEventListener('submit', (e) => {
        if (e.target.id === 'newsForm') {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            // Converter galeria para array
            if (data.gallery) {
                data.gallery = data.gallery.split('\n').map(url => url.trim()).filter(url => url);
            }
            if (editingNews) {
                updateNews(editingNews.id, data);
            } else {
                addNews(data);
            }
        }
    });
    document.getElementById('formContainer').addEventListener('click', (e) => {
        if (e.target.id === 'cancelFormBtn') {
            hideForm();
        }
    });
}); 