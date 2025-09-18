// server/routes/notes_route.js

const express = require("express");
const router = express.Router();
const Note = require("../models/note_model");
const { attachUser } = require("../middleware/auth_middleware");

// Create a new note
router.post("/", attachUser, async (req, res) => {
  try {
    const { title, message, latitude, longitude, image, isDone } = req.body;
    const userId = req.user.id;

    const newNote = await Note.create({
      title,
      message,
      latitude,
      longitude,
      image,
      isDone: isDone || false,
      user_id: userId,
    });

    // Fetch the note with the associated user data for the notification
    const populatedNote = await Note.findByPk(newNote.id, {
      include: ["User"],
    });

    // Get the socket.io instance and emit a real-time event
    const io = req.app.get("io");
    if (io) {
      // Emit 'new_note' event to all connected clients
      io.emit("new_note", populatedNote);
    }

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note." });
  }
});

// Get all notes (pending and done)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.findAll({
      include: ["User"],
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes." });
  }
});

// Update a note (e.g., mark as done)
router.put("/:id", attachUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { isDone, title, message } = req.body;

    const note = await Note.findByPk(id);

    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    note.title = title || note.title;
    note.message = message || note.message;
    note.isDone = isDone !== undefined ? isDone : note.isDone;

    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note." });
  }
});

// Delete a note
router.delete("/:id", attachUser, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.destroy({ where: { id } });

    if (deleted) {
      res.status(204).send("Note deleted successfully.");
    } else {
      res.status(404).json({ error: "Note not found." });
    }
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note." });
  }
});

module.exports = router;
