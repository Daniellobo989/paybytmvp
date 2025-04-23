# README.md
# PayByt - Marketplace Descentralizado com Bitcoin

Este é o repositório do frontend do PayByt, um marketplace descentralizado que utiliza exclusivamente Bitcoin como meio de pagamento.

## Visão Geral

O PayByt foi projetado para oferecer um ambiente de comércio seguro, privado e resistente à censura, permitindo que compradores e vendedores realizem transações sem intermediários tradicionais.

## Funcionalidades Principais

- **Autenticação Anônima**: Sistema de registro e login que não requer informações pessoais identificáveis
- **Listagem de Produtos**: Interface para busca e visualização de produtos
- **Sistema de Escrow Multisig**: Implementação de contratos multisig 2-de-3 para segurança das transações
- **Integração com Bitcoin**: Suporte para transações on-chain e Lightning Network
- **Chat Criptografado**: Comunicação segura entre compradores e vendedores
- **Sistema de Resolução de Disputas**: Mediação imparcial quando necessário

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Vite
- React Router

## Instalação e Execução Local

1. Clone o repositório:
```bash
git clone https://github.com/Daniellobo989/paybytmvp.git
cd paybytmvp
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse o site em seu navegador:
```
http://localhost:5173/
```

## Deployment

Este projeto está configurado para ser implantado automaticamente no GitHub Pages. Quando você fizer push para a branch main, o GitHub Actions executará o workflow de deployment.

Para fazer o deployment manualmente:

```bash
npm run deploy
```

## Estrutura do Projeto

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

## Licença

© 2025 PayByt - Todos os direitos reservados
