# Documentação Técnica - Integração Lightning Network PayByt

## Visão Geral

Esta documentação descreve a implementação da integração Lightning Network para o marketplace PayByt, incluindo o sistema de oráculos para verificação de entrega e o sistema de taxas da plataforma. A solução foi projetada para fornecer pagamentos rápidos e de baixo custo usando a Lightning Network do Bitcoin, além de garantir a segurança das transações através de verificação automática de entregas.

## Arquitetura

A arquitetura da solução segue um design modular, com três componentes principais:

1. **Integração Lightning Network**: Gerencia pagamentos via Lightning Network
2. **Sistema de Oráculos**: Verifica automaticamente a entrega de produtos
3. **Sistema de Taxas**: Gerencia a taxa de 1% da plataforma

### Diagrama de Componentes

```
+---------------------+     +---------------------+     +---------------------+
|                     |     |                     |     |                     |
| Integração Lightning|<--->| Sistema de Oráculos |<--->| Sistema de Taxas    |
|                     |     |                     |     |                     |
+---------------------+     +---------------------+     +---------------------+
         ^                           ^                           ^
         |                           |                           |
         v                           v                           v
+---------------------+     +---------------------+     +---------------------+
|                     |     |                     |     |                     |
| BTCPay Server/      |     | Chainlink/IPFS      |     | Distribuição de     |
| OpenNode            |     | Smart Contracts     |     | Taxas               |
|                     |     |                     |     |                     |
+---------------------+     +---------------------+     +---------------------+
```

## Componentes Principais

### 1. Integração Lightning Network

#### Serviços

- **lightningService.ts**: Implementa a integração com Lightning Network
  - Criação de faturas via BTCPay Server e OpenNode
  - Verificação de status de pagamentos
  - Processamento de webhooks
  - Geração de QR codes para pagamentos

#### Controladores e Rotas

- **lightningController.ts**: Gerencia as operações relacionadas a pagamentos
- **lightningRoutes.ts**: Define os endpoints da API para pagamentos

#### Componentes de Interface

- **LightningPaymentComponent.tsx**: Interface para pagamentos Lightning
- **LightningCheckoutPage.tsx**: Fluxo completo de checkout com Lightning

### 2. Sistema de Oráculos

#### Serviços

- **oracleService.ts**: Gerencia a verificação de entregas
  - Monitoramento de códigos de rastreio
  - Verificação de entrega de produtos digitais
  - Registro de provas de abertura/leitura

- **chainlinkDeliveryAdapter.ts**: Integração com Chainlink para verificação de entregas
- **ipfsProofAdapter.ts**: Armazenamento de provas no IPFS
- **smartContractAdapter.ts**: Integração com contratos inteligentes

#### Controladores e Rotas

- **oracleController.ts**: Gerencia as operações relacionadas a verificação de entregas
- **oracleRoutes.ts**: Define os endpoints da API para verificação de entregas

#### Componentes de Interface

- **DeliveryVerificationComponent.tsx**: Interface para verificação de entregas

### 3. Sistema de Taxas

#### Serviços

- **feeService.ts**: Gerencia o cálculo e registro de taxas
  - Cálculo da taxa de 1% da plataforma
  - Estimativa de taxas de mineração e roteamento
  - Registro de taxas coletadas

- **feeDistributionService.ts**: Gerencia a distribuição de taxas
  - Distribuição entre diferentes destinos
  - Geração de relatórios de taxas

#### Controladores e Rotas

- **feeController.ts**: Gerencia as operações relacionadas a taxas
- **feeRoutes.ts**: Define os endpoints da API para taxas
- **feeDistributionController.ts**: Gerencia a distribuição de taxas
- **feeDistributionRoutes.ts**: Define os endpoints da API para distribuição de taxas

#### Componentes de Interface

- **FeeSummaryComponent.tsx**: Exibição de resumo de taxas

## Fluxos de Pagamento

### Pagamento via Lightning Network

1. Usuário seleciona produto e escolhe Lightning Network como método de pagamento
2. Sistema calcula valor total incluindo taxa da plataforma (1%)
3. `lightningService` cria fatura Lightning via BTCPay Server ou OpenNode
4. Usuário paga usando carteira Lightning Network
5. Gateway notifica sistema via webhook quando pagamento é recebido
6. Sistema atualiza status da transação e registra taxa da plataforma

### Verificação de Entrega para Produtos Físicos

1. Vendedor registra código de rastreio no sistema
2. `oracleService` monitora status de entrega periodicamente via `chainlinkDeliveryAdapter`
3. Quando entrega é confirmada, `smartContractAdapter` envia sinal para smart contract
4. Smart contract libera fundos automaticamente para o vendedor

### Verificação de Entrega para Produtos Digitais

1. Vendedor envia chave de ativação ou link de download via plataforma
2. Comprador confirma recebimento ou sistema verifica automaticamente após X dias
3. `ipfsProofAdapter` registra provas de abertura via IPFS ou assinaturas digitais
4. Smart contract libera fundos para o vendedor

