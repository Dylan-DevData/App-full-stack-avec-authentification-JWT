// app.js — version ES Modules
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';   // ← NOUVEAU

const app = express();

// ============ MIDDLEWARES ============
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ============ ROUTES ============
app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);                     // ← NOUVEAU

app.get('/', (req, res) => {
  res.json({ message: 'API Todo fonctionne 🚀' });
});

// ============ 404 ============
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ============ LANCEMENT ============
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${PORT}`);
});