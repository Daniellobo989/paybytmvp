# Documentação Técnica do PayByt

## Visão Geral Técnica

Este documento fornece informações técnicas detalhadas sobre a implementação do PayByt, um marketplace descentralizado que utiliza exclusivamente Bitcoin como meio de pagamento. Esta documentação é destinada a desenvolvedores que desejam entender a arquitetura do sistema, contribuir com o código ou integrar seus serviços com o PayByt.

## Índice

1. [Arquitetura Técnica](#arquitetura-técnica)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Modelos de Dados](#modelos-de-dados)
5. [API RESTful](#api-restful)
6. [Integração Bitcoin](#integração-bitcoin)
7. [Sistema de Escrow Multisig](#sistema-de-escrow-multisig)
8. [Segurança e Criptografia](#segurança-e-criptografia)
9. [Testes](#testes)
10. [Deployment](#deployment)

## Arquitetura Técnica

O PayByt segue uma arquitetura de microsserviços, com separação clara entre frontend e backend. A comunicação entre os componentes é realizada através de APIs RESTful, e a integração com a rede Bitcoin é feita através de serviços especializados.

### Diagrama de Componentes

```
+-------------------+      +-------------------+      +-------------------+
|                   |      |                   |      |                   |
|  Frontend (React) |<---->|  Backend (Node.js)|<---->| Banco de Dados    |
|                   |      |                   |      | (MongoDB)         |
+-------------------+      +-------------------+      +-------------------+
                                    ^
                                    |
                                    v
+-------------------+      +-------------------+      +-------------------+
|                   |      |                   |      |                   |
| Serviço Bitcoin   |<---->| Serviço Lightning |<---->| Serviço de Escrow |
| (bitcoinjs-lib)   |      | (LND)             |      | (Multisig)        |
|                   |      |                   |      |                   |
+-------------------+      +-------------------+      +-------------------+
```

### Fluxo de Dados

1. O usuário interage com a interface React no frontend
2. As requisições são enviadas para a API Node.js no backend
3. O backend processa as requisições e interage com o banco de dados MongoDB
4. Para operações relacionadas a Bitcoin, o backend se comunica com os serviços especializados
5. Os resultados são retornados ao frontend para exibição ao usuário

## Stack Tecnológico

### Frontend

- **React**: Biblioteca JavaScript para construção da interface do usuário
- **TypeScript**: Superset tipado de JavaScript para maior segurança e produtividade
- **Tailwind CSS**: Framework CSS para design responsivo e moderno
- **React Router**: Navegação entre páginas da aplicação
- **Axios**: Cliente HTTP para comunicação com o backend
- **Context API**: Gerenciamento de estado global da aplicação

### Backend

- **Node.js**: Ambiente de execução JavaScript do lado do servidor
- **Express**: Framework web para criação de APIs RESTful
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **MongoDB**: Banco de dados NoSQL para armazenamento de dados
- **Mongoose**: ODM (Object Document Mapper) para MongoDB
- **JWT**: JSON Web Tokens para autenticação e autorização
- **bcrypt**: Biblioteca para hash de senhas
- **Winston**: Sistema de logging

### Integração Bitcoin

- **bitcoinjs-lib**: Biblioteca JavaScript para interação com a rede Bitcoin
- **lightning**: Cliente JavaScript para interação com nós Lightning Network
- **ecpair**: Biblioteca para geração e gerenciamento de pares de chaves ECDSA
- **bip32**: Implementação de Hierarchical Deterministic Wallets (HD Wallets)
- **bip39**: Implementação de frases mnemônicas para backup de chaves

## Estrutura do Projeto

### Frontend

```
frontend/
├── public/
│   ├── index.html
│   └── assets/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   ├── pages/
│   │   └── bitcoin/
│   ├── context/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

### Backend

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── bitcoinService.js
│   │   ├── escrowService.js
│   │   └── lightningService.js
│   ├── utils/
│   └── server.js
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## Modelos de Dados

### Usuário

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password_hash: {
    type: String,
    required: true
  },
  email_hash: {
    type: String,
    required: true,
    unique: true
  },
  public_key: {
    type: String,
    required: true
  },
  reputation: {
    rating: {
      type: Number,
      default: 0
    },
    total_transactions: {
      type: Number,
      default: 0
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date
  }
});
```

### Produto

```javascript
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ['BTC', 'SATS'],
      default: 'SATS'
    }
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shipping_options: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    estimated_days: {
      type: String,
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});
```

### Transação

```javascript
const transactionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  escrow: {
    address: {
      type: String,
      required: true
    },
    redeem_script: {
      type: String,
      required: true
    },
    buyer_pubkey: {
      type: String,
      required: true
    },
    seller_pubkey: {
      type: String,
      required: true
    },
    mediator_pubkey: {
      type: String,
      required: true
    }
  },
  amount: {
    type: Number,
    required: true
  },
  shipping_option: {
    type: String,
    required: true
  },
  shipping_address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'funded', 'shipped', 'completed', 'disputed', 'refunded'],
    default: 'pending'
  },
  dispute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dispute'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});
```

### Disputa

```javascript
const disputeSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  evidence: [{
    description: {
      type: String
    },
    file_url: {
      type: String
    }
  }],
  status: {
    type: String,
    enum: ['open', 'resolved_buyer', 'resolved_seller', 'closed'],
    default: 'open'
  },
  mediator_notes: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  resolved_at: {
    type: Date
  }
});
```

### Mensagem

```javascript
const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encrypted_content: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});
```

## API RESTful

### Autenticação

#### Registro de Usuário

```
POST /api/auth/register
```

Parâmetros:
- `username`: Nome de usuário único
- `password`: Senha do usuário
- `email`: Email do usuário (será armazenado apenas o hash)
- `public_key`: Chave pública do usuário para criptografia

Resposta:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "username",
    "public_key": "public_key"
  }
}
```

#### Login

```
POST /api/auth/login
```

Parâmetros:
- `username`: Nome de usuário
- `password`: Senha do usuário

Resposta:
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "username",
    "public_key": "public_key"
  }
}
```

### Produtos

#### Listar Produtos

```
GET /api/products
```

Parâmetros de Query:
- `page`: Número da página (padrão: 1)
- `limit`: Número de itens por página (padrão: 20)
- `category`: Filtrar por categoria
- `min_price`: Preço mínimo
- `max_price`: Preço máximo
- `search`: Termo de busca

Resposta:
```json
{
  "success": true,
  "products": [
    {
      "id": "product_id",
      "title": "Título do Produto",
      "description": "Descrição do produto",
      "price": {
        "amount": 1000000,
        "currency": "SATS"
      },
      "images": ["url_imagem_1", "url_imagem_2"],
      "category": "categoria",
      "seller": {
        "id": "seller_id",
        "username": "username",
        "reputation": {
          "rating": 4.8,
          "total_transactions": 56
        }
      },
      "shipping_options": [
        {
          "name": "Padrão",
          "price": 50000,
          "estimated_days": "5-7 dias"
        }
      ],
      "created_at": "2025-04-10T09:15:00Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

#### Obter Produto por ID

```
GET /api/products/:id
```

Resposta:
```json
{
  "success": true,
  "product": {
    "id": "product_id",
    "title": "Título do Produto",
    "description": "Descrição do produto",
    "price": {
      "amount": 1000000,
      "currency": "SATS"
    },
    "images": ["url_imagem_1", "url_imagem_2"],
    "category": "categoria",
    "seller": {
      "id": "seller_id",
      "username": "username",
      "reputation": {
        "rating": 4.8,
        "total_transactions": 56
      }
    },
    "shipping_options": [
      {
        "name": "Padrão",
        "price": 50000,
        "estimated_days": "5-7 dias"
      }
    ],
    "created_at": "2025-04-10T09:15:00Z"
  }
}
```

#### Criar Produto

```
POST /api/products
```

Parâmetros:
- `title`: Título do produto
- `description`: Descrição do produto
- `price`: Objeto com `amount` e `currency`
- `images`: Array de URLs de imagens
- `category`: Categoria do produto
- `shipping_options`: Array de opções de envio

Resposta:
```json
{
  "success": true,
  "product": {
    "id": "product_id",
    "title": "Título do Produto",
    "description": "Descrição do produto",
    "price": {
      "amount": 1000000,
      "currency": "SATS"
    },
    "images": ["url_imagem_1", "url_imagem_2"],
    "category": "categoria",
    "seller": {
      "id": "seller_id",
      "username": "username"
    },
    "shipping_options": [
      {
        "name": "Padrão",
        "price": 50000,
        "estimated_days": "5-7 dias"
      }
    ],
    "created_at": "2025-04-10T09:15:00Z"
  }
}
```

### Transações

#### Criar Transação

```
POST /api/transactions
```

Parâmetros:
- `product_id`: ID do produto
- `shipping_option`: Nome da opção de envio selecionada
- `shipping_address`: Endereço de entrega
- `buyer_pubkey`: Chave pública do comprador para o escrow

Resposta:
```json
{
  "success": true,
  "transaction": {
    "id": "transaction_id",
    "product": {
      "id": "product_id",
      "title": "Título do Produto",
      "price": {
        "amount": 1000000,
        "currency": "SATS"
      }
    },
    "escrow": {
      "address": "bc1q...",
      "redeem_script": "script_hex"
    },
    "amount": 1050000,
    "status": "pending",
    "created_at": "2025-04-15T14:30:00Z"
  }
}
```

#### Verificar Pagamento

```
POST /api/transactions/:id/verify
```

Resposta:
```json
{
  "success": true,
  "transaction": {
    "id": "transaction_id",
    "status": "funded",
    "updated_at": "2025-04-15T14:45:00Z"
  }
}
```

#### Marcar como Enviado (Vendedor)

```
POST /api/transactions/:id/ship
```

Resposta:
```json
{
  "success": true,
  "transaction": {
    "id": "transaction_id",
    "status": "shipped",
    "updated_at": "2025-04-16T10:20:00Z"
  }
}
```

#### Confirmar Recebimento (Comprador)

```
POST /api/transactions/:id/complete
```

Parâmetros:
- `signature`: Assinatura do comprador para liberação dos fundos

Resposta:
```json
{
  "success": true,
  "transaction": {
    "id": "transaction_id",
    "status": "completed",
    "updated_at": "2025-04-18T09:30:00Z"
  },
  "tx_id": "bitcoin_transaction_id"
}
```

#### Iniciar Disputa

```
POST /api/transactions/:id/dispute
```

Parâmetros:
- `reason`: Motivo da disputa
- `evidence`: Array de evidências (opcional)

Resposta:
```json
{
  "success": true,
  "transaction": {
    "id": "transaction_id",
    "status": "disputed",
    "updated_at": "2025-04-17T16:45:00Z"
  },
  "dispute": {
    "id": "dispute_id",
    "reason": "Motivo da disputa",
    "status": "open",
    "created_at": "2025-04-17T16:45:00Z"
  }
}
```

### Bitcoin

#### Gerar Endereço Multisig

```
POST /api/bitcoin/generate-address
```

Parâmetros:
- `buyer_pubkey`: Chave pública do comprador
- `seller_pubkey`: Chave pública do vendedor

Resposta:
```json
{
  "success": true,
  "address": "bc1q...",
  "redeem_script": "script_hex",
  "mediator_pubkey": "mediator_pubkey"
}
```

#### Verificar Pagamento

```
POST /api/bitcoin/verify-payment
```

Parâmetros:
- `address`: Endereço Bitcoin a verificar
- `amount`: Valor esperado

Resposta:
```json
{
  "success": true,
  "confirmed": true,
  "tx_id": "bitcoin_transaction_id",
  "confirmations": 3
}
```

#### Gerar Invoice Lightning

```
POST /api/lightning/generate-invoice
```

Parâmetros:
- `amount`: Valor em satoshis
- `description`: Descrição do pagamento

Resposta:
```json
{
  "success": true,
  "invoice": "lnbc...",
  "expires_at": "2025-04-15T15:30:00Z"
}
```

#### Verificar Pagamento Lightning

```
POST /api/lightning/check-payment
```

Parâmetros:
- `invoice`: Invoice Lightning a verificar

Resposta:
```json
{
  "success": true,
  "paid": true,
  "settled_at": "2025-04-15T15:25:00Z"
}
```

## Integração Bitcoin

### Geração de Endereços Multisig

O PayByt utiliza endereços multisig 2-de-3 para o sistema de escrow, onde as três partes são:
1. Comprador
2. Vendedor
3. Mediador (sistema PayByt)

```javascript
const bitcoinjs = require('bitcoinjs-lib');
const network = bitcoinjs.networks.bitcoin; // ou bitcoinjs.networks.testnet para testes

function generateMultisigAddress(buyerPubkey, sellerPubkey, mediatorPubkey) {
  const pubkeys = [
    Buffer.from(buyerPubkey, 'hex'),
    Buffer.from(sellerPubkey, 'hex'),
    Buffer.from(mediatorPubkey, 'hex')
  ].sort((a, b) => a.compare(b)); // Ordenação lexicográfica das chaves públicas
  
  const p2ms = bitcoinjs.payments.p2ms({
    m: 2, // 2 de 3 assinaturas necessárias
    pubkeys,
    network
  });
  
  const p2wsh = bitcoinjs.payments.p2wsh({
    redeem: p2ms,
    network
  });
  
  return {
    address: p2wsh.address,
    redeemScr
(Content truncated due to size limit. Use line ranges to read in chunks)