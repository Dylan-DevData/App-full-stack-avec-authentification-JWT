// models/todoModel.js — version ES Modules
// Rôle : toutes les requêtes SQL liées aux todos
// ⚠️ TOUTES les requêtes filtrent par user_id

import pool from '../db.js';

// ================== CREATE ==================
// Insère une todo pour un user donné
export const createTodo = async (userId, title) => {
  const query = `
    INSERT INTO todos (user_id, title)
    VALUES ($1, $2)
    RETURNING *
  `;
  const result = await pool.query(query, [userId, title]);
  return result.rows[0];
};

// ================== READ (toutes celles DU USER) ==================
export const getAllTodos = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE user_id = $1 ORDER BY id ASC',
    [userId]
  );
  return result.rows;
};

// ================== READ (une seule DU USER) ==================
export const getTodoById = async (userId, id) => {
  const result = await pool.query(
    'SELECT * FROM todos WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0];
};

// ================== UPDATE (seulement DU USER) ==================
export const updateTodo = async (userId, id, title, completed) => {
  const query = `
    UPDATE todos
    SET title = COALESCE($1, title),
        completed = COALESCE($2, completed)
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `;
  const result = await pool.query(query, [title, completed, id, userId]);
  return result.rows[0];
};

// ================== DELETE (seulement DU USER) ==================
export const deleteTodo = async (userId, id) => {
  const result = await pool.query(
    'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
    [id, userId]
  );
  return result.rows[0];
};