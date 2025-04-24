# Design da Integração com Lightning Network para PayByt

## Visão Geral da Arquitetura

A integração com Lightning Network para o PayByt será implementada seguindo uma arquitetura modular que permite suporte a múltiplos gateways de pagamento, com foco principal no BTCPay Server. O sistema será projetado para processar pagamentos via Lightning Network, calcular e gerenciar taxas (incluindo a taxa de 1% da plataforma), e fornecer uma experiência de usuário fluida.

## Componentes Principais

### 1. Serviço de Pagamento Lightning (Backend)

```
paybyt/backend/src/services/lightningService.js
```

Este serviço será responsável por:
- Gerenciar a comunicação com os gateways de pagamento (BTCPay Server, OpenNode)
- Gerar faturas Lightning Network
- Verificar o status dos pagamentos
- Calcular taxas (mineração e plataforma)
- Processar callbacks e webhooks dos gateways

### 2. Controlador de Pagamentos Lightning (Backend)

```
paybyt/backend/src/controllers/lightningController.js
```

Este controlador irá:
- Expor endpoints REST para o frontend
- Validar solicitações de pagamento
- Coordenar o fluxo de pagamento
- Gerenciar o estado das transações

### 3. Rotas de API Lightning (Backend)

```
paybyt/backend/src/routes/lightningRoutes.js
```

Endpoints da API:
- `POST /api/lightning/invoice` - Criar nova fatura
- `GET /api/lightning/invoice/:id` - Verificar status da fatura
- `POST /api/lightning/webhook` - Receber callbacks dos gateways
- `GET /api/lightning/fee-estimate` - Estimar taxas para uma transação

### 4. Componentes de Interface Lightning (Frontend)

```
paybyt/frontend/src/components/lightning/
```

Componentes React:
- `LightningPaymentComponent.tsx` - Interface principal de pagamento
- `LightningInvoiceDisplay.tsx` - Exibição de faturas com QR code
- `LightningPaymentStatus.tsx` - Status e confirmação de pagamento
- `LightningWalletConnect.tsx` - Conexão com carteiras compatíveis com WebLN

### 5. Serviços de API Lightning (Frontend)

```
paybyt/frontend/src/services/lightningService.ts
```

Este serviço irá:
- Comunicar-se com a API do backend
- Gerenciar o estado dos pagamentos no frontend
- Integrar-se com WebLN para carteiras compatíveis
- Fornecer feedback em tempo real sobre o status do pagamento

### 6. Sistema de Taxas

```
paybyt/backend/src/services/feeService.js
```

Este serviço será responsável por:
- Calcular taxas de mineração para transações on-chain
- Calcular taxas de roteamento para Lightning Network
- Aplicar a taxa de 1% da plataforma
- Rastrear taxas coletadas para fins contábeis
- Fornecer relatórios sobre taxas

## Fluxo de Pagamento Lightning

1. **Iniciar Pagamento**:
   - Usuário seleciona produto/serviço e escolhe Lightning Network como método de pagamento
   - Frontend solicita criação de fatura ao backend

2. **Criação de Fatura**:
   - Backend calcula valor total incluindo taxa da plataforma (1%)
   - Backend solicita criação de fatura ao gateway selecionado (BTCPay Server)
   - Gateway retorna detalhes da fatura (incluindo string de pagamento BOLT11)

3. **Apresentação ao Usuário**:
   - Frontend exibe fatura com QR code e opção de pagamento via WebLN
   - Usuário paga usando carteira Lightning Network

4. **Confirmação de Pagamento**:
   - Gateway notifica backend via webhook quando pagamento é recebido
   - Backend atualiza status da transação
   - Frontend exibe confirmação ao usuário

5. **Processamento Pós-Pagamento**:
   - Backend calcula valor a ser repassado ao vendedor (valor total - taxa da plataforma)
   - Sistema registra taxas coletadas
   - Transação é finalizada e produtos/serviços são liberados

## Integração com BTCPay Server

### Configuração do BTCPay Server

1. **Instalação e Configuração**:
   - Instalar BTCPay Server em servidor dedicado ou usar serviço hospedado
   - Configurar nó Lightning Network (LND recomendado)
   - Criar loja e configurar chaves de API

