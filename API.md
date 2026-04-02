# 📡 Documentação da API - TechStore

Esta API foi construída seguindo os padrões RESTful. As requisições e respostas são feitas majoritariamente no formato JSON, com exceção das rotas que envolvem upload de arquivos, que utilizam `multipart/form-data`.

## 🔐 Autenticação
Base URL: `/api`

| Método | Rota | Descrição | Auth (JWT) | Body (Payload) |
|:---:|---|---|:---:|---|
| **POST** | `/login` | Autentica usuário e retorna Token | ❌ | `{ email, password }` |
| **POST** | `/register` | Cadastra novo usuário no sistema | ❌ | `{ name, email, password }` |

> **Nota sobre Segurança:** Para rotas protegidas, envie o token no header da requisição: 
> `Authorization: Bearer <seu_token_aqui>`

---

## 📦 Produtos
Base URL: `/api/products`

| Método | Rota | Descrição | Auth (JWT) | Formato Aceito |
|:---:|---|---|:---:|---|
| **GET** | `/` | Lista produtos. Suporta query `?category=` | ❌ | `N/A` |
| **POST** | `/` | Cadastra novo produto com upload de foto | ✅ *(Admin)* | `FormData` (multipart) |
| **PUT** | `/:id` | Atualiza dados e/ou imagem do produto | ✅ *(Admin)* | `FormData` (multipart) |
| **DELETE** | `/:id` | Remove o produto e sua imagem do servidor | ✅ *(Admin)* | `N/A` |

> **Detalhe do FormData (Criação/Atualização):**
> Campos esperados: `name` (String), `price` (Number), `stock` (Number), `category` (String) e `image` (File - opcional na atualização).

---

## 🛒 Pedidos (Orders)
Base URL: `/api`

| Método | Rota | Descrição | Auth (JWT) |
|:---:|---|---|:---:|
| **POST** | `/orders` | Cria um novo pedido (Checkout do carrinho) | ❌ |
| **GET** | `/orders` | Lista todo o histórico de vendas da loja | ✅ *(Admin)* |
| **GET** | `/my-orders` | Lista apenas os pedidos do usuário logado | ✅ *(Cliente)* |

> **Exemplo de Payload de Checkout (`POST /orders`):**
> ```json
> {
>   "customer": {
>     "name": "João Silva",
>     "email": "joao@email.com",
>     "phone": "11999999999",
>     "address": "Rua Exemplo, 123"
>   },
>   "items": [
>     { "id": 1, "name": "Teclado", "price": 150.00, "quantity": 1 }
>   ],
>   "total": 150.00
> }
> ```