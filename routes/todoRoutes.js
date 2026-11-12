

import express from 'express';
import { createTodo  , getAllTodos ,getTodoById ,updateTodo,deleteTodo} from '../controllers/todocontroller.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';   

const router = express.Router();
// ⚠️ À PARTIR D'ICI, TOUTES LES ROUTES SONT PROTÉGÉES
router.use(authMiddleware);   // ← applique le middleware à TOUTES les routes suivantes

router.post('/',   createTodo);
router.get('/',    getAllTodos);
router.get('/:id', getTodoById);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;