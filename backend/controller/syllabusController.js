const Syllabus = require("../models/Syllabus");

exports.addSyllabus = async (req, res) => {
  try {
    const { subject, topic, notes } = req.body;
    const userId = req.user.id;

    const syllabus = await Syllabus.create({
      userId,
      subject,
      topic,
      notes,
    });

    res.json(syllabus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSyllabus = async (req, res) => {
  try {
    const userId = req.user.id;
    const syllabus = await Syllabus.find({ userId }).sort({ createdAt: -1 });
    res.json(syllabus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, topic, notes } = req.body;

    const syllabus = await Syllabus.findByIdAndUpdate(
      id,
      { subject, topic, notes },
      { new: true }
    );

    res.json(syllabus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    await Syllabus.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
