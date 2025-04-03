# SWHosped - Sistema de Reservas para Hotéis e Pousadas com Angular 19 e NestJS 10



Bem-vindo ao **SWHosped**, um monorepo NX utilizando **Angular 19** e **NestJS 10** para gerenciamento de hospedagens!

## 🚀 Tecnologias Principais

- 🅰️ **Angular 19** - Framework frontend
- 🎨 **PrimeNG** - Biblioteca de componentes UI para Angular
- 🎨 **Tailwind**  - Biblioteca de componentes UI para Angular
- 🟢 **NestJS 10** - Framework backend baseado em Node.js
- 📦 **MikroORM** - ORM para TypeScript e Node.js
- 🛢️ **PostgreSQL** - Banco de dados relacional


- 🛠️ **NX** - Gerenciador de monorepos
- 🎭 **Jest** - Testes unitários
  

## 📦 Pré-requisitos
- Node.js 18+
- PostgreSQL 15+
- NPM 9+


## 📥 Como Clonar o Repositório

```sh
# Clonar o repositório
 git clone https://github.com/detonador31/swhosped.git

# Acessar a pasta do projeto
cd swhosped
```

---

## 📦 Instalar Dependências

```sh
npm install
```

---

## 🛠️ Configuração do Backend (NestJS 10)

### 1️⃣ Configurar o Banco de Dados PostgreSQL

Antes de iniciar, tenha um banco de dados **PostgreSQL** configurado.
Crie um banco de dados com o nome desejado.

### 2️⃣ Configurar MikroORM

Edite o arquivo `mikro-orm.config.ts` para incluir suas credenciais do banco:

```ts
export default {
  entities: ['./dist/**/*.entity.js'],
  dbName: 'seu_banco',
  type: 'postgresql',
  user: 'seu_usuario',
  password: 'sua_senha',
  host: 'localhost',
  port: 5432,
  migrations: {
    path: './migrations',
    pattern: /^[\w-]+\.js$/,
  },
};
```

### 3️⃣ Criar Banco de Dados com Migrações

```sh
npm run mikro-orm migration:create
```

```sh
npm run mikro-orm migration:up
```

### 4️⃣ Configurar CORS (main.ts)

No `main.ts`, adicione **allowedOrigins** para permitir conexões do frontend:

```ts
app.enableCors({
  origin: ['http://localhost:4200', 'https://www.swhosped-frontend.com.br'],
});
```

Essa configuração evita erros de **CORS** ao conectar com o frontend.

### 5️⃣ Iniciar o Servidor NestJS

```sh
npx nx serve backend
```

Testar API: [http://localhost:3000](http://localhost:3000)

---

## 🎨 Configuração do Frontend (Angular 19)

### 1️⃣ Configurar Backend no `environment.ts`

Edite o arquivo `/src/shared/environment.ts`:

```ts
export const environment = {
  devLocal: 'http://localhost:3000/',
  devNetwork: 'http://backend.nest.local/',
  production: 'https://www.swhosped-backend.com.br/',
};
```

### 2️⃣ Definir Ambiente no `backend.service.ts`

No arquivo `src/app/services/backend.service.ts`, escolha o ambiente:

```ts
const API_URL = environment.devLocal; // Ou devNetwork, production
```

### 3️⃣ Iniciar o Servidor Angular

```sh
npx nx serve frontend
```

Para acesso via rede local executar:
```sh
npx nx serve frontend --host=0.0.0.0 --port=4200
```

Acesse: [http://localhost:4200](http://localhost:4200)

---

## 🏡 Funcionalidades Principais

### 🏨 Cadastro de Acomodações
✅ Busca de endereço por **CEP**
✅ Busca automática de **coordenadas (latitude e longitude)**
✅ Upload de **imagens** com miniaturas e salvamento no backend
✅ Exibição de **mapa** na reserva da acomodação

### 🔒 Autenticação e Administração
✅ Área exclusiva para **administradores**
✅ Para testar um usuário administrador, altere seu tipo diretamente no **PostgreSQL**:

```sql
UPDATE users SET role = 'Administrador' WHERE email = 'teste@email.com';
```

---

## 🤝 Contribuindo
Sinta-se à vontade para abrir issues e pull requests! Qualquer dúvida, entre em contato.

📌 **Repositório:** [https://github.com/detonador31/swhosped](https://github.com/detonador31/swhosped)

---

Feito com por [@detonador31](https://github.com/detonador31) 🚀

