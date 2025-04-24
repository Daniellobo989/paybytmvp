# Manual do Usuário - Integração Lightning Network PayByt

## Introdução

Bem-vindo ao manual do usuário da integração Lightning Network do PayByt! Este manual explica como utilizar os novos recursos de pagamento via Lightning Network, verificação de entrega e sistema de taxas implementados no marketplace PayByt.

## O que é Lightning Network?

Lightning Network é uma solução de segunda camada para o Bitcoin que permite transações instantâneas e com taxas extremamente baixas. Ao contrário das transações Bitcoin tradicionais (on-chain), que podem levar minutos ou horas para serem confirmadas, as transações Lightning são confirmadas em segundos.

## Recursos Principais

- **Pagamentos Lightning Network**: Transações rápidas e com baixas taxas
- **Verificação Automática de Entrega**: Confirmação segura de entregas físicas e digitais
- **Sistema de Taxas Transparente**: Taxa fixa de 1% da plataforma

## Como Realizar um Pagamento via Lightning Network

### Para Compradores

1. **Selecione um produto** no marketplace PayByt
2. No checkout, escolha **"Pagar com Lightning Network"**
3. O sistema gerará uma **fatura Lightning** com um QR code
4. Abra sua **carteira Lightning** (como Wallet of Satoshi, Muun, Phoenix, etc.)
5. Escaneie o QR code ou copie o código de pagamento
6. Confirme o pagamento na sua carteira
7. A página de checkout será atualizada automaticamente quando o pagamento for confirmado

### Para Vendedores

1. Quando um comprador paga com Lightning Network, você receberá uma **notificação**
2. O valor ficará em **escrow** até a confirmação da entrega
3. Para produtos físicos, **registre o código de rastreio** no sistema
4. Para produtos digitais, **envie a chave de ativação ou link de download**
5. Quando a entrega for confirmada, os fundos serão **liberados automaticamente**

## Verificação de Entrega

### Produtos Físicos

1. O vendedor registra o **código de rastreio** e a **transportadora**
2. O sistema monitora automaticamente o status da entrega
3. Quando a entrega é confirmada, os fundos são liberados para o vendedor
4. Alternativamente, o entregador pode escanear um **QR code de confirmação** no momento da entrega

### Produtos Digitais

1. O vendedor envia a **chave de ativação** ou **link de download** via plataforma
2. O comprador confirma o recebimento clicando em **"Confirmar Recebimento"**
3. Se o comprador não confirmar em 7 dias, o sistema confirma automaticamente
4. Para produtos que exigem prova de abertura, o sistema registra uma **prova criptográfica** no IPFS

## Sistema de Taxas

O PayByt cobra uma taxa fixa de **1% sobre o valor da transação**. Esta taxa é transparente e é exibida durante o checkout.

### Composição da Taxa

- **Taxa da Plataforma**: 1% do valor da transação
- **Taxa de Rede**: Varia conforme o método de pagamento
  - Lightning Network: Aproximadamente 0.1% (muito baixa)
  - Bitcoin on-chain: Varia conforme o congestionamento da rede

### Exemplo de Cálculo

Para uma compra de 0.01 BTC:
- Taxa da Plataforma (1%): 0.0001 BTC
- Taxa de Rede Lightning (aproximada): 0.00001 BTC
- Total de Taxas: 0.00011 BTC
- Valor Total: 0.01011 BTC

## Perguntas Frequentes

### Como criar uma carteira Lightning Network?

Recomendamos as seguintes carteiras Lightning Network:
- [Wallet of Satoshi](https://www.walletofsatoshi.com/) (mais fácil para iniciantes)
- [Phoenix](https://phoenix.acinq.co/) (boa segurança e facilidade de uso)
- [Muun](https://muun.com/) (suporta tanto Bitcoin on-chain quanto Lightning)
- [Breez](https://breez.technology/) (recursos avançados)

### O que fazer se o pagamento Lightning falhar?

1. Verifique sua conexão com a internet
2. Certifique-se de que sua carteira tem saldo suficiente
3. Tente novamente ou escolha "Gerar Nova Fatura"
4. Se o problema persistir, tente usar outra carteira Lightning

### Como saber se meu pagamento foi confirmado?

A página de checkout será atualizada automaticamente quando o pagamento for confirmado. Você também receberá uma notificação por e-mail.

### Como funciona a verificação de entrega?

Para produtos físicos, o sistema monitora automaticamente o código de rastreio. Para produtos digitais, o comprador confirma o recebimento ou o sistema confirma automaticamente após 7 dias.

### O que acontece se a entrega não for confirmada?

Se houver problemas com a entrega, o comprador pode abrir uma disputa. Um mediador analisará o caso e decidirá se os fundos devem ser liberados para o vendedor ou devolvidos ao comprador.

### Como são utilizadas as taxas da plataforma?

As taxas da plataforma são distribuídas da seguinte forma:
- 40% para operações da plataforma
- 30% para desenvolvimento contínuo
- 20% para segurança e auditorias
- 10% para a comunidade

## Suporte

Se você tiver dúvidas ou problemas, entre em contato com nossa equipe de suporte:

- E-mail: suporte@paybyt.com
- Chat: Disponível no site
- Telegram: @PayBytSupport

## Glossário

- **Lightning Network**: Solução de segunda camada para Bitcoin que permite transações rápidas e baratas
- **BOLT11**: Formato padrão para faturas Lightning Network
- **Escrow**: Sistema de custódia que protege tanto o comprador quanto o vendedor
- **Oráculo**: Sistema que verifica informações do mundo real e as transmite para o blockchain
- **IPFS**: Sistema de armazenamento distribuído usado para armazenar provas de entrega
- **Satoshi**: A menor unidade do Bitcoin (1 BTC = 100.000.000 satoshis)
