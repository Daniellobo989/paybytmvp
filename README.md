# PayByt - Marketplace Descentralizado com Bitcoin

## Resumo do Projeto

O PayByt é um marketplace descentralizado que utiliza exclusivamente Bitcoin como meio de pagamento. A plataforma foi projetada para oferecer um ambiente de comércio seguro, privado e resistente à censura, permitindo que compradores e vendedores realizem transações sem intermediários tradicionais.

## Estrutura do Projeto

```
paybyt/
├── backend/               # API e serviços do backend
│   ├── src/
│   │   ├── config/        # Configurações do servidor
│   │   ├── controllers/   # Controladores da API
│   │   ├── middleware/    # Middleware do Express
│   │   ├── models/        # Modelos de dados MongoDB
│   │   ├── routes/        # Rotas da API
│   │   ├── services/      # Serviços de negócios
│   │   │   ├── bitcoinService.js
│   │   │   ├── escrowService.js
│   │   │   └── lightningService.js
│   │   ├── utils/         # Utilitários
│   │   └── server.js      # Ponto de entrada do servidor
│   ├── .env               # Variáveis de ambiente
│   └── package.json       # Dependências do backend
│
├── frontend/              # Interface do usuário React
│   ├── src/
│   │   ├── assets/        # Recursos estáticos
│   │   ├── components/    # Componentes React
│   │   │   ├── bitcoin/   # Componentes de integração Bitcoin
│   │   │   ├── layout/    # Componentes de layout
│   │   │   └── pages/     # Páginas da aplicação
│   │   ├── context/       # Contextos React
│   │   ├── services/      # Serviços de API
│   │   └── utils/         # Utilitários
│   └── package.json       # Dependências do frontend
│
├── docs/                  # Documentação
│   ├── manual_usuario.md  # Manual do usuário
│   ├── documentacao_tecnica.md # Documentação técnica
│   └── guia_instalacao.md # Guia de instalação
│
└── research/              # Pesquisa e análise
    ├── bitcoin_technologies.md
    ├── security_privacy.md
    └── system_architecture.md
```

## Principais Funcionalidades

- **Autenticação Anônima**: Sistema de registro e login que não requer informações pessoais identificáveis
- **Listagem de Produtos**: Interface para busca e visualização de produtos
- **Sistema de Escrow Multisig**: Implementação de contratos multisig 2-de-3 para segurança das transações
- **Integração com Bitcoin**: Suporte para transações on-chain e Lightning Network
- **Chat Criptografado**: Comunicação segura entre compradores e vendedores
- **Sistema de Resolução de Disputas**: Mediação imparcial quando necessário

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- MongoDB
- Bitcoinjs-lib para integração com Bitcoin
- JWT para autenticação

### Frontend
- React
- Tailwind CSS
- React Router
- Axios

## Documentação

A documentação completa do projeto está disponível na pasta `docs/`:

- **Manual do Usuário**: Guia completo para usuários do marketplace
- **Documentação Técnica**: Detalhes técnicos para desenvolvedores
- **Guia de Instalação**: Instruções passo a passo para instalação e configuração

## Próximos Passos

- Implementação de testes automatizados adicionais
- Integração com carteiras de hardware
- Suporte para mais idiomas
- Aplicativo móvel para Android e iOS

## Licença

© 2025 PayByt - Todos os direitos reservados
