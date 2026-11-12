// controllers/authController.js — version ES Modules
// Rôle : inscription + connexion (génération du JWT)

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as User from '../models/userModel.js';

// ================== REGISTER ==================
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe obligatoires' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum' });
    }

    // --- Vérifier si l'email existe déjà ---
    const existing = await User.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // --- Hash du mot de passe ---
    const passwordHash = await bcrypt.hash(password, 10);

    // --- Création ---
    const user = await User.createUser(email, passwordHash);

    // --- Générer un JWT pour connecter directement l'user ---
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe obligatoires' });
    }

    // --- Chercher l'user ---
    const user = await User.findUserByEmail(email);
    if (!user) {
      // ⚠️ Message GÉNÉRIQUE (ne pas dire "email inconnu")
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // --- Vérifier le mot de passe ---
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // --- Générer le JWT ---
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // --- Réponse (sans password_hash !) ---
    res.status(200).json({
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};