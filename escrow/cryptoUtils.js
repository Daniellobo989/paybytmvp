const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Gerar token JWT
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Criptografar mensagem
exports.encryptMessage = (message, recipientPublicKey) => {
  const algorithm = 'aes-256-gcm';
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  
  // Criptografar a mensagem com AES
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  // Criptografar a chave simétrica com a chave pública do destinatário
  // Nota: Em um ambiente de produção, usaríamos a chave pública real do destinatário
  // Para o MVP, usamos uma abordagem simplificada
  const encryptedKey = key.toString('hex'); // Simplificado para o MVP
  
  return {
    encryptedMessage: encrypted,
    iv: iv.toString('hex'),
    encryptedKey: encryptedKey,
    authTag: authTag.toString('hex')
  };
};

// Descriptografar mensagem
exports.decryptMessage = (encryptedData) => {
  const algorithm = 'aes-256-gcm';
  
  // Descriptografar a chave simétrica
  // Nota: Em um ambiente de produção, usaríamos a chave privada do usuário
  // Para o MVP, usamos uma abordagem simplificada
  const key = Buffer.from(encryptedData.encryptedKey, 'hex');
  
  // Descriptografar a mensagem com AES
  const decipher = crypto.createDecipheriv(
    algorithm, 
    key, 
    Buffer.from(encryptedData.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData.encryptedMessage, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Gerar ID de conversa único
exports.generateConversationId = (userId1, userId2) => {
  // Ordenar IDs para garantir que a mesma conversa tenha o mesmo ID independente de quem inicia
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return crypto.createHash('sha256').update(`${sortedIds[0]}-${sortedIds[1]}`).digest('hex');
};

// Gerar hash para endereço de envio
exports.hashShippingAddress = (address) => {
  return crypto.createHash('sha256').update(JSON.stringify(address)).digest('hex');
};
