const router = require("express").Router();
const Rating = require("../models/Rating");
const auth = require("../middleware/auth");

// Get all ratings
router.get("/", async (req, res) => {
  try {
    const ratings = await Rating.find().sort({ createdAt: -1 }).limit(20);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a rating
router.post("/", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const user = req.user;
    const newRating = new Rating({
      userId: user.id,
      userName: user.name || user.email,
      rating,
      comment
    });

    await newRating.save();
    res.json(newRating);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
