import mongoose from "mongoose";
import Note from "../models/note.js";

// Create a new note
export const createNote = async(req, res) => {
    try {
        const authenticatedUserId = req.user._id;
        const { title, content, color } = req.body;

        if( !content ) {
            return res.status(400).json({ error: "Missing note content!"});
        }

        // Validate color format (hex color code)
        if (color && !/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)) {
            return res.status(400).json({ error: "Invalid color format. Use hex format (#ffffff)." });
        }

        const note = await Note.create({ title, content, color, userId: authenticatedUserId })
        res.status(201).json(note);
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Error creating note" });
    }
}


// Get all notes for authenticated user with pagination
export const getNotes = async (req, res) => {
    try {
        // Get pagination parameters from the query or use defaults
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const page = parseInt(req.query.page) || 1; // Default page is 1

        // Calculate the number of notes to skip
        const skip = (page - 1) * limit;

        // Fetch notes for the authenticated user with pagination
        const notes = await Note.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip) // Skip the previous pages
            .limit(limit); // Limit the number of notes returned

        // Count total notes for the authenticated user
        const totalNotes = await Note.countDocuments({ userId: req.user._id });

        res.status(200).json({
            notes,
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit), // Total number of pages
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Error fetching notes" });
    }
};

//Get a single note by ID
export const getNoteById = async (req, res) => {
    try {

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid note ID format!" });
        }

        const note = await Note.findById(req.params.id);

        if (!note || note.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ error: "Note not found!" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ error: "Error fetching note" });
    }
};

//Update a note by ID
export const updateNote = async (req, res) => {
    try {
        const { title, content, color } = req.body;

         // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid note ID format!" });
        }

        if (!content) {
            return res.status(400).json({ error: "Missing note content!" });
        }

        // Validate color format (hex color code)
        if (color && !/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)) {
            return res.status(400).json({ error: "Invalid color format. Use hex format (#ffffff)." });
        }

        // Fetch existing note
        const existingNote = await Note.findOne({ _id: req.params.id, userId: req.user._id });

        if (!existingNote) {
            return res.status(404).json({ error: "Note not found!" });
        }

        // Update fields and keep existing color if not provided
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { 
                title: title ?? existingNote.title, 
                content, 
                color: color ?? existingNote.color 
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Error updating note" });
    }
};


//Delete a note by ID
export const deleteNote = async (req, res) => {
    try {

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid note ID format!" });
        }

        const note = await Note.findById(req.params.id);

        if (!note || note.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ error: "Note not found!" });
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note deleted successfully!" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Error deleting note" });
    }
};


// Search notes (by title or content) with pagination
export const searchNotes = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Search query is required!" });
        }

        // Get pagination parameters from the query or use defaults
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const page = parseInt(req.query.page) || 1; // Default page is 1

        // Calculate the number of notes to skip
        const skip = (page - 1) * limit;

        // Fetch matching notes for the authenticated user with pagination
        const notes = await Note.find({
            userId: req.user._id,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(skip) // Skip the previous pages
        .limit(limit); // Limit the number of notes returned

        // Count total matching notes for the authenticated user
        const totalNotes = await Note.countDocuments({
            userId: req.user._id,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { content: { $regex: query, $options: "i" } }
            ]
        });

        res.status(200).json({
            notes,
            totalNotes,
            totalPages: Math.ceil(totalNotes / limit), // Total number of pages
            currentPage: page,
        });
    } catch (error) {
        console.error("Error searching notes:", error);
        res.status(500).json({ error: "Error searching notes" });
    }
};




