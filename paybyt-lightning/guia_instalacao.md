# Guia de Instalação - Integração Lightning Network PayByt

Este guia fornece instruções detalhadas para instalar e configurar a integração Lightning Network para o marketplace PayByt, incluindo o sistema de oráculos para verificação de entrega e o sistema de taxas da plataforma.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 14.0.0 ou superior)
- npm (versão 6.0.0 ou superior) ou yarn (versão 1.22.0 ou superior)
- Git

Você também precisará de:

- Conta no BTCPay Server ou OpenNode para processamento de pagamentos Lightning
- Acesso a um nó Lightning Network (opcional, mas recomendado para ambiente de produção)
- Conta no Infura ou outro provedor IPFS (para armazenamento de provas)
- Conta no Chainlink (para oráculos)

## Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/Daniellobo989/paybytmvp.git
cd paybytmvp
```

### 2. Instale as Dependências

Usando npm:
```bash
npm install
```

Ou usando yarn:
```bash
yarn install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```
# Configuração do Servidor
PORT=3000
NODE_ENV=development

# BTCPay Server
BTCPAY_SERVER_URL=https://seu-servidor-btcpay.com
BTCPAY_API_KEY=sua-api-key
BTCPAY_STORE_ID=seu-store-id

# OpenNode (opcional)
OPENNODE_API_URL=https://api.opennode.com
OPENNODE_API_KEY=sua-api-key

# IPFS
IPFS_API_URL=https://ipfs.infura.io:5001/api/v0
IPFS_GATEWAY_URL=https://ipfs.io/ipfs
IPFS_API_KEY=sua-api-key

# Chainlink
CHAINLINK_NODE_URL=https://seu-node-chainlink.com
CHAINLINK_JOB_ID=seu-job-id
CHAINLINK_ORACLE_ADDRESS=seu-oracle-address
CHAINLINK_API_KEY=sua-api-key

# Smart Contract
BLOCKCHAIN_PROVIDER_URL=https://rsk-testnet.alchemyapi.io/v2/sua-api-key
ESCROW_CONTRACT_ADDRESS=0xSeuContratoEscrow
CONTRACT_PRIVATE_KEY=sua-chave-privada

# APIs de Rastreamento
CORREIOS_API_KEY=sua-api-key
DHL_API_KEY=sua-api-key
UPS_API_KEY=sua-api-key
TRACKING_MORE_API_KEY=sua-api-key
```

### 4. Integre os Componentes ao Projeto Existente

#### Copie os Arquivos de Serviço

```bash
cp -r paybyt-lightning/src/services/* paybyt-interactive/src/services/
```

#### Copie os Controladores e Rotas

```bash
cp -r paybyt-lightning/src/controllers/* paybyt-interactive/src/controllers/
cp -r paybyt-lightning/src/routes/* paybyt-interactive/src/routes/
```

#### Copie os Componentes de Interface

```bash
cp -r paybyt-lightning/src/components/lightning/* paybyt-interactive/src/components/lightning/
```

#### Copie os Testes

```bash
cp -r paybyt-lightning/src/tests/* paybyt-interactive/src/tests/
```

### 5. Configure as Rotas no Servidor Express

Edite o arquivo principal do servidor (geralmente `src/index.js` ou `src/app.js`):

```javascript
// Importar rotas
const lightningRoutes = require('./routes/lightningRoutes');
const oracleRoutes = require('./routes/oracleRoutes');
const feeRoutes = require('./routes/feeRoutes');
const feeDistributionRoutes = require('./routes/feeDistributionRoutes');

// Configurar rotas
app.use('/api/lightning', lightningRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/fee-distribution', feeDistributionRoutes);
```

### 6. Integre os Componentes React

Edite o arquivo de rotas do React (geralmente `src/App.tsx`):

```tsx
import LightningCheckoutPage from './components/lightning/LightningCheckoutPage';

// Adicione a rota para o checkout Lightning
<Route path="/checkout/lightning" element={<LightningCheckoutPage />} />
```

### 7. Configure o BTCPay Server

1. Acesse o painel de administração do BTCPay Server
2. Crie uma nova loja ou use uma existente
3. Ative o Lightning Network nas configurações da loja
4. Gere uma API Key com permissões para gerenciar faturas
5. Copie o Store ID e a API Key para o arquivo `.env`

### 8. Configure o Chainlink (para ambiente de produção)

1. Configure um nó Chainlink seguindo a [documentação oficial](https://docs.chain.link/)
2. Crie um Job para verificação de entregas
3. Copie o Job ID e o Oracle Address para o arquivo `.env`

### 9. Implante o Smart Contract de Escrow (para ambiente de produção)

1. Compile e implante o contrato de escrow na rede desejada (Ethereum, BSC, RSK)
2. Copie o endereço do contrato para o arquivo `.env`

## Executando o Projeto

### Ambiente de Desenvolvimento

```bash
npm run dev
```

Ou usando yarn:
```bash
yarn dev
```

O servidor será iniciado na porta especificada no arquivo `.env` (padrão: 3000).

### Ambiente de Produção

```bash
npm run build
npm start
```

Ou usando yarn:
```bash
yarn build
yarn start
```

## Testando a Instalação

### Executar Testes Unitários

```bash
npm test
```

Ou usando yarn:
```bash
yarn test
```

### Testar Manualmente

1. Acesse `http://localhost:3000` (ou a URL do seu servidor)
2. Navegue até um produto
3. Escolha "Pagar com Lightning Network" no checkout
4. Verifique se a fatura Lightning é gerada corretamente
5. Teste o pagamento usando uma carteira Lightning de teste

## Solução de Problemas

### Erro de Conexão com BTCPay Server

Verifique se:
- A URL do BTCPay Server está correta
- A API Key tem permissões suficientes
- O Store ID está correto

### Erro ao Gerar Fatura Lightning

Verifique se:
- O nó Lightning do BTCPay Server está ativo e com canais abertos
- A configuração do Lightning Network está correta na loja

### Erro de Conexão com IPFS

Verifique se:
- A URL da API IPFS está correta
- A API Key tem permissões suficientes

### Erro ao Verificar Entregas

Verifique se:
- As APIs de rastreamento estão configuradas corretamente
- As API Keys das transportadoras são válidas

## Atualizações e Manutenção

### Atualizando o Sistema

```bash
git pull
npm install
npm run build
```

Ou usando yarn:
```bash
git pull
yarn install
yarn build
```

### Backup do Banco de Dados

Recomendamos fazer backup regular do banco de dados MongoDB:

```bash
mongodump --uri="mongodb://seu-servidor:27017/paybyt" --out=/caminho/para/backup
```

## Suporte

Para suporte técnico, entre em contato:

- E-mail: suporte.tecnico@paybyt.com
- GitHub: Abra uma issue em https://github.com/Daniellobo989/paybytmvp/issues
