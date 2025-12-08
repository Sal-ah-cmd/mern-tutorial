// backend/src/routes/notesRouter.js

import express from 'express';
import {
  getNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/').get(protect, getNotes).post(protect, createNote);

router
  .route('/:id')
  .get(getNoteById) 
  .put(protect, updateNote)
  .delete(protect, deleteNote);

export default router;