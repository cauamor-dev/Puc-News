// Configuração da API
const API_URL = 'http://localhost:3000';
let currentPage = 1;
const newsPerPage = 8;

// Inicialização do AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Inicialização do Swiper
const swiper = new Swiper('.featured-news', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    }
});

// Função para mostrar/esconder loading
function toggleLoading(show) {
    const overlay = document.querySelector('.loading-overlay');
    overlay.style.opacity = show ? '1' : '0';
    setTimeout(() => {
        overlay.style.display = show ? 'flex' : 'none';
    }, show ? 0 : 500);
}

// Função para carregar notícias em destaque (carrossel)
async function loadFeaturedNews() {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/news?featured=true`);
        const news = await response.json();
        
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = '';

        news.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="carousel-caption">
                    <h3 data-aos="fade-up" data-aos-delay="${index * 100}">${item.title}</h3>
                    <p data-aos="fade-up" data-aos-delay="${index * 100 + 200}">${item.summary}</p>
                    <button class="btn btn-primary mt-3" data-aos="fade-up" data-aos-delay="${index * 100 + 400}" onclick="readMore(${item.id})">
                        Ler mais
                    </button>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        swiper.update();
    } catch (error) {
        console.error('Erro ao carregar notícias em destaque:', error);
        showNotification('Erro ao carregar notícias em destaque', 'error');
    } finally {
        toggleLoading(false);
    }
}

// Função para criar card de notícia
function createNewsCard(news, index) {
    return `
        <div class="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="news-card">
                <img src="${news.image}" alt="${news.title}">
                <div class="news-card-content">
                    <div class="d-flex flex-column align-items-center mb-2">
                        <span class="badge bg-primary text-light mb-2" style="font-size:0.95rem;">${news.topic || ''}</span>
                        <h3 class="mb-0 text-center">${news.title}</h3>
                    </div>
                    <p>${news.summary}</p>
                    <div class="news-card-actions">
                        <button class="btn btn-primary read-more" data-id="${news.id}">
                            Ler mais
                        </button>
                        <button class="btn btn-outline-primary favorite-btn" data-id="${news.id}">
                            <i class="bi bi-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Função para obter favoritos do localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

// Função para salvar favoritos no localStorage
function setFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
}

// Função para verificar se notícia está favoritada
function isFavorited(newsId) {
    newsId = Number(newsId);
    const favs = getFavorites();
    return favs.includes(newsId);
}

// Função para alternar favorito
function toggleFavorite(newsId, btn) {
    newsId = Number(newsId);
    let favs = getFavorites();
    const icon = btn.querySelector('i');
    if (!favs.includes(newsId)) {
        favs.push(newsId);
        icon.classList.replace('bi-heart', 'bi-heart-fill');
        btn.classList.add('active');
        showNotification('Notícia adicionada aos favoritos');
    } else {
        favs = favs.filter(f => f !== newsId);
        icon.classList.replace('bi-heart-fill', 'bi-heart');
        btn.classList.remove('active');
        showNotification('Notícia removida dos favoritos');
    }
    setFavorites(favs);
}

// Atualizar ícones de favoritos ao renderizar
function updateFavoriteIcons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const newsId = Number(btn.dataset.id);
        const icon = btn.querySelector('i');
        if (isFavorited(newsId)) {
            icon.classList.add('bi-heart-fill');
            icon.classList.remove('bi-heart');
            btn.classList.add('active');
        } else {
            icon.classList.add('bi-heart');
            icon.classList.remove('bi-heart-fill');
            btn.classList.remove('active');
        }
    });
}

