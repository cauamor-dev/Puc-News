# Puc News

Portal de Notícias Acadêmico desenvolvido para a disciplina de Desenvolvimento de Interfaces Web (DIW).

## ✨ Visão Geral
O Puc News é um portal moderno, responsivo e com tema escuro, que permite visualizar, cadastrar, favoritar e gerenciar notícias reais, com autenticação de usuários e controle de acesso para administradores.

## 🚀 Funcionalidades
- Home com carrossel de notícias em destaque
- Grid de notícias com busca e filtro por tópico
- Visualização de detalhes da notícia e galeria de fotos
- Sistema de favoritos (por usuário logado)
- Cadastro, edição e remoção de notícias (apenas admin)
- Login e cadastro de usuários (usuário e admin)
- Gráfico dinâmico de notícias por tópico (Chart.js)
- Mensagens de feedback, alertas e boas-vindas
- Footer com informações do autor (nome, foto, curso, redes sociais)
- Design responsivo para desktop e mobile

## 🛠️ Tecnologias Utilizadas
- HTML5, CSS3 (tema escuro, responsivo)
- JavaScript (ES6+)
- [JSON Server](https://github.com/typicode/json-server) (API REST fake)
- Bootstrap 5
- Bootstrap Icons
- Chart.js
- AOS (Animate On Scroll)
- Swiper.js (carrossel)

## 📁 Estrutura de Pastas
```
TrabalhoPratico2/
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── imagens/
│   │   └── caca normal.jpg (e outras imagens)
│   ├── js/
│   │   ├── main.js
│   │   ├── cadastro.js
│   │   ├── detalhes.js
│   │   ├── favoritos.js
│   │   └── login.js
│   ├── index.html
│   ├── cadastro.html
│   ├── detalhes.html
│   ├── favoritos.html
│   └── login.html
├── db.json (banco de dados do JSON Server)
└── README.md
```

## ⚙️ Como Rodar o Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [JSON Server](https://github.com/typicode/json-server) instalado globalmente:
  ```bash
  npm install -g json-server
  ```

### 2. Clonar o repositório
```bash
git clone <url-do-seu-repositorio>
cd TrabalhoPratico2
```

### 3. Iniciar o JSON Server
Certifique-se de que o arquivo `db.json` está na raiz do projeto.
```bash
json-server --watch db.json --port 3000
```

### 4. Abrir o projeto
Abra o arquivo `public/index.html` no seu navegador (basta dar duplo clique ou usar uma extensão de servidor local como Live Server no VSCode).

> **Obs:** O front-end faz requisições para `http://localhost:3000`, então o JSON Server deve estar rodando nesse endereço.

## 👤 Autor
- **Nome:** Cauã Moreira Martins
- **Curso:** Sistemas de Informação
- **Matrícula:** 00878733
- **Instagram:** [@caua.moreiraa](https://www.instagram.com/caua.moreiraa/)
- **LinkedIn:** [Cauã Moreira](https://www.linkedin.com/in/cauã-moreira-57a2aa353)

## 📄 Licença
Projeto acadêmico, livre para fins educacionais. 