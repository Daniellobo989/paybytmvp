# Arquitetura do Sistema PayByt

## 1. Visão Geral da Arquitetura

O PayByt é um marketplace descentralizado que utiliza Bitcoin como única forma de pagamento, oferecendo privacidade total sem KYC, escrow multisig e integração com Lightning Network. A arquitetura do sistema é projetada para ser descentralizada, segura e escalável.

### Diagrama de Alto Nível

```
+----------------------------------+
|           FRONTEND               |
|  +----------------------------+  |
|  |     Interface do Usuário   |  |
|  | (React.js + Tailwind CSS)  |  |
|  +----------------------------+  |
+----------------------------------+
              |
              | API RESTful
              |
+----------------------------------+
|            BACKEND               |
|  +----------------------------+  |
|  |    Serviços de Aplicação   |  |
|  |     (Node.js/Express)      |  |
|  +----------------------------+  |
|              |                   |
|  +------------+------------+     |
|  |             |           |     |
|  v             v           v     |
| +-----+     +------+    +-----+  |
| | API |     | Auth |    | DB  |  |
| +-----+     +------+    +-----+  |
+----------------------------------+
              |
              v
+----------------------------------+
|       SERVIÇOS BLOCKCHAIN        |
|  +------------+  +------------+  |
|  |  Bitcoin   |  | Lightning  |  |
|  |  (Escrow)  |  |  Network   |  |
|  +------------+  +------------+  |
|  +------------+  +------------+  |
|  | Rootstock  |  | Monitoring |  |
|  | (Contratos)|  |  Service   |  |
|  +------------+  +------------+  |
+----------------------------------+
              |
              v
+----------------------------------+
|       INFRAESTRUTURA             |
|  +------------+  +------------+  |
|  |    IPFS    |  |  AWS/GCP   |  |
|  | (Descen-   |  |  (Redun-   |  |
|  | tralizado) |  |   dância)  |  |
|  +------------+  +------------+  |
|  +------------+  +------------+  |
|  |   Docker   |  |  Nginx/PM2 |  |
|  | (Container)|  | (Escalab.) |  |
|  +------------+  +------------+  |
+----------------------------------+
```

## 2. Componentes do Sistema

### 2.1 Frontend

- **Tecnologias**: React.js (v18), Tailwind CSS
- **Responsabilidades**:
  - Interface de usuário responsiva (desktop e mobile)
  - Gerenciamento de estado da aplicação
  - Comunicação com API do backend
  - Criptografia client-side para mensagens e dados sensíveis
  - Gerenciamento de carteira Bitcoin no navegador

#### Principais Componentes do Frontend:

1. **Módulo de Autenticação**
   - Cadastro anônimo via e-mail criptografado
   - Autenticação 2FA (Google Authenticator/YubiKey)
   - Gerenciamento de sessão segura

2. **Marketplace**
   - Listagem de produtos/serviços
   - Sistema de busca e filtros
   - Visualização detalhada de produtos
   - Avaliações e feedback

3. **Sistema de Carteira**
   - Integração com carteiras Bitcoin
   - Geração de endereços multisig
   - Monitoramento de transações
   - Suporte a Lightning Network

4. **Chat Criptografado**
   - Comunicação segura entre compradores e vendedores
   - Suporte a anexos criptografados
   - Histórico de conversas

5. **Dashboard**
   - Histórico de transações
   - Estatísticas de vendas/compras
   - Gerenciamento de produtos (para vendedores)
   - Acompanhamento de disputas

### 2.2 Backend

- **Tecnologias**: Node.js (v20), Express.js, MongoDB (com Mongoose)
- **Responsabilidades**:
  - Processamento de requisições da API
  - Lógica de negócios do marketplace
  - Gerenciamento de dados
  - Integração com serviços blockchain
  - Segurança e autenticação

#### Principais Componentes do Backend:

1. **API RESTful**
   - Endpoints para todas as funcionalidades do marketplace
   - Autenticação e autorização
   - Validação de dados
   - Documentação com Swagger/OpenAPI

2. **Serviço de Autenticação**
   - Verificação de e-mails criptografados
   - Validação 2FA
   - Gerenciamento de tokens JWT
   - Implementação de ZKPs para privacidade

3. **Serviço de Escrow**
   - Criação de endereços multisig
   - Monitoramento de transações Bitcoin
   - Gerenciamento do ciclo de vida do escrow
   - Resolução de disputas

4. **Serviço de Lightning Network**
   - Integração com nó LND
   - Geração de faturas (invoices)
   - Processamento de pagamentos rápidos
   - Gerenciamento de canais

5. **Sistema de Detecção de Fraudes**
   - Análise de texto com NLP
   - Processamento de imagens
   - Detecção de comportamentos suspeitos
   - Bloqueio automático de conteúdo ilícito

6. **Serviço de Notificações**
   - Atualizações em tempo real via WebSockets
   - Notificações sobre transações
   - Alertas de segurança
   - Mensagens do sistema

### 2.3 Banco de Dados

