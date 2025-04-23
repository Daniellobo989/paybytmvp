require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const integrationRoutes = require('./routes/integrationRoutes');

// Inicializar app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/integration', integrationRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Autenticação Anônima do PayByt' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