### Distribuição de Taxas

1. Sistema coleta taxa de 1% sobre o valor da transação
2. `feeDistributionService` distribui a taxa entre diferentes destinos:
   - 40% para operações da plataforma
   - 30% para desenvolvimento
   - 20% para segurança
   - 10% para comunidade
3. Sistema gera relatórios de taxas coletadas e distribuídas

## APIs

### API Lightning Network

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/lightning/invoice` | POST | Criar nova fatura Lightning |
| `/api/lightning/invoice/:invoiceId` | GET | Obter fatura pelo ID |
| `/api/lightning/invoice/:invoiceId/status` | GET | Verificar status de fatura |
| `/api/lightning/invoices` | GET | Obter todas as faturas |
| `/api/lightning/webhook/btcpay` | POST | Webhook para BTCPay Server |
| `/api/lightning/webhook/opennode` | POST | Webhook para OpenNode |
| `/api/lightning/fee-estimate` | GET | Estimar taxas para transação |

### API de Oráculos

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/oracle/tracking` | POST | Registrar código de rastreio |
| `/api/oracle/tracking/:trackingCode` | GET | Obter status de entrega |
| `/api/oracle/tracking/:trackingCode/status` | GET | Verificar status atual |
| `/api/oracle/tracking/:trackingCode/qrcode` | GET | Gerar QR code para confirmação |
| `/api/oracle/tracking/confirm` | POST | Confirmar entrega via QR code |
| `/api/oracle/digital` | POST | Registrar entrega digital |
| `/api/oracle/digital/:productId` | GET | Obter status de entrega digital |
| `/api/oracle/digital/:productId/confirm` | POST | Confirmar recebimento digital |
| `/api/oracle/digital/proof` | POST | Registrar prova de abertura |
| `/api/oracle/digital/verify` | POST | Verificar prova de leitura |

### API de Taxas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/fee/platform` | GET | Calcular taxa da plataforma |
| `/api/fee/mining` | GET | Estimar taxa de mineração |
| `/api/fee/routing` | GET | Estimar taxa de roteamento |
| `/api/fee/record` | POST | Registrar cobrança de taxa |
| `/api/fee/report` | GET | Gerar relatório de taxas |
| `/api/fee/records` | GET | Obter todos os registros de taxas |
| `/api/fee/records/:feeType` | GET | Obter registros por tipo |
| `/api/fee/config` | GET | Obter configuração de taxas |
| `/api/fee/config` | PUT | Atualizar configuração de taxas |

### API de Distribuição de Taxas

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/fee-distribution/distribute` | POST | Distribuir taxa da plataforma |
| `/api/fee-distribution/config` | GET | Obter configuração de distribuição |
| `/api/fee-distribution/config` | PUT | Atualizar configuração de distribuição |
| `/api/fee-distribution/records` | GET | Obter registros de distribuição |
| `/api/fee-distribution/records/period` | GET | Obter registros por período |
| `/api/fee-distribution/report` | GET | Gerar relatório de distribuição |

## Tecnologias Utilizadas

| Componente | Tecnologia |
|------------|------------|
| Frontend | React.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Pagamentos Lightning | BTCPay Server, OpenNode |
| Oráculos | Chainlink External Adapter |
| Armazenamento de Provas | IPFS |
| Contratos Inteligentes | Solidity (Ethereum/BSC/RSK) |
| Banco de Dados | MongoDB (para histórico) |

## Configuração e Instalação

### Pré-requisitos

- Node.js 14+
- npm ou yarn
- Conta no BTCPay Server ou OpenNode
- Nó Lightning Network (opcional)

### Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/Daniellobo989/paybytmvp.git
   cd paybyt-lightning
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas credenciais.

4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Testes

Os testes unitários foram implementados usando Jest. Para executar os testes:

```
npm test
```

Os testes cobrem:
- Integração Lightning Network
- Sistema de Oráculos
- Sistema de Taxas

## Considerações de Segurança

- As chaves privadas são armazenadas apenas no navegador do cliente, nunca no servidor
- Todas as comunicações com APIs externas são feitas via HTTPS
- Webhooks são verificados usando assinaturas digitais
- Provas de entrega são armazenadas de forma imutável no IPFS
- Contratos inteligentes são auditados antes da implantação

## Limitações e Trabalhos Futuros

- Implementação atual usa simulações para algumas integrações externas
- Suporte a múltiplos gateways Lightning pode ser expandido
- Sistema de oráculos pode ser aprimorado com mais fontes de dados
- Integração com mais transportadoras para rastreamento de entregas
- Implementação de sistema de disputas e arbitragem

## Referências

- [Documentação BTCPay Server](https://docs.btcpayserver.org/)
- [Documentação OpenNode](https://developers.opennode.com/)
- [Documentação Chainlink](https://docs.chain.link/)
- [Documentação IPFS](https://docs.ipfs.io/)
- [Especificação BOLT11](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md)