- **Tecnologia**: MongoDB (com criptografia)
- **Estrutura**:
  - Coleções separadas para diferentes entidades
  - Índices otimizados para consultas frequentes
  - Criptografia de dados sensíveis

#### Principais Coleções:

1. **Users**
   - Informações básicas do usuário (sem dados pessoais)
   - Chaves públicas
   - Configurações de segurança
   - Histórico de avaliações

2. **Products**
   - Detalhes dos produtos/serviços
   - Preços em Bitcoin
   - Categorias e tags
   - Imagens e descrições

3. **Transactions**
   - Histórico de transações
   - Estado do escrow
   - Endereços Bitcoin
   - Timestamps e confirmações

4. **Messages**
   - Mensagens criptografadas
   - Metadados (sem conteúdo legível)
   - Referências a transações

5. **Disputes**
   - Registros de disputas
   - Evidências submetidas
   - Decisões e resoluções
   - Histórico de comunicações

### 2.4 Serviços Blockchain

- **Tecnologias**: bitcoinjs-lib, lnd, Rootstock
- **Responsabilidades**:
  - Interação com a blockchain do Bitcoin
  - Gerenciamento de transações Lightning Network
  - Monitoramento de confirmações
  - Execução de contratos inteligentes (fase posterior)

#### Principais Componentes:

1. **Serviço Bitcoin Core**
   - Conexão com nó Bitcoin
   - Criação e transmissão de transações
   - Verificação de confirmações
   - Gerenciamento de UTXO

2. **Serviço Lightning Network**
   - Nó LND para pagamentos rápidos
   - API para interação com canais de pagamento
   - Gerenciamento de liquidez
   - Roteamento de pagamentos

3. **Serviço de Monitoramento**
   - Verificação contínua de transações
   - Alertas sobre confirmações
   - Detecção de double-spending
   - Análise de taxas de rede

## 3. Fluxos de Dados e Processos

### 3.1 Fluxo de Compra e Venda

1. **Listagem de Produto**
   - Vendedor cria listagem com detalhes e preço em Bitcoin
   - Sistema verifica conteúdo com IA para detectar itens ilícitos
   - Produto é publicado no marketplace

2. **Processo de Compra**
   - Comprador seleciona produto e inicia compra
   - Sistema gera endereço multisig (2-de-3)
   - Comprador envia Bitcoin para endereço multisig
   - Sistema confirma recebimento após confirmações na blockchain
   - Vendedor é notificado para enviar produto/serviço

3. **Confirmação e Pagamento**
   - Vendedor envia produto e fornece código de rastreamento
   - Comprador confirma recebimento
   - Sistema coleta assinaturas necessárias (2 de 3)
   - Fundos são liberados para vendedor
   - Transação é registrada e avaliações são solicitadas

4. **Resolução de Disputas**
   - Em caso de problema, comprador ou vendedor abre disputa
   - Ambas partes fornecem evidências
   - Plataforma analisa caso e decide sobre liberação dos fundos
   - Decisão é implementada com assinatura da plataforma

### 3.2 Fluxo de Pagamento Lightning Network

1. **Geração de Fatura**
   - Sistema gera fatura Lightning Network
   - QR code é apresentado ao comprador
   - Timer é iniciado para expiração da fatura

2. **Processamento de Pagamento**
   - Comprador paga usando carteira Lightning
   - Pagamento é roteado através da rede
   - Sistema recebe confirmação instantânea
   - Transação é registrada e processo continua

## 4. Modelo de Dados

### 4.1 Esquema de Usuário

```javascript
const UserSchema = new mongoose.Schema({
  email_hash: {
    type: String,
    required: true,
    unique: true
  },
  public_key: {
    type: String,
    required: true
  },
  two_factor_secret: {
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
    },
    completed_transactions: {
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
  },
  settings: {
    preferred_payment: {
      type: String,
      enum: ['on-chain', 'lightning', 'liquid'],
      default: 'on-chain'
    },
    notification_preferences: {
      email: {
        type: Boolean,
        default: true
      },
      browser: {
        type: Boolean,
        default: true
      }
    }
  }
});
```

### 4.2 Esquema de Produto

```javascript
const ProductSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
  category: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  images: [{
    url: String,
    hash: String
  }],
  shipping_options: [{
    method: String,
    price: Number,
    estimated_days: Number
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive', 'blocked'],
    default: 'active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  ai_verification: {
    is_approved: {
      type: Boolean,
      default: false
    },
    text_analysis: {
      score: Number,
      flags: [String]
    },
    image_analysis: {
      score: Number,
      flags: [String]
    }
  }
});
```

### 4.3 Esquema de Transação

