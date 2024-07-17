const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Server error 500" });
  }
});

router.post(
  "/createnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await notes.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).json({ error: "Server error 500" });
    }
  }
);

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const notes = {};
    if (title) {
      notes.title = title;
    }
    if (description) {
      notes.description = description;
    }
    if (tag) {
      notes.tag = tag;
    }

    const existingNote = await Notes.findById(req.params.id);
    if (!existingNote) return res.status(404).json({ error: "Note not Found" });
    if (existingNote.user.toString() !== req.user.id)
      return res.status(401).json({ error: "Unauthorise" });

    const noteUpdated = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: notes },
      { new: true }
    );
    res.json(noteUpdated);
  } catch (error) {
    res.status(500).json({ error: "Server error 500" });
  }
});

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const notes = {};

    const existingNote = await Notes.findById(req.params.id);
    if (!existingNote) return res.status(404).json({ error: "Note not Found" });
    if (existingNote.user.toString() !== req.user.id)
      return res.status(401).json({ error: "Unauthorise" });

    const notedeleted = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error 500" });
  }
});

module.exports = router;
