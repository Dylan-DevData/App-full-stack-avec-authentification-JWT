// routes/authRoutes.js — version ES Modules
// Rôle : URLs publiques d'authentification

import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register → inscription
router.post('/register', register);

// POST /auth/login → connexion
router.post('/login', login);

export default router;