// backend/src/routes/notesRouter.js

import express from 'express';
import {
  getAllNotes, 
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();
router.route('/')
  .get(protect, getAllNotes)
  .post(protect, createNote);

router
  .route('/:id')
  .get(getNoteById) 
  .put(protect, updateNote)
  .delete(protect, deleteNote);

export default router;