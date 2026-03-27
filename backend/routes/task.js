const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all tasks for user
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, priority, deadline, subtasks, linkedToSubject, linkedToTopic } = req.body;
    
    const task = new Task({
      userId: req.user.id,
      title,
      description,
      priority: priority || "Medium",
      deadline: deadline ? new Date(deadline) : null,
      subtasks: subtasks || [],
      linkedToSubject,
      linkedToTopic,
      completed: false
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, priority, deadline, completed, subtasks, linkedToSubject, linkedToTopic } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      {
        title,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        completed,
        subtasks,
        linkedToSubject,
        linkedToTopic
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle task completion
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle subtask completion
router.patch("/:id/subtask/:subtaskId", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ error: "Subtask not found" });

    subtask.completed = !subtask.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
