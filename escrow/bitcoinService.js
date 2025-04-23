const bitcoin = require('bitcoinjs-lib');
const axios = require('axios');

// Configurar rede Bitcoin (mainnet, testnet, regtest)
const getNetwork = () => {
  const network = process.env.BITCOIN_NETWORK || 'testnet';
  
  switch (network) {
    case 'mainnet':
      return bitcoin.networks.bitcoin;
    case 'testnet':
      return bitcoin.networks.testnet;
    case 'regtest':
      return bitcoin.networks.regtest;
    default:
      return bitcoin.networks.testnet;
  }
};

// Criar endereço multisig 2-de-3
exports.createMultisigAddress = (buyerPubKey, sellerPubKey) => {
  const network = getNetwork();
  
  // Chave pública da plataforma (do .env)
  const platformPubKey = process.env.PLATFORM_PUBLIC_KEY;
  
  // Converter chaves públicas para Buffer
  const buyerPubKeyBuffer = Buffer.from(buyerPubKey, 'hex');
  const sellerPubKeyBuffer = Buffer.from(sellerPubKey, 'hex');
  const platformPubKeyBuffer = Buffer.from(platformPubKey, 'hex');
  
  // Criar script de resgate multisig 2-de-3
  const p2ms = bitcoin.payments.p2ms({
    m: 2, // Número de assinaturas necessárias
    pubkeys: [buyerPubKeyBuffer, sellerPubKeyBuffer, platformPubKeyBuffer].sort((a, b) => a.compare(b)),
    network
  });
  
  // Criar endereço P2SH a partir do script multisig
  const p2sh = bitcoin.payments.p2sh({
    redeem: p2ms,
    network
  });
  
  return {
    address: p2sh.address,
    redeemScript: p2ms.output.toString('hex'),
    buyerPubKey: buyerPubKey,
    sellerPubKey: sellerPubKey,
    platformPubKey: platformPubKey
  };
};

// Verificar saldo de endereço Bitcoin
exports.getAddressBalance = async (address) => {
  try {
    const network = process.env.BITCOIN_NETWORK === 'mainnet' ? 'main' : 'test3';
    const url = `https://api.blockcypher.com/v1/btc/${network}/addrs/${address}/balance`;
    
    const response = await axios.get(url);
    
    return {
      confirmed: response.data.balance,
      unconfirmed: response.data.unconfirmed_balance,
      total: response.data.final_balance
    };
  } catch (error) {
    console.error('Erro ao verificar saldo:', error);
    throw new Error('Falha ao verificar saldo do endereço Bitcoin');
  }
};

// Verificar status de transação
exports.checkTransactionStatus = async (txid) => {
  try {
    const network = process.env.BITCOIN_NETWORK === 'mainnet' ? 'main' : 'test3';
    const url = `https://api.blockcypher.com/v1/btc/${network}/txs/${txid}`;
    
    const response = await axios.get(url);
    
    return {
      confirmations: response.data.confirmations,
      blockHeight: response.data.block_height,
      fees: response.data.fees,
      status: response.data.confirmations >= 6 ? 'confirmed' : 'pending',
    };
  } catch (error) {
    console.error('Erro ao verificar transação:', error);
    throw new Error('Falha ao verificar status da transação Bitcoin');
  }
};

// Criar transação de liberação (simplificada para o MVP)
exports.createReleaseTransaction = (escrowUtxo, destinationAddress, feeRate = 10) => {
  // Nota: Esta é uma implementação simplificada para o MVP
  // Em um ambiente de produção, precisaríamos de mais detalhes e segurança
  
  const network = getNetwork();
  
  // Criar transação
  const txb = new bitcoin.TransactionBuilder(network);
  
  // Adicionar input (fundos do escrow)
  txb.addInput(escrowUtxo.txid, escrowUtxo.vout);
  
  // Calcular taxa (simplificado)
  const fee = Math.ceil(feeRate * 250 / 1000); // Estimativa de 250 bytes * taxa por KB
  
  // Adicionar output (endereço do vendedor)
  txb.addOutput(destinationAddress, escrowUtxo.value - fee);
  
  return txb;
};

// Assinar transação (simplificado para o MVP)
exports.signTransaction = (txb, index, privateKey, redeemScript, value) => {
  const network = getNetwork();
  const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
  
  txb.sign(index, keyPair, Buffer.from(redeemScript, 'hex'), null, value);
  
  return txb;
};

// Transmitir transação para a rede Bitcoin
exports.broadcastTransaction = async (txHex) => {
  try {
    const network = process.env.BITCOIN_NETWORK === 'mainnet' ? 'main' : 'test3';
    const url = `https://api.blockcypher.com/v1/btc/${network}/txs/push`;
    
    const response = await axios.post(url, {
      tx: txHex
    });
    
    return {
      txid: response.data.tx.hash,
      success: true
    };
  } catch (error) {
    console.error('Erro ao transmitir transação:', error);
    throw new Error('Falha ao transmitir transação para a rede Bitcoin');
  }
};
