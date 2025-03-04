import express from "express";
import protect from "../middlewares/authMiddleware.js"
import { createNote, deleteNote, getNoteById, getNotes, searchNotes, updateNote } from "../controllers/notesController.js";

const router = express.Router();

router.post("/", protect, createNote);       // Create a note
router.get("/", protect, getNotes);          // Get all notes
router.get("/search", protect, searchNotes); // Search notes
router.get("/:id", protect, getNoteById);    // Get a single note
router.put("/:id", protect, updateNote);     // Update a note
router.delete("/:id", protect, deleteNote);  // Delete a note

export default router;