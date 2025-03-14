const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser"); // Assuming fetchUser is in middleware folder
const Remainders = require("../models/Remainders");
const { body, validationResult } = require("express-validator");



// Route to fetch all remainders for a user
router.get("/fetchallremainders", fetchUser, async (req, res) => {
  try {
    console.log("Fetching remainders for user ID:", req.user.id);
    const remainders = await Remainders.find({ user: req.user.id });
    res.json(remainders);
  } catch (error) {
    console.error("Error fetching remainders:", error.message);
    res.status(500).json({ error: "Server error 500" });
  }
});

// Route to create a new remainder
router.post(
  "/createremainder",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("deadline", "Enter a valid deadline").isISO8601(),
  ],
  async (req, res) => {
    try {
      const { title, deadline } = req.body;
      console.log("Received data:", { title, deadline });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
      const remainder = new Remainders({
        title,
        deadline,
        user: req.user.id,
      });
      const savedRemainder = await remainder.save();
      console.log("Saved Remainder:", savedRemainder);
      res.json(savedRemainder);
    } catch (error) {
      console.error("Error saving remainder:", error.message);
      res.status(500).json({ error: "Server error 500" });
    }
  }
);



// Route to update a remainder
router.put(
  "/updateremainder/:id",
  fetchUser,
  [
    body("title", "Enter a valid title").optional().isLength({ min: 3 }),
    body("deadline", "Enter a valid deadline").optional().isISO8601(),
    body("completed", "Completed must be a boolean").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const { title, deadline, completed } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Build update object
      const updatedRemainder = {};
      if (title) updatedRemainder.title = title;
      if (deadline) updatedRemainder.deadline = deadline;
      if (completed !== undefined) updatedRemainder.completed = completed;

      // Find and update 
      let existingRemainder = await Remainders.findById(req.params.id);
      if (!existingRemainder) {
        return res.status(404).json({ error: "Remainder not found" });
      }
      if (existingRemainder.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Not allowed" });
      }
      const remainderUpdated = await Remainders.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRemainder },
        { new: true }
      );
      res.json(remainderUpdated);
    } catch (error) {
      console.error("Error updating remainder:", error.message);
      res.status(500).json({ error: "Server error 500" });
    }
  }
);

// Route to delete a remainder
router.delete(
  "/deleteremainder/:id",
  fetchUser,
  async (req, res) => {
    try {
      //Check if Reminder Exists:
      const existingRemainder = await Remainders.findById(req.params.id);
      //Check if Reminder Exists:
      if (!existingRemainder) {
        return res.status(404).json({ error: "Remainder not found" });
      }
      //This check ensures that the user attempting to delete the reminder is the owner of that reminder.
      if (existingRemainder.user.toString() !== req.user.id) {
        return res.status(401).json({ error: "Not allowed" });
      }
      //If the reminder exists and the user is authorized, this line deletes the reminder from the database.
      await Remainders.findByIdAndDelete(req.params.id); // Simplified deletion
      // After successfully deleting the reminder, the server responds with a JSON object containing a success message.
      return res.json({ message: "Successfully deleted" });
    } catch (error) {
      //Error Handling:
      console.error("Error deleting remainder:", error.message);
      res.status(500).json({ error: "Server error 500" });
    }
  }
);
//

module.exports = router;