```javascript
const TransactionSchema = new mongoose.Schema({
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  escrow: {
    multisig_address: {
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
    platform_pubkey: {
      type: String,
      required: true
    }
  },
  payment: {
    type: {
      type: String,
      enum: ['on-chain', 'lightning'],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true
    },
    txid: String,
    lightning_invoice: String,
    confirmations: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: [
      'created',
      'awaiting_payment',
      'payment_received',
      'processing',
      'shipped',
      'delivered',
      'completed',
      'disputed',
      'refunded',
      'cancelled'
    ],
    default: 'created'
  },
  shipping: {
    tracking_code: String,
    carrier: String,
    method: String,
    address_hash: String
  },
  timestamps: {
    created: {
      type: Date,
      default: Date.now
    },
    payment_received: Date,
    shipped: Date,
    delivered: Date,
    completed: Date
  },
  dispute: {
    is_active: {
      type: Boolean,
      default: false
    },
    opened_by: {
      type: String,
      enum: ['buyer', 'seller', 'platform']
    },
    reason: String,
    evidence: [{
      type: String
    }],
    resolution: {
      decision: {
        type: String,
        enum: ['pending', 'buyer', 'seller', 'split']
      },
      notes: String,
      timestamp: Date
    }
  }
});
```

## 5. APIs e Endpoints

### 5.1 API de Usuários

- `POST /api/users/register` - Registro de novo usuário
- `POST /api/users/login` - Autenticação de usuário
- `POST /api/users/verify-2fa` - Verificação de 2FA
- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil do usuário
- `GET /api/users/:id/reputation` - Obter reputação de usuário

### 5.2 API de Produtos

- `POST /api/products` - Criar novo produto
- `GET /api/products` - Listar produtos (com filtros)
- `GET /api/products/:id` - Obter detalhes de produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Remover produto
- `GET /api/products/categories` - Listar categorias

### 5.3 API de Transações

- `POST /api/transactions` - Iniciar nova transação
- `GET /api/transactions` - Listar transações do usuário
- `GET /api/transactions/:id` - Obter detalhes de transação
- `PUT /api/transactions/:id/status` - Atualizar status da transação
- `POST /api/transactions/:id/dispute` - Abrir disputa
- `POST /api/transactions/:id/resolve` - Resolver disputa

### 5.4 API de Pagamentos

- `POST /api/payments/bitcoin/address` - Gerar endereço multisig
- `POST /api/payments/lightning/invoice` - Gerar fatura Lightning
- `GET /api/payments/:id/status` - Verificar status de pagamento
- `POST /api/payments/:id/release` - Liberar fundos do escrow

### 5.5 API de Mensagens

- `POST /api/messages` - Enviar mensagem
- `GET /api/messages` - Listar conversas
- `GET /api/messages/:conversation_id` - Obter mensagens de conversa

## 6. Segurança e Escalabilidade

### 6.1 Medidas de Segurança

- **Autenticação**: 2FA obrigatório, tokens JWT com expiração curta
- **Criptografia**: AES-256 para dados sensíveis, SSL/TLS para comunicações
- **Proteção de Dados**: ZKPs para validação anônima, sem armazenamento de dados pessoais
- **Monitoramento**: Detecção de atividades suspeitas, bloqueio automático
- **Auditorias**: Logs de segurança, auditorias trimestrais

### 6.2 Estratégia de Escalabilidade

- **Hospedagem Híbrida**: IPFS para descentralização, AWS/Google Cloud para redundância
- **Balanceamento de Carga**: Nginx para distribuição de tráfego
- **Gerenciamento de Processos**: PM2 para clusters Node.js
- **Containerização**: Docker para isolamento e portabilidade
- **Banco de Dados**: Sharding e indexação para otimização de consultas

## 7. Plano de Implementação para o MVP

### 7.1 Componentes Essenciais para o MVP

1. **Sistema de Autenticação Básico**
   - Cadastro com e-mail criptografado
   - Autenticação 2FA
   - Gerenciamento de sessão

2. **Marketplace Simplificado**
   - Listagem e busca de produtos
   - Detalhes de produtos
   - Sistema de categorias

3. **Escrow Multisig Funcional**
   - Criação de endereços multisig
   - Monitoramento de transações
   - Liberação de fundos

4. **Chat Básico**
   - Comunicação entre compradores e vendedores
   - Criptografia de mensagens

5. **Integração Bitcoin On-chain**
   - Geração de endereços
   - Verificação de pagamentos
   - Monitoramento de confirmações

### 7.2 Cronograma de Desenvolvimento

1. **Semana 1-2**: Configuração do ambiente e estrutura básica
   - Configurar repositório Git
   - Estruturar projeto (frontend e backend)
   - Configurar banco de dados
   - Implementar autenticação básica

2. **Semana 3-4**: Desenvolvimento do marketplace e Bitcoin básico
   - Implementar CRUD de produtos
   - Desenvolver interface de usuário básica
   - Integrar bitcoinjs-lib para operações básicas
   - Implementar geração de endereços

3. **Semana 5-6**: Implementação do escrow e transações
   - Desenvolver sistema de escrow multisig
   - Implementar fluxo de compra e venda
   - Criar sistema de monitoramento de transações
   - Desenvolver chat básico

4. **Semana 7-8**: Testes, refinamentos e lançamento do MVP
   - Realizar testes de integração
   - Corrigir bug
(Content truncated due to size limit. Use line ranges to read in chunks)