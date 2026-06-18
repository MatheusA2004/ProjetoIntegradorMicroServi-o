<div align="center">

# 🍽️ Microsserviço de Usuários

**API REST para gerenciamento de usuários, autenticação e controle de acesso por papéis (RBAC)**

Parte de um sistema de delivery/restaurante · Projeto Integrador

<br>

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-4.28-000000?style=flat&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat&logo=docker&logoColor=white)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar](#-como-rodar)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [Banco de dados](#-banco-de-dados)
- [Documentação da API](#-documentação-da-api)
- [Endpoints](#-endpoints)
- [Exemplos de requisições](#-exemplos-de-requisições)
- [Autenticação e papéis](#-autenticação-e-papéis)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Roadmap](#-roadmap)
- [Autor](#-autor)

---

## 📖 Sobre o projeto

Este é um **microsserviço** responsável exclusivamente pelo domínio de **usuários** dentro de um sistema maior (delivery/restaurante). Ele cuida de cadastro, login, emissão de tokens **JWT** e administração de usuários, expondo uma **API REST** documentada via Swagger.

A ideia central de microsserviço é que cada serviço cuida de um pedaço do negócio de forma independente e se comunica por HTTP — em vez de um sistema monolítico que faz tudo. Este serviço roda isolado na porta **`3002`**.

---

## ✨ Funcionalidades

- ✅ Cadastro de usuário com validação de dados (CPF, e-mail, senha)
- ✅ Cadastro opcional de endereço junto ao usuário (relação 1:N)
- ✅ Login com geração de **token JWT**
- ✅ Senhas protegidas com **hash bcrypt** (nunca salvas em texto puro)
- ✅ Rota de perfil do usuário autenticado (`/me`)
- ✅ Controle de acesso por papéis — **RBAC** (`USER`, `ADMIN`, `RESTAURANTE`)
- ✅ Rotas administrativas (listar usuários, alterar papel)
- ✅ Documentação interativa automática (**Swagger UI**)
- ✅ Containerização completa com **Docker**

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Para quê serve |
|-----------|-----------|----------------|
| Linguagem | **TypeScript** | Tipagem estática sobre o JavaScript |
| Framework | **Fastify** | Servidor HTTP focado em performance |
| ORM | **Prisma** | Acesso ao banco com tipagem automática |
| Banco | **MySQL** | Persistência relacional dos dados |
| Validação | **Zod** | Validação de schemas de entrada/saída |
| Autenticação | **@fastify/jwt** | Geração e verificação de tokens JWT |
| Criptografia | **bcrypt** | Hash seguro de senhas |
| Documentação | **@fastify/swagger** | Documentação OpenAPI automática |
| Proteção | **@fastify/cors** · **@fastify/rate-limit** | CORS e limite de requisições |
| Infra | **Docker** · **docker-compose** | Empacotamento e execução |

---

## 🏗️ Arquitetura

O projeto segue uma **arquitetura em camadas** com separação de responsabilidades. Cada requisição percorre o seguinte fluxo:

```mermaid
flowchart TD
    A[Cliente HTTP] --> B[Rota + validação Zod]
    B --> C[Middleware: autenticação JWT + role]
    C --> D[Controller]
    D --> E[Service: regra de negócio + bcrypt]
    E --> F[Prisma ORM]
    F --> G[(Banco MySQL)]
    E -. resposta passa pelo Mapper .-> D
```

| Camada | Responsabilidade |
|--------|------------------|
| **Routes** | Define endpoints, schemas e middlewares de cada rota |
| **Middleware** | Valida o token e a permissão antes do controller |
| **Controller** | Orquestra a requisição e monta a resposta HTTP |
| **Service** | Concentra a lógica de negócio (regras, hash, validações) |
| **Mapper** | Formata a resposta e **remove dados sensíveis** (ex: senha) |

> Na volta, a resposta sobe pelas mesmas camadas e passa pelo **Mapper**, garantindo que a senha nunca seja exposta na API.

---

## 📂 Estrutura de pastas

```
.
├── prisma/
│   ├── schema.prisma          # Modelagem do banco (usuario, endereco, token)
│   └── seed.ts                # Cria o usuário ADMIN inicial
├── src/
│   ├── app.ts                 # Configuração do Fastify, Swagger, CORS e plugins
│   ├── server.ts              # Sobe o servidor na porta 3002
│   ├── config/
│   │   └── prisma.ts          # Instância do Prisma Client
│   ├── plugins/
│   │   └── jwt.ts             # Registro do plugin JWT
│   ├── modules/
│   │   └── user/
│   │       ├── routes/        # Definição das rotas
│   │       ├── controllers/   # Camada de orquestração
│   │       ├── service/       # Regra de negócio
│   │       ├── middleware/    # authenticate + authorizeAdmin
│   │       ├── schema/        # Schemas Zod de validação
│   │       └── user.mapper.ts # Formatação da resposta
│   └── types/
│       └── fastify.d.ts       # Tipagem do payload do JWT
├── Dockerfile                 # Build multi-stage
├── docker-compose.yml         # Orquestração do serviço
├── env.example                # Modelo das variáveis de ambiente
└── package.json
```

---

## ✅ Pré-requisitos

Para rodar **com Docker** (recomendado):

- [Docker](https://www.docker.com/) e Docker Compose

Para rodar **localmente** (sem Docker):

- [Node.js](https://nodejs.org/) 20+
- [MySQL](https://www.mysql.com/) 8+ em execução

---

## 🚀 Como rodar

### Opção 1 — Com Docker (recomendado)

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd ProjetoIntegradorMicroServico

# 2. Suba o container
docker compose up --build
```

O serviço ficará disponível em **`http://localhost:3002`**.

> As variáveis de ambiente já estão definidas no `docker-compose.yml`.

### Opção 2 — Localmente

```bash
# 1. Instale as dependências
npm install

# 2. Crie o arquivo .env a partir do modelo
cp env.example .env
# edite o .env com a sua DATABASE_URL e um JWT_SECRET

# 3. Gere o Prisma Client e rode as migrações
npm run prisma:generate
npm run prisma:migrate

# 4. (Opcional) Crie o usuário admin inicial
npx prisma db seed

# 5. Inicie em modo desenvolvimento
npm run dev
```

---

## 🔑 Variáveis de ambiente

Copie o arquivo `env.example` para `.env`:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão com o MySQL | `mysql://user:senha@localhost:3306/meu_banco` |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT | um valor longo e aleatório |

> ⚠️ Nunca versione o `.env` com segredos reais. Em produção, use variáveis de ambiente do servidor ou um cofre de segredos.

---

## 🗄️ Banco de dados

A modelagem fica em `prisma/schema.prisma` e contém três entidades:

- **`usuario`** — entidade central. Campos únicos em `email`, `cpf` e `cnpj`; senha armazenada com hash; papel (`role`) com padrão `USER`. Suporta também pessoa jurídica (`cnpj`, `razao_social`, `nome_fantasia`).
- **`endereco`** — relação **1:N** com `usuario` (`onDelete: Cascade`).
- **`tokenrecuperacao`** — preparada para o fluxo de recuperação de senha (token único, expiração e flag de uso).

### Seed (usuário admin inicial)

O comando de seed cria um administrador para testes:

```bash
npx prisma db seed
```

| Campo | Valor |
|-------|-------|
| E-mail | `admin@admin.com` |
| Senha | `admin123` |
| Papel | `ADMIN` |

---

## 📚 Documentação da API

Com o servidor rodando, acesse a documentação interativa (Swagger UI):

```
http://localhost:3002/docs
```

A documentação é gerada **automaticamente a partir dos schemas Zod**, então fica sempre sincronizada com o código. É possível testar todos os endpoints diretamente pela interface.

---

## 🔗 Endpoints

Todas as rotas têm o prefixo **`/users`**.

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/users/register` | 🌐 Público | Cadastrar novo usuário |
| `POST` | `/users/login` | 🌐 Público | Autenticar e receber um token JWT |
| `GET` | `/users/me` | 🔒 Autenticado | Dados do usuário logado |
| `GET` | `/users` | 👑 Admin | Listar todos os usuários |
| `PATCH` | `/users/:id/role` | 👑 Admin | Alterar o papel de um usuário |

---

## 📨 Exemplos de requisições

### Cadastrar usuário

```bash
curl -X POST http://localhost:3002/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "cpf": "12345678901",
    "email": "maria@email.com",
    "telefone": "21999998888",
    "senha": "senha123",
    "endereco": {
      "rua": "Rua das Flores",
      "numero": "100",
      "bairro": "Centro",
      "cidade": "Rio de Janeiro",
      "cep": "20000000",
      "complemento": "Apto 201"
    }
  }'
```

> O campo `endereco` é opcional. Regras de validação: `nome` ≥ 3 caracteres, `cpf` com 11 dígitos, `email` válido e `senha` ≥ 6 caracteres.

### Login

```bash
curl -X POST http://localhost:3002/users/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@admin.com", "senha": "admin123" }'
```

Resposta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "nome": "Administrador", "role": "ADMIN" }
}
```

### Acessar rota protegida

Envie o token no cabeçalho `Authorization`:

```bash
curl http://localhost:3002/users/me \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

---

## 🔐 Autenticação e papéis

O fluxo separa dois conceitos:

- **Autenticação** ("quem é você?") — no login, e-mail e senha são conferidos. Se válidos, é gerado um **token JWT** assinado contendo `id`, `email` e `role`. O cliente envia esse token em cada requisição no header `Authorization: Bearer <token>`.
- **Autorização** ("o que você pode fazer?") — feita por **RBAC**. O middleware `authenticate` valida o token; o `authorizeAdmin` garante que apenas administradores acessem rotas sensíveis.

| Papel | Permissões |
|-------|-----------|
| `USER` | Acessar o próprio perfil (`/me`) |
| `ADMIN` | Listar todos os usuários e alterar papéis |
| `RESTAURANTE` | Papel reservado para estabelecimentos (em evolução) |

---

## 📜 Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe o servidor em modo desenvolvimento (hot reload) |
| `npm run build` | Compila o TypeScript para a pasta `dist` |
| `npm start` | Executa a versão compilada |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Aplica migrações em desenvolvimento |
| `npm run prisma:deploy` | Aplica migrações em produção |
| `npm run lint` | Verifica o código com ESLint |
| `npm run format` | Formata o código com Prettier |

---

## 🗺️ Roadmap

- [ ] Implementar o fluxo completo de **recuperação de senha** (tabela `tokenrecuperacao` já modelada)
- [ ] Criar rotas próprias para o papel **`RESTAURANTE`**
- [ ] Adicionar **testes automatizados** (unitários e de integração)
- [ ] Centralizar o **tratamento de erros** (`utils/erros.ts`)
- [ ] Mover segredos do `docker-compose.yml` para variáveis de ambiente seguras

---

## 👤 Autor

Desenvolvido como **Projeto Integrador**.

<div align="center">

⭐ Se este projeto foi útil, deixe uma estrela!

</div>
