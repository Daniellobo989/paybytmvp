const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rotas protegidas
router.use(authMiddleware.protect);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/setup-2fa', userController.setup2FA);
router.post('/verify-2fa', userController.verify2FASetup);
router.get('/:userId/reputation', userController.getUserReputation);

module.exports = router;
