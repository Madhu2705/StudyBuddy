import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Ratings() {
  const nav = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!token) {
        alert("Please login to submit a rating");
        nav("/login");
        return;
      }

      if (!comment.trim()) {
        alert("Please write a comment");
        setLoading(false);
        return;
      }

      const res = await api.post("/rating", { rating, comment });
      setSubmitted(true);
      setComment("");
      setRating(5);

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to submit rating";
      alert(msg);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container rating-page">
        <h1>Share Your Experience</h1>
        <p className="subtitle">Help other students by sharing your feedback about StudyBuddy</p>

        <form onSubmit={handleSubmit} className="rating-form">
          <div className="form-group">
            <label>How would you rate StudyBuddy?</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${rating >= star ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
            <p className="rating-text">{rating} out of 5 stars</p>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Feedback</label>
            <textarea
              id="comment"
              placeholder="Share your experience, what did you like, what can be improved..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="6"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Rating"}
          </button>

          {submitted && (
            <div className="success-message">
              ✅ Thank you for your feedback! Your rating has been submitted.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
