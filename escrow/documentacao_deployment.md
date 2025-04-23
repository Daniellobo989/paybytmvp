# Documentação do Processo de Deployment do PayByt no GitHub Pages

Este documento descreve o processo completo de deployment do site PayByt no GitHub Pages, desde a preparação do projeto até a implantação final.

## Índice

1. [Visão Geral](#visão-geral)
2. [Preparação do Frontend](#preparação-do-frontend)
3. [Configuração do GitHub Pages](#configuração-do-github-pages)
4. [Processo de Deployment](#processo-de-deployment)
5. [Manutenção e Atualizações](#manutenção-e-atualizações)

## Visão Geral

O PayByt é um marketplace descentralizado baseado em Bitcoin, desenvolvido como uma aplicação React com Vite e Tailwind CSS. Para disponibilizar o site publicamente, utilizamos o GitHub Pages como plataforma de hospedagem, que oferece:

- Hospedagem gratuita para sites estáticos
- Integração direta com repositórios GitHub
- Deployment automatizado via GitHub Actions
- HTTPS gratuito
- Alta disponibilidade

## Preparação do Frontend

### Reorganização da Estrutura do Projeto

O projeto original tinha todos os arquivos no diretório raiz, sem seguir a estrutura padrão de um projeto React/Vite. Foi necessário reorganizar a estrutura para:

```
paybytmvp/
├── public/              # Arquivos estáticos
├── src/                 # Código-fonte
│   ├── components/      # Componentes React
│   │   ├── bitcoin/     # Componentes relacionados ao Bitcoin
│   │   ├── layout/      # Componentes de layout (Navbar, Footer)
│   │   └── pages/       # Páginas da aplicação
│   ├── App.tsx          # Componente principal com rotas
│   ├── main.tsx         # Ponto de entrada da aplicação
│   └── index.css        # Estilos globais e Tailwind
├── index.html           # HTML principal
├── vite.config.js       # Configuração do Vite
├── tailwind.config.js   # Configuração do Tailwind CSS
└── package.json         # Dependências e scripts
```

### Configurações Específicas para GitHub Pages

Para que a aplicação React funcione corretamente no GitHub Pages, foram necessárias as seguintes configurações:

1. **Configuração do React Router**:
   ```jsx
   // src/App.tsx
   <Router basename="/paybytmvp">
     {/* Rotas da aplicação */}
   </Router>
   ```

2. **Configuração do Vite**:
   ```js
   // vite.config.js
   export default defineConfig({
     plugins: [react()],
     base: '/paybytmvp/',
     // outras configurações
   })
   ```

3. **Configuração do package.json**:
   ```json
   {
     "name": "paybyt-frontend",
     "private": true,
     "version": "0.1.0",
     "homepage": "https://daniellobo989.github.io/paybytmvp",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     // outras configurações
   }
   ```

## Configuração do GitHub Pages

### Workflow de GitHub Actions

Para automatizar o processo de deployment, foi criado um workflow do GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

Este workflow é acionado automaticamente quando há um push para a branch main. Ele realiza as seguintes etapas:
1. Faz checkout do código
2. Configura o ambiente Node.js
3. Instala as dependências
4. Compila o projeto
5. Implanta os arquivos de build na branch gh-pages

### Configuração do Repositório GitHub

Para que o GitHub Pages funcione corretamente, é necessário:

1. Ter um repositório público ou privado (com GitHub Pro)
2. Configurar o GitHub Pages nas configurações do repositório para usar a branch gh-pages
3. Garantir que o usuário tenha permissões de escrita no repositório

## Processo de Deployment

O processo de deployment completo consiste nas seguintes etapas:

1. **Preparação do código**:
   - Reorganização da estrutura do projeto
   - Configuração dos arquivos para GitHub Pages
   - Criação do workflow de GitHub Actions

2. **Upload para o GitHub**:
   ```bash
   git init
   git remote add origin https://github.com/Daniellobo989/paybytmvp.git
   git add .
   git commit -m "Reorganização do projeto para deployment no GitHub Pages"
   git push -f origin main
   ```

3. **Execução automática do workflow**:
   - O GitHub Actions detecta o push para a branch main
   - Executa o workflow definido em .github/workflows/deploy.yml
   - Compila o projeto e implanta na branch gh-pages

4. **Ativação do GitHub Pages**:
   - O GitHub detecta alterações na branch gh-pages
   - Atualiza o site hospedado no GitHub Pages
   - O site fica disponível em https://daniellobo989.github.io/paybytmvp/

## Manutenção e Atualizações

Para manter e atualizar o site após o deployment inicial:

1. **Fazer alterações localmente**:
   - Editar os arquivos necessários
   - Testar localmente com `npm run dev`

2. **Enviar atualizações para o GitHub**:
   ```bash
   git add .
   git commit -m "Descrição das alterações"
   git push origin main
   ```

3. **Verificar o deployment**:
   - Acompanhar o progresso do workflow no GitHub Actions
   - Verificar se as alterações foram aplicadas no site

4. **Solução de problemas**:
   - Se o deployment falhar, verificar os logs do GitHub Actions
   - Corrigir os problemas e fazer um novo push

### Dicas para Atualizações

- Sempre teste as alterações localmente antes de fazer push
- Verifique o console do navegador para erros após o deployment
- Mantenha as dependências atualizadas regularmente
- Faça commits pequenos e frequentes para facilitar a identificação de problemas

---

Este documento foi criado para auxiliar no processo de deployment do site PayByt no GitHub Pages. Para mais informações sobre verificação e teste do site após o deployment, consulte o [Guia de Verificação e Teste](guia_verificacao_teste.md).
