// controllers/todoController.js — version ES Modules
// Rôle : logique métier des todos, filtrée par user

import * as Todo from '../models/todoModel.js';

// ================== CREATE ==================
export const createTodo = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Le champ title est obligatoire' });
    }

    // req.user.id vient du middleware auth ✅
    const newTodo = await Todo.createTodo(req.user.id, title.trim());
    res.status(201).json(newTodo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ================== READ (toutes celles DU USER) ==================
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.getAllTodos(req.user.id);
    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ================== READ (une seule DU USER) ==================
export const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.getTodoById(req.user.id, id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo non trouvée' });
    }
    res.status(200).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ================== UPDATE ==================
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'title ne peut pas être vide' });
    }

    const updated = await Todo.updateTodo(
      req.user.id,
      id,
      title !== undefined ? title.trim() : null,
      completed !== undefined ? completed : null
    );

    if (!updated) {
      return res.status(404).json({ error: 'Todo non trouvée' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ================== DELETE ==================
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.deleteTodo(req.user.id, id);

    if (!deleted) {
      return res.status(404).json({ error: 'Todo non trouvée' });
    }
    res.status(200).json({ message: 'Todo supprimée', todo: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};