// Função para carregar notícias
async function loadNews(page = 1) {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/news?_page=${page}&_limit=${newsPerPage}`);
        const news = await response.json();
        const newsGrid = document.getElementById('newsGrid');
        if (page === 1) {
            newsGrid.innerHTML = '';
        }
        news.forEach((item, index) => {
            newsGrid.innerHTML += createNewsCard(item, index);
        });
        // Atualizar estado do botão "Carregar Mais"
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.style.display = news.length === newsPerPage ? 'block' : 'none';
        // Reinicializar AOS para os novos elementos
        AOS.refresh();
        updateFavoriteIcons();
    } catch (error) {
        console.error('Erro ao carregar notícias:', error);
        showNotification('Erro ao carregar notícias', 'error');
    } finally {
        toggleLoading(false);
    }
}

// Função para carregar dados do gráfico
async function loadChartData() {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/news`);
        const news = await response.json();
        
        // Agrupar notícias por tópico
        const topics = news.reduce((acc, item) => {
            acc[item.topic] = (acc[item.topic] || 0) + 1;
            return acc;
        }, {});

        // Criar gráfico com animação
        const ctx = document.getElementById('newsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(topics),
                datasets: [{
                    label: 'Quantidade de Notícias por Tópico',
                    data: Object.values(topics),
                    backgroundColor: '#6a1b9a',
                    borderColor: '#9c4dcc',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
        showNotification('Erro ao carregar dados do gráfico', 'error');
    } finally {
        toggleLoading(false);
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 100);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Função para filtrar notícias por texto e tópico
async function filterNews() {
    const searchText = document.getElementById('searchInput').value.trim().toLowerCase();
    const topic = document.getElementById('topicFilter').value;
    toggleLoading(true);
    const response = await fetch(`${API_URL}/news`);
    const news = await response.json();
    let filtered = news.filter(item => {
        const matchText = item.title.toLowerCase().includes(searchText) || item.summary.toLowerCase().includes(searchText);
        const matchTopic = !topic || item.topic === topic;
        return matchText && matchTopic;
    });
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '';
    filtered.forEach((item, index) => {
        newsGrid.innerHTML += createNewsCard(item, index);
    });
    // Atualizar estado do botão "Carregar Mais"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = 'none';
    AOS.refresh();
    updateFavoriteIcons();
    toggleLoading(false);
}

// Função para atualizar status de login na home
function updateLoginStatus() {
    const navLinks = document.querySelector('.nav-links');
    let loginBtn = navLinks.querySelector('a[href="login.html"]');
    let logoutBtn = navLinks.querySelector('a#logoutBtn');
    const user = JSON.parse(localStorage.getItem('userLogged') || 'null');
    let statusMsg = document.getElementById('loginStatusMsg');
    if (!statusMsg) {
        statusMsg = document.createElement('div');
        statusMsg.id = 'loginStatusMsg';
        statusMsg.className = 'text-center my-3';
        document.querySelector('main.container').prepend(statusMsg);
    }
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
        statusMsg.innerHTML = `<span style="color: var(--primary-light); font-size:1.2rem;">Seja bem-vindo, <b>${user.name}</b>!</span>`;
        // Logout
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
        statusMsg.innerHTML = `<span style="color: #ff4444; font-size:1.1rem;">Você não está logado. Algumas funcionalidades podem ser limitadas.</span>`;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateLoginStatus();
    // Carregar conteúdo inicial
    loadFeaturedNews();
    loadNews();
    loadChartData();

    // Event listener para o botão "Carregar Mais"
    document.getElementById('loadMoreBtn').addEventListener('click', () => {
        currentPage++;
        loadNews(currentPage);
    });

    // Event delegation para botões de favorito e ler mais
    document.getElementById('newsGrid').addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn')) {
            const btn = e.target.closest('.favorite-btn');
            const newsId = btn.dataset.id;
            const user = JSON.parse(localStorage.getItem('userLogged') || 'null');
            if (!user) {
                showNotification('Você precisa estar logado para favoritar notícias.', 'error');
                return;
            }
            toggleFavorite(newsId, btn);
        } else if (e.target.closest('.read-more')) {
            const btn = e.target.closest('.read-more');
            const newsId = btn.dataset.id;
            readMore(newsId);
        }
    });

    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    document.getElementById('searchInput').addEventListener('input', filterNews);
    document.getElementById('searchBtn').addEventListener('click', filterNews);
    document.getElementById('topicFilter').addEventListener('change', filterNews);
});

// Função para ler mais
function readMore(newsId) {
    window.location.href = `detalhes.html?id=${newsId}`;
} 