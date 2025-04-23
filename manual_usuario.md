# Documentação do PayByt - Marketplace Descentralizado com Bitcoin

## Visão Geral

O PayByt é um marketplace descentralizado que utiliza exclusivamente Bitcoin como meio de pagamento. A plataforma foi projetada para oferecer um ambiente de comércio seguro, privado e resistente à censura, permitindo que compradores e vendedores realizem transações sem intermediários tradicionais.

Este documento fornece uma visão geral do sistema, instruções de instalação, guias de uso e informações técnicas para desenvolvedores.

## Índice

1. [Introdução](#introdução)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Guia do Usuário](#guia-do-usuário)
5. [Integração com Bitcoin](#integração-com-bitcoin)
6. [Segurança e Privacidade](#segurança-e-privacidade)
7. [API de Referência](#api-de-referência)
8. [Solução de Problemas](#solução-de-problemas)
9. [Roadmap Futuro](#roadmap-futuro)

## Introdução

O PayByt foi desenvolvido para resolver os problemas de privacidade, segurança e confiança encontrados em marketplaces tradicionais. Utilizando a tecnologia blockchain do Bitcoin e sistemas de escrow multisig, o PayByt elimina a necessidade de confiar em terceiros para garantir transações seguras.

### Principais Características

- **Pagamentos exclusivamente em Bitcoin**: Suporte para transações on-chain e Lightning Network
- **Sistema de escrow multisig 2-de-3**: Garantia de segurança para compradores e vendedores
- **Anonimato de usuários**: Não requer informações pessoais identificáveis
- **Chat criptografado**: Comunicação segura entre compradores e vendedores
- **Sistema de resolução de disputas**: Mediação imparcial quando necessário
- **Interface intuitiva**: Experiência de usuário simplificada

## Arquitetura do Sistema

O PayByt é construído com uma arquitetura moderna e modular, dividida em componentes de backend e frontend.

### Backend

- **Node.js com Express**: API RESTful para todas as funcionalidades do marketplace
- **MongoDB**: Armazenamento de dados de produtos, usuários e transações
- **Bitcoinjs-lib**: Integração com a rede Bitcoin para transações on-chain
- **LND (Lightning Network Daemon)**: Suporte para pagamentos instantâneos via Lightning Network
- **Sistema de escrow multisig**: Implementação de contratos multisig 2-de-3 para segurança das transações

### Frontend

- **React**: Biblioteca JavaScript para construção da interface do usuário
- **Tailwind CSS**: Framework CSS para design responsivo e moderno
- **React Router**: Navegação entre páginas da aplicação
- **Axios**: Cliente HTTP para comunicação com o backend
- **Componentes de integração Bitcoin**: Módulos para interação com carteiras Bitcoin

### Diagrama de Arquitetura

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Cliente (React) |<--->|  API (Node.js)   |<--->|  Banco de Dados  |
|                  |     |                  |     |   (MongoDB)      |
+------------------+     +------------------+     +------------------+
                               |
                               |
                               v
                        +------------------+
                        |                  |
                        |  Rede Bitcoin    |
                        |  (on-chain/LN)   |
                        |                  |
                        +------------------+
```

## Instalação e Configuração

### Requisitos do Sistema

- Node.js v14.0.0 ou superior
- MongoDB v4.4 ou superior
- NPM v6.0.0 ou superior
- Acesso a um nó Bitcoin (para ambiente de produção)
- Acesso a um nó Lightning Network (para ambiente de produção)

### Instalação do Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/prototipo-paybyt/paybyt.com.git
   cd paybyt/backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Inicie o servidor:
   ```bash
   npm run dev
   ```

### Instalação do Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd ../frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Guia do Usuário

### Registro e Autenticação

O PayByt utiliza um sistema de autenticação anônimo que não requer informações pessoais identificáveis. Para criar uma conta:

1. Acesse a página inicial do PayByt
2. Clique em "Registrar"
3. Crie um nome de usuário e senha
4. Gere um par de chaves criptográficas para seu perfil
5. Salve sua frase de recuperação em um local seguro

### Navegação e Busca de Produtos

A página inicial do PayByt apresenta produtos em destaque e categorias populares. Para encontrar produtos específicos:

1. Use a barra de busca no topo da página
2. Aplique filtros por categoria, preço ou avaliação
3. Ordene os resultados por relevância, preço ou data

### Compra de Produtos

Para comprar um produto no PayByt:

1. Selecione o produto desejado
2. Clique em "Comprar Agora" ou adicione ao carrinho
3. Revise os detalhes da compra e opções de envio
4. Prossiga para o checkout
5. Envie Bitcoin para o endereço de escrow multisig gerado
6. Aguarde a confirmação do pagamento
7. Comunique-se com o vendedor via chat criptografado

### Venda de Produtos

Para vender produtos no PayByt:

1. Acesse seu painel de usuário
2. Clique em "Vender Produto"
3. Preencha os detalhes do produto (título, descrição, preço, imagens)
4. Defina opções de envio
5. Publique o produto

### Sistema de Escrow

O PayByt utiliza um sistema de escrow multisig 2-de-3 para garantir a segurança das transações:

1. Quando uma compra é iniciada, um endereço multisig é gerado
2. O comprador envia Bitcoin para este endereço
3. O vendedor envia o produto ao comprador
4. Após receber o produto, o comprador libera os fundos para o vendedor
5. Em caso de disputa, um mediador pode intervir

### Resolução de Disputas

Se ocorrer algum problema com a transação:

1. Acesse a página de detalhes da transação
2. Clique em "Iniciar Disputa"
3. Descreva o problema e forneça evidências
4. Um mediador analisará o caso
5. O mediador decidirá se os fundos devem ser liberados para o vendedor ou devolvidos ao comprador

## Integração com Bitcoin

### Transações On-Chain

O PayByt suporta transações Bitcoin on-chain para pagamentos regulares:

- Geração de endereços multisig 2-de-3
- Verificação de transações na blockchain
- Liberação de fundos com assinaturas múltiplas
- Reembolso de fundos em caso de problemas

### Lightning Network

Para pagamentos instantâneos e de baixo valor, o PayByt integra com a Lightning Network:

- Geração de invoices Lightning
- Verificação de pagamentos em tempo real
- Taxas reduzidas para micropagamentos
- Liquidação instantânea

### Segurança de Chaves

O PayByt implementa as melhores práticas para segurança de chaves:

- Chaves privadas nunca são armazenadas no servidor
- Criptografia client-side para proteção de dados sensíveis
- Assinaturas de transações realizadas localmente no dispositivo do usuário
- Backup seguro de chaves com frases mnemônicas

## Segurança e Privacidade

### Anonimato de Usuários

O PayByt foi projetado para proteger a privacidade dos usuários:

- Não requer informações pessoais identificáveis
- Utiliza identificadores pseudônimos
- Não rastreia atividades dos usuários
- Não armazena histórico de navegação

### Criptografia de Mensagens

A comunicação entre usuários é protegida por criptografia de ponta a ponta:

- Chaves de criptografia geradas localmente
- Mensagens ilegíveis para terceiros, incluindo operadores do PayByt
- Verificação de integridade de mensagens
- Opção de mensagens autodestrutivas

### Proteção contra Ataques

O PayByt implementa diversas medidas para proteger contra ataques comuns:

- Proteção contra ataques de double-spending
- Verificação de múltiplas confirmações para transações de alto valor
- Proteção contra ataques de phishing
- Limitação de taxa de requisições para prevenir ataques DDoS

## API de Referência

O PayByt oferece uma API RESTful para desenvolvedores que desejam integrar com a plataforma:

### Autenticação

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

### Produtos

```
GET /api/products
GET /api/products/:id
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

### Transações

```
GET /api/transactions
GET /api/transactions/:id
POST /api/transactions
PUT /api/transactions/:id/release
PUT /api/transactions/:id/refund
POST /api/transactions/:id/dispute
```

### Bitcoin

```
POST /api/bitcoin/generate-address
POST /api/bitcoin/verify-payment
POST /api/lightning/generate-invoice
POST /api/lightning/check-payment
```

## Solução de Problemas

### Problemas Comuns

#### Pagamento não detectado

- Verifique se o pagamento foi enviado para o endereço correto
- Aguarde pelo menos 1 confirmação na rede Bitcoin
- Verifique se a taxa de mineração utilizada é adequada

#### Erro ao gerar endereço multisig

- Verifique sua conexão com a internet
- Certifique-se de que seu navegador está atualizado
- Tente limpar o cache do navegador e tentar novamente

#### Problemas de comunicação no chat

- Verifique se ambas as partes estão online
- Certifique-se de que as chaves de criptografia foram geradas corretamente
- Tente atualizar a página e reconectar

## Roadmap Futuro

O PayByt continuará evoluindo com novas funcionalidades e melhorias:

### Curto Prazo (3-6 meses)

- Suporte para mais idiomas
- Aplicativo móvel para Android e iOS
- Integração com carteiras de hardware
- Sistema de avaliações aprimorado

### Médio Prazo (6-12 meses)

- Marketplace descentralizado completo (armazenamento IPFS)
- Suporte para tokens coloridos e ativos digitais
- Sistema de reputação baseado em blockchain
- Integração com redes de segunda camada adicionais

### Longo Prazo (1-2 anos)

- Governança descentralizada da plataforma
- Implementação de contratos inteligentes avançados
- Interoperabilidade com outras blockchains
- Sistema de identidade soberana

---

© 2025 PayByt - Marketplace Descentralizado com Bitcoin
