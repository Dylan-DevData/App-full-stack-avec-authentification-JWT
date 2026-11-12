// middlewares/authMiddleware.js — version ES Modules
// Rôle : vérifier le JWT et injecter req.user si valide

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;

    // 2. Vérifier qu'il existe et commence par "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    // 3. Extraire le token (enlever "Bearer " au début)
    const token = authHeader.split(' ')[1];

    // 4. Vérifier le token (signature + expiration)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Injecter les infos dans req.user
    req.user = { id: decoded.id, email: decoded.email };

    // 6. Passer à la route suivante
    next();
  } catch (err) {
    // jwt.verify lance une erreur si :
    // - signature invalide
    // - token expiré
    // - token malformé
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré, reconnecte-toi' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};