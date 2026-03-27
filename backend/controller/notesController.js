const Notes = require("../models/Notes");

exports.createNotes = async (req, res) => {
  try {
    const { title, content, category, color } = req.body;
    const userId = req.user.id;

    const notes = await Notes.create({
      userId,
      title,
      content,
      category,
      color: color || "#FFF9E6",
    });

    res.json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Notes.find({ userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, color } = req.body;

    const notes = await Notes.findByIdAndUpdate(
      id,
      { title, content, category, color, updatedAt: Date.now() },
      { new: true }
    );

    res.json(notes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteNotes = async (req, res) => {
  try {
    const { id } = req.params;
    await Notes.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
