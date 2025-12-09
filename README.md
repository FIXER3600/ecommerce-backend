# 🛍️ Backend - Ecommerce

Este é o **Backend** do projeto de Ecommerce para a vaga de Pessoa Desenvolvedora JR da CapLink, responsável por fornecer as APIs para autenticação, gerenciamento de produtos, carrinho, pedidos, favoritos e dashboard do vendedor.  
Ele foi desenvolvido em **Node.js** com **Express** e utiliza **JWT** para autenticação.

---

## 🚀 Tecnologias utilizadas
- **Node.js**  
- **Express.js**  
- **TypeScript**  
- **JWT (JSON Web Token)** para autenticação  
- **Multer** (upload de arquivos CSV)  
- **PostgreSQL** 
- **bcrypt** para hash de senhas  

---

## 📂 Estrutura principal
- `auth/` → rotas de autenticação (`signin`, `signup`)  
- `products/` → criação de produtos e upload em massa via CSV  
- `cart/` → gerenciamento do carrinho (adicionar, remover, limpar, checkout)  
- `orders/` → pedidos do cliente e finalização de compra  
- `favorites/` → salvar e remover produtos favoritos  
- `seller/dashboard/` → resumo da loja com métricas e gráficos  

---

## ⚙️ Instalação e execução

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/ecommerce-backend.git
cd ecommerce-backend
```

### 2. Instalar dependências
```bash
npm install
# ou
yarn install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=3000
DATABASE_URL=postgres://user:password@localhost:5432/ecommerce
JWT_SECRET=seuSegredoAqui
```

### 4. Rodar em ambiente de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```

A API estará disponível em:  
👉 `http://localhost:3000`

---

## 🔑 Endpoints principais

### Autenticação
- `POST /auth/signup` → cadastro de usuário  
- `POST /auth/signin` → login e geração de token JWT  

### Produtos
- `POST /products` → criar produto  
- `POST /products/upload-csv` → upload de CSV para cadastro em massa  
- `GET /products` → listar produtos  

### Carrinho
- `GET /cart` → obter carrinho do usuário  
- `POST /cart/items/:productId` → adicionar item  
- `DELETE /cart/items/:productId` → remover item  
- `DELETE /cart/clear` → limpar carrinho  
- `POST /orders/checkout` → finalizar compra  

### Favoritos
- `GET /customer/favorites` → listar favoritos  
- `POST /customer/favorites/:productId` → adicionar favorito  
- `DELETE /customer/favorites/:favoriteId` → remover favorito  

### Dashboard do vendedor
- `GET /seller/dashboard` → métricas da loja (total vendido, receita, produtos, best seller)  

---

## 📦 Build para produção
```bash
npm run build
npm run start
```

---

## 🌐 Deploy
O backend está disponível em produção através do Render:  
👉 [ecommerce-backend-qfb6.onrender.com](https://ecommerce-backend-qfb6.onrender.com)

## 📖 Documentação da API
A documentação completa dos endpoints está disponível no Postman:  
👉 [Documentação da API](https://documenter.getpostman.com/view/44513432/2sB3dQv9VA)

