// models/userModel.js — version ES Modules
// Rôle : requêtes SQL liées à la table users

import pool from '../db.js';

// ================== CREATE ==================
// Crée un utilisateur et renvoie id, email, created_at (JAMAIS password_hash)
export const createUser = async (email, passwordHash) => {
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
  `;
  const result = await pool.query(query, [email, passwordHash]);
  return result.rows[0];
};

// ================== FIND BY EMAIL ==================
// Trouve un utilisateur par email — on a besoin du password_hash pour le login
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];   // undefined si pas trouvé
};

// ================== FIND BY ID ==================
// Trouve un utilisateur par id — sans le password_hash (sécurité)
export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, email, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};