2. **Integração via API**:
   - Utilizar API REST do BTCPay Server para criar e gerenciar faturas
   - Configurar webhooks para notificações em tempo real
   - Implementar autenticação segura usando chaves de API

### Código de Exemplo para Integração

```javascript
// Exemplo de criação de fatura no BTCPay Server
async function createLightningInvoice(amount, orderId, description) {
  const productPrice = amount;
  const platformFee = amount * 0.01; // Taxa de 1%
  const totalAmount = productPrice + platformFee;
  
  const invoiceData = {
    price: totalAmount,
    currency: 'BTC',
    orderId: orderId,
    itemDesc: description,
    checkout: {
      speedPolicy: 'HighSpeed',
      paymentMethods: ['BTC_LightningNetwork'],
      redirectURL: `${config.appUrl}/payment/success`,
      redirectAutomatically: true
    },
    metadata: {
      orderId: orderId,
      productPrice: productPrice,
      platformFee: platformFee
    }
  };
  
  const response = await btcpayClient.createInvoice(invoiceData);
  return response;
}
```

## Integração com OpenNode (Secundária)

Como gateway secundário, o OpenNode será integrado para oferecer uma alternativa caso o BTCPay Server apresente problemas ou para usuários que preferem uma solução gerenciada.

```javascript
// Exemplo de criação de fatura no OpenNode
async function createOpenNodeInvoice(amount, orderId, description) {
  const productPrice = amount;
  const platformFee = amount * 0.01; // Taxa de 1%
  const totalAmount = productPrice + platformFee;
  
  const invoiceData = {
    amount: totalAmount,
    description: description,
    order_id: orderId,
    callback_url: `${config.apiUrl}/api/lightning/webhook/opennode`,
    success_url: `${config.appUrl}/payment/success`,
    metadata: {
      orderId: orderId,
      productPrice: productPrice,
      platformFee: platformFee
    }
  };
  
  const response = await openNodeClient.createCharge(invoiceData);
  return response;
}
```

## Integração com Frontend

### Componente de Pagamento Lightning

```tsx
// Exemplo simplificado do componente LightningPaymentComponent.tsx
import React, { useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode';
import { useWebLN } from '../../hooks/useWebLN';
import { lightningService } from '../../services/lightningService';

interface LightningPaymentProps {
  amount: number;
  orderId: string;
  description: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: Error) => void;
}

const LightningPaymentComponent: React.FC<LightningPaymentProps> = ({
  amount,
  orderId,
  description,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [invoice, setInvoice] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const { supported: webLNSupported, pay: webLNPay } = useWebLN();
  
  useEffect(() => {
    const createInvoice = async () => {
      try {
        const invoiceData = await lightningService.createInvoice(amount, orderId, description);
        setInvoice(invoiceData);
        
        // Iniciar polling para verificar status do pagamento
        const checkInterval = setInterval(async () => {
          const status = await lightningService.checkInvoiceStatus(invoiceData.id);
          setPaymentStatus(status);
          
          if (status === 'paid' || status === 'expired') {
            clearInterval(checkInterval);
            if (status === 'paid') onPaymentSuccess();
          }
        }, 3000);
        
        return () => clearInterval(checkInterval);
      } catch (error) {
        onPaymentError(error);
      }
    };
    
    createInvoice();
  }, [amount, orderId, description]);
  
  const handleWebLNPay = async () => {
    if (!invoice) return;
    
    try {
      await webLNPay(invoice.paymentRequest);
      // O status será atualizado pelo polling
    } catch (error) {
      console.error('WebLN payment error:', error);
    }
  };
  
  if (!invoice) return <div>Gerando fatura...</div>;
  
  return (
    <div className="lightning-payment-container">
      <h3>Pagamento via Lightning Network</h3>
      
      <div className="invoice-details">
        <p>Valor: {amount} BTC</p>
        <p>Taxa da plataforma: {amount * 0.01} BTC</p>
        <p>Total: {amount * 1.01} BTC</p>
      </div>
      
      <div className="qr-container">
        <QRCode value={invoice.paymentRequest} size={250} />
      </div>
      
      <div className="payment-options">
        {webLNSupported && (
          <button 
            className="webln-button"
            onClick={handleWebLNPay}
          >
            Pagar com Carteira Lightning
          </button>
        )}
        
        <div className="manual-instructions">
          <p>Ou escaneie o código QR com sua carteira Lightning Network</p>
          <div className="payment-request">
            <input 
              type="text" 
              readOnly 
              value={invoice.paymentRequest} 
              onClick={(e) => e.currentTarget.select()}
            />
            <button onClick={() => navigator.clipboard.writeText(invoice.paymentRequest)}>
              Copiar
            </button>
          </div>
        </div>
      </div>
      
      <div className={`payment-status status-${paymentStatus}`}>
        Status: {paymentStatus === 'pending' ? 'Aguardando pagamento' : 
                paymentStatus === 'paid' ? 'Pagamento confirmado!' : 
                'Fatura expirada'}
      </div>
    </div>
  );
};

export default LightningPaymentComponent;
```

## Sistema de Taxas

### Cálculo e Gerenciamento de Taxas

```javascript
// Exemplo do serviço de taxas
class FeeService {
  // Calcular taxa da plataforma (1%)
  calculatePlatformFee(amount) {
    return amount * 0.01;
  }
  
  // Estimar taxa de mineração para transação on-chain
  async estimateOnChainFee(satoshisPerByte = 10, inputCount = 1, outputCount = 2) {
    // Tamanho estimado da transação em bytes
    const txSize = (inputCount * 148) + (outputCount * 34) + 10;
    return txSize * satoshisPerByte;
  }
  
  // Estimar taxa de roteamento para Lightning Network
  async estimateLightningRoutingFee(amount) {
    // Taxas de roteamento são geralmente muito menores que on-chain
    // Estimativa simplificada: 0.1% ou 1 satoshi, o que for maior
    const routingFee = Math.max(amount * 0.001, 1);
    return routingFee;
  }
  
  // Registrar taxa coletada
  async recordFeeCollection(transactionId, amount, feeAmount, feeType) {
    return await db.feeRecords.create({
      transactionId,
      amount,
      feeAmount,
      feeType,
      timestamp: new Date()
    });
  }
  
  // Gerar relatório de taxas por período
  async generateFeeReport(startDate, endDate) {
    const feeRecords = await db.feeRecords.findAll({
      where: {
        timestamp: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    // Calcular totais por tipo de taxa
    const report = {
      platformFees: {
        count: 0,
        total: 0
      },
      miningFees: {
        count: 0,
        total: 0
      },
      routingFees: {
        count: 0,
        total: 0
      }
    };
    
    feeRecords.forEach(record => {
      report[record.feeType].count++;
      report[record.feeType].total += record.feeAmount;
    });
    
    return report;
  }
}
```

## Considerações de Segurança

1. **Proteção de Chaves API**:
   - Armazenar chaves de API em variáveis de ambiente seguras
   - Nunca expor chaves no frontend
   - Implementar rotação regular de chaves

2. **Validação de Webhooks**:
   - Verificar assinaturas digitais em webhooks
   - Implementar proteção contra replay attacks
   - Validar IPs de origem quando possível

3. **Proteção contra Ataques de Timing**:
   - Implementar verificações de tempo constante para comparações sensíveis
   - Evitar vazamento de informações através de tempos de resposta

4. **Monitoramento e Alertas**:
   - Implementar sistema de monitoramento para detectar anomalias
   - Configurar alertas para tentativas de pagamento suspeitas
   - Monitorar status do nó Lightning Network

## Próximos Passos

1. **Configuração do Ambiente de Desenvolvimento**:
   - Instalar e configurar BTCPay Server em ambiente de teste
   - Configurar nó Lightning Network para testes
   - Preparar ambiente de desenvolvimento com dependências necessárias

2. **Implementação do Backend**:
   - Desenvolver serviço Lightning Network
   - Implementar sistema de taxas
   - Criar endpoints de API

3. **Implementação do Frontend**:
   - Desenvolver componentes de interface para pagamentos Lightning
   - Integrar com WebLN para suporte a carteiras
   - Implementar feedback em tempo real para usuários

4. **Testes**:
   - Testar fluxo completo de pagamento em ambiente de teste
   - Verificar cálculo e aplicação corretos das taxas
   - Testar integração com múltiplos gateways

5. **Documentação e Implantação**:
   - Documentar APIs e componentes
   - Preparar guia de uso para usuários finais
   - Implantar em ambiente de produção
