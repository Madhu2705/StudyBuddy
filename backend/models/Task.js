const mongoose = require("mongoose");

module.exports = mongoose.model("Task", {
  userId: String,
  title: String,
  description: String,
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  deadline: Date,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  subtasks: [
    {
      title: String,
      completed: { type: Boolean, default: false }
    }
  ],
  linkedToSubject: String,
  linkedToTopic: String
});
