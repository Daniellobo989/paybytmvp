# README - Sistema de Autenticação Anônima do PayByt

## Visão Geral

O Sistema de Autenticação Anônima do PayByt é uma solução avançada que permite aos usuários acessar o marketplace PayByt e realizar transações sem revelar suas informações pessoais. Este sistema utiliza tecnologias de ponta em criptografia e zero-knowledge proofs para garantir privacidade e segurança.

## Características Principais

- **Identidades Anônimas**: Crie e gerencie identidades digitais sem revelar informações pessoais
- **Zero-Knowledge Proofs**: Prove propriedade e autenticidade sem revelar dados sensíveis
- **Transações Privadas**: Realize transações com privacidade aprimorada
- **Integração com Escrow**: Sistema de escrow multisig totalmente integrado com autenticação anônima
- **Interface Intuitiva**: Experiência de usuário simplificada para operações complexas

## Estrutura do Projeto

```
paybyt-auth/
├── backend/             # Servidor Node.js/Express
│   ├── src/             # Código-fonte do backend
│   │   ├── api/         # APIs e endpoints
│   │   ├── core/        # Componentes principais
│   │   ├── crypto/      # Utilitários criptográficos
│   │   ├── zkp/         # Implementação de Zero-Knowledge Proofs
│   │   ├── routes/      # Rotas da API
│   │   └── services/    # Serviços de negócio
│   └── tests/           # Testes automatizados
├── frontend/            # Aplicação React/TypeScript
│   ├── src/             # Código-fonte do frontend
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas da aplicação
│   │   └── services/    # Serviços de comunicação com API
│   └── tests/           # Testes de interface
└── docs/                # Documentação
    ├── documentacao_tecnica.md  # Documentação técnica detalhada
    ├── manual_usuario.md        # Manual do usuário
    └── guia_instalacao.md       # Guia de instalação
```

## Documentação

O projeto inclui documentação abrangente:

- [Documentação Técnica](./docs/documentacao_tecnica.md): Arquitetura, fluxos, tecnologias e considerações de segurança
- [Manual do Usuário](./docs/manual_usuario.md): Instruções para utilização do sistema
- [Guia de Instalação](./docs/guia_instalacao.md): Instruções para instalar, configurar e executar o sistema

## Instalação Rápida

### Pré-requisitos

- Node.js (v16+)
- MongoDB (v4.4+)
- NPM (v8+)

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Daniellobo989/paybytmvp.git
cd paybytmvp/paybyt-auth
```

2. Instale as dependências:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paybyt-auth
JWT_SECRET=seu_jwt_secret_seguro
NODE_ENV=development
BITCOIN_NETWORK=testnet

# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
```

4. Inicie a aplicação:
```bash
# Backend
cd backend
npm run dev

# Frontend (em outro terminal)
cd frontend
npm run dev
```

Para instruções detalhadas, consulte o [Guia de Instalação](./docs/guia_instalacao.md).

## Tecnologias Utilizadas

### Backend
- Node.js e Express
- MongoDB
- Bibliotecas criptográficas (libsodium, bitcoinjs-lib, snarkjs)
- JWT para autenticação

### Frontend
- React com TypeScript
- Tailwind CSS
- Axios
- libsodium-wrappers

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Para suporte ou dúvidas, entre em contato através do formulário no site do PayByt.
