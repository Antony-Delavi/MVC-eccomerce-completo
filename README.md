# 🛒 TechStore - E-commerce Completo (Fullstack)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Uma plataforma de e-commerce completa construída do zero, desenvolvida para demonstrar habilidades avançadas em desenvolvimento Web Fullstack, abrangendo desde a interface do usuário até a segurança do servidor e manipulação de arquivos.

## 📌 Visão Geral

O projeto consiste em uma loja virtual (TechStore) que atende a dois tipos de usuários: **Clientes** e **Administradores**, utilizando autenticação baseada em JWT (JSON Web Tokens). O sistema segue a arquitetura **MVC (Model-View-Controller)** e consome uma **API RESTful** construída em Node.js.

### 🌟 Funcionalidades Principais

**Para Clientes:**
* 🛍️ **Vitrine Dinâmica:** Listagem de produtos com filtros por categoria em tempo real.
* 🛒 **Carrinho de Compras:** Adição, remoção e atualização de quantidades com persistência local (LocalStorage).
* 🔐 **Autenticação:** Sistema de Cadastro e Login seguro.
* 📦 **Área do Cliente:** Painel exclusivo para visualizar o histórico detalhado de compras.
* 💳 **Checkout:** Validação de dados de entrega e processamento de pedido.

**Para Administradores:**
* ⚙️ **Painel de Gestão (Dashboard):** Acesso restrito via Role-Based Access Control (RBAC).
* 📸 **Gestão de Produtos:** CRUD completo com **Upload Real de Imagens** (via Multer), salvando arquivos fisicamente no servidor.
* 📊 **Histórico de Vendas:** Visualização de todos os pedidos realizados na plataforma, com detalhes de clientes e itens comprados.

---

## 🛠️ Tecnologias e Práticas Utilizadas

### Backend (API REST)
* **Node.js & Express:** Roteamento e criação do servidor.
* **Sequelize (ORM):** Modelagem de dados e abstração do banco de dados.
* **Multer:** Gerenciamento de uploads de imagens em formulários `multipart/form-data`.
* **Segurança:** * Middlewares de autenticação (JWT).
  * Hashes de senha.

### Frontend
* **HTML5 & Vanilla JavaScript:** Lógica de interface sem dependência de frameworks pesados, focando em performance e manipulação de DOM nativa.
* **Tailwind CSS:** Estilização responsiva e moderna via CDN.
* **Segurança Frontend:**
  * Proteção rigorosa contra **XSS (Cross-Site Scripting)** usando funções de escape de HTML.
  * Implementação de cabeçalhos **CSP (Content-Security-Policy)**.

---

## 📂 Arquitetura do Projeto

O projeto segue a estrutura padrão MVC para manter o código limpo e escalável:

```text
/
├── src/
│   ├── config/        # Configurações (Banco de dados, Multer)
│   ├── controllers/   # Lógica de negócio (Auth, Produtos, Pedidos)
│   ├── middlewares/   # Validações, Auth JWT
│   ├── models/        # Modelos do Sequelize (Estrutura do Banco)
│   ├── routes/        # Rotas da API REST
│   └── server.js      # Ponto de entrada da aplicação
├── public/            # Frontend (HTML, CSS, JS)
│   ├── index.html     # Vitrine
│   ├── admin.html     # Painel Admin
│   ├── cart.html      # Carrinho
│   └── ...
├── uploads/           # Armazenamento de imagens (gerado automaticamente)
└── package.json       # Dependências do projeto
