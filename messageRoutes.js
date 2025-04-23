const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas protegidas
router.use(authMiddleware.protect);

// Rotas de mensagens
router.post('/', messageController.sendMessage);
router.get('/', messageController.getConversations);
router.get('/:conversation_id', messageController.getMessages);
router.put('/:id/read', messageController.markAsRead);

module.exports = router;
