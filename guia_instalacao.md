# Guia de Instalação e Integração do PayByt

Este guia fornece instruções passo a passo para instalar, configurar e integrar o PayByt ao seu projeto existente. Siga estas instruções para implementar o marketplace descentralizado baseado em Bitcoin.

## Índice

1. [Requisitos do Sistema](#requisitos-do-sistema)
2. [Instalação do Backend](#instalação-do-backend)
3. [Instalação do Frontend](#instalação-do-frontend)
4. [Configuração do Ambiente](#configuração-do-ambiente)
5. [Integração com GitHub](#integração-com-github)
6. [Testes e Verificação](#testes-e-verificação)
7. [Deployment](#deployment)
8. [Solução de Problemas](#solução-de-problemas)

## Requisitos do Sistema

Antes de começar, certifique-se de que seu sistema atende aos seguintes requisitos:

- **Node.js**: v14.0.0 ou superior
- **NPM**: v6.0.0 ou superior
- **MongoDB**: v4.4 ou superior (para ambiente de produção)
- **Git**: Qualquer versão recente

Você pode verificar as versões instaladas com os seguintes comandos:

```bash
node -v
npm -v
git --version
```

## Instalação do Backend

### Passo 1: Clonar o Repositório

```bash
# Crie uma pasta para o projeto
mkdir -p /caminho/para/seu/projeto
cd /caminho/para/seu/projeto

# Clone o repositório do backend
git clone https://github.com/seu-usuario/seu-repositorio.git .
# OU se estiver começando do zero
mkdir -p backend
cd backend
```

### Passo 2: Copiar os Arquivos do Backend

Copie todos os arquivos do backend do PayByt para o diretório do seu projeto:

```bash
# Se você recebeu os arquivos em um pacote
cp -r /caminho/para/paybyt_package/backend/* /caminho/para/seu/projeto/backend/
```

### Passo 3: Instalar Dependências

```bash
cd /caminho/para/seu/projeto/backend
npm install
```

### Passo 4: Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env com suas configurações
# Você precisará definir:
# - MONGODB_URI: URI de conexão com o MongoDB
# - JWT_SECRET: Chave secreta para tokens JWT
# - PORT: Porta para o servidor (padrão: 3000)
# - MEDIATOR_MASTER_KEY: Chave mestra para o mediador do escrow
```

## Instalação do Frontend

### Passo 1: Preparar o Diretório do Frontend

```bash
# Se você estiver no diretório do backend
cd ..
mkdir -p frontend
cd frontend
```

### Passo 2: Copiar os Arquivos do Frontend

Copie todos os arquivos do frontend do PayByt para o diretório do seu projeto:

```bash
# Se você recebeu os arquivos em um pacote
cp -r /caminho/para/paybyt_package/frontend/* /caminho/para/seu/projeto/frontend/
```

### Passo 3: Instalar Dependências

```bash
cd /caminho/para/seu/projeto/frontend
npm install
```

### Passo 4: Configurar Variáveis de Ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env com suas configurações
# Você precisará definir:
# - REACT_APP_API_URL: URL da API do backend (ex: http://localhost:3000/api)
```

## Configuração do Ambiente

### Configuração do MongoDB

Para ambiente de desenvolvimento, você pode usar o MongoDB localmente:

```bash
# Instalar MongoDB (Ubuntu)
sudo apt update
sudo apt install -y mongodb

# Iniciar o serviço
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verificar status
sudo systemctl status mongodb
```

Para ambiente de produção, recomendamos usar MongoDB Atlas ou um serviço gerenciado similar.

### Configuração do Bitcoin (para ambiente de produção)

Para integração real com Bitcoin, você precisará:

1. Acesso a um nó Bitcoin completo
2. Acesso a um nó Lightning Network (LND, c-lightning, etc.)
3. Configurar as variáveis de ambiente relacionadas no arquivo `.env`

## Integração com GitHub

Para integrar o projeto ao GitHub, siga estes passos:

### Passo 1: Criar um Novo Repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em "New" para criar um novo repositório
3. Dê um nome ao repositório (ex: "paybyt-marketplace")
4. Escolha se o repositório será público ou privado
5. Não inicialize o repositório com README, .gitignore ou licença
6. Clique em "Create repository"

### Passo 2: Inicializar o Repositório Local

```bash
# Navegue até a pasta raiz do projeto
cd /caminho/para/seu/projeto

# Inicialize o repositório Git
git init

# Adicione os arquivos ao staging
git add .

# Faça o primeiro commit
git commit -m "Implementação inicial do PayByt"
```

### Passo 3: Conectar e Enviar para o GitHub

```bash
# Adicione o repositório remoto
git remote add origin https://github.com/seu-usuario/paybyt-marketplace.git

# Envie o código para o GitHub
git push -u origin master
```

### Passo 4: Configurar .gitignore

Certifique-se de que seu arquivo `.gitignore` inclui:

```
# Dependências
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Ambiente
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Compilados
/build
/dist

# Logs
logs
*.log

# Sistema operacional
.DS_Store
Thumbs.db
```

## Testes e Verificação

### Executar o Backend

```bash
# Navegue até a pasta do backend
cd /caminho/para/seu/projeto/backend

# Inicie o servidor em modo de desenvolvimento
npm run dev

# OU em modo de produção
npm start
```

O servidor deve iniciar na porta especificada no arquivo `.env` (padrão: 3000).

### Executar o Frontend

```bash
# Navegue até a pasta do frontend
cd /caminho/para/seu/projeto/frontend

# Inicie o servidor de desenvolvimento
npm start
```

O frontend deve iniciar e abrir automaticamente no seu navegador (geralmente em http://localhost:3000).

### Executar Testes

```bash
# Testes do backend
cd /caminho/para/seu/projeto/backend
npm test

# Testes do frontend
cd /caminho/para/seu/projeto/frontend
npm test
```

## Deployment

### Opção 1: Deployment Manual

#### Backend

```bash
# Navegue até a pasta do backend
cd /caminho/para/seu/projeto/backend

# Instale apenas dependências de produção
npm ci --only=production

# Inicie o servidor
NODE_ENV=production npm start
```

#### Frontend

```bash
# Navegue até a pasta do frontend
cd /caminho/para/seu/projeto/frontend

# Crie a build de produção
npm run build

# O resultado estará na pasta 'build', que pode ser servida por qualquer servidor web
```

### Opção 2: Deployment com Docker

Se você tiver Docker instalado, pode usar o Docker Compose para deployment:

```bash
# Navegue até a pasta raiz do projeto
cd /caminho/para/seu/projeto

# Inicie os containers
docker-compose up -d

# Para parar os containers
docker-compose down
```

### Opção 3: Deployment em Serviços de Hospedagem

O PayByt pode ser hospedado em vários serviços:

- **Backend**: Heroku, AWS Elastic Beanstalk, Google App Engine, DigitalOcean
- **Frontend**: Netlify, Vercel, GitHub Pages, AWS S3 + CloudFront
- **Banco de Dados**: MongoDB Atlas, AWS DocumentDB, Azure Cosmos DB

## Solução de Problemas

### Problemas Comuns e Soluções

#### Erro de Conexão com MongoDB

**Problema**: O backend não consegue se conectar ao MongoDB.

**Solução**:
1. Verifique se o MongoDB está em execução
2. Verifique a string de conexão no arquivo `.env`
3. Certifique-se de que as credenciais estão corretas
4. Verifique se o IP do seu servidor está na lista de IPs permitidos (se usando MongoDB Atlas)

```bash
# Verificar status do MongoDB
sudo systemctl status mongodb

# Testar conexão manualmente
mongo "sua-string-de-conexao"
```

#### Erro de CORS no Frontend

**Problema**: O frontend não consegue se comunicar com o backend devido a erros de CORS.

**Solução**:
1. Verifique se o backend está configurado para permitir requisições do domínio do frontend
2. Adicione o domínio do frontend à lista de origens permitidas no backend

```javascript
// No arquivo server.js do backend
app.use(cors({
  origin: ['http://localhost:3000', 'https://seu-dominio.com']
}));
```

#### Erro ao Iniciar o Frontend

**Problema**: O frontend não inicia ou apresenta erros de compilação.

**Solução**:
1. Verifique se todas as dependências foram instaladas
2. Limpe o cache do npm
3. Verifique se há erros de sintaxe no código

```bash
# Reinstalar dependências
rm -rf node_modules
npm cache clean --force
npm install

# Verificar por erros de lint
npm run lint
```

### Obter Ajuda Adicional

Se você encontrar problemas que não estão cobertos neste guia:

1. Consulte a [documentação técnica completa](/home/ubuntu/paybyt/docs/documentacao_tecnica.md)
2. Consulte o [manual do usuário](/home/ubuntu/paybyt/docs/manual_usuario.md)
3. Abra uma issue no repositório GitHub do projeto
4. Entre em contato com a equipe de suporte do PayByt

---

© 2025 PayByt - Marketplace Descentralizado com Bitcoin
