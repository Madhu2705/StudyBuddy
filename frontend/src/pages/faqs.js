import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
  {
    question: "How does AI generate my study plan?",
    answer:
      "AI analyzes your weak subjects, study hours, deadlines, and priorities to create a personalized timetable."
  },
  {
    question: "Can I edit my generated timetable?",
    answer:
      "Yes, you can manually update, reschedule, or delete tasks anytime from your dashboard."
  },
  {
    question: "How are weak subjects detected?",
    answer:
      "Weak subjects are detected based on your test scores and performance compared to your target score."
  },
  {
    question: "Can I add my own subjects and topics?",
    answer:
      "Yes, you can create unlimited subjects, topics, and tasks based on your syllabus."
  },
  {
    question: "Does the AI adjust my schedule automatically?",
    answer:
      "Yes, if you update deadlines or study hours, the AI can regenerate a new optimized plan."
  },
  {
    question: "Can I track my progress?",
    answer:
      "Yes, the analytics dashboard shows your task completion rate, subject performance, and improvement percentage."
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, your personal data and study records are stored securely and accessible only to your account."
  },
  {
    question: "Can I use this planner on mobile?",
    answer:
      "Yes, the AI Planner is responsive and works on mobile, tablet, and desktop devices."
  },
  {
    question: "What happens if I miss a task?",
    answer:
      "You can reschedule the missed task, and the AI can adjust your future timetable accordingly."
  },
  {
    question: "Is this planner suitable for competitive exams?",
    answer:
      "Yes, it is designed to help students preparing for school exams, college exams, and competitive exams."
  },
  {
    question: "Can I download my study plan?",
    answer:
      "Yes, you can export or download your generated study plan in PDF format (if enabled)."
  },
  {
    question: "Is this AI Planner free to use?",
    answer:
      "Basic features are free, and additional advanced AI features can be added in future versions."
  }
];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      {/* Navbar Added Here */}
      <Navbar />

      <div style={styles.container}>
        <h2 style={styles.heading}>Frequently Asked Questions</h2>

        {faqs.map((faq, index) => (
          <div key={index} style={styles.faqItem}>
            <div
              style={styles.question}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span style={styles.symbol}>
                {activeIndex === index ? "-" : "+"}
              </span>
            </div>

            <div
              style={{
                ...styles.answer,
                maxHeight: activeIndex === index ? "200px" : "0px",
                padding: activeIndex === index ? "15px" : "0 15px"
              }}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto 60px auto", // margin top increased because navbar
    padding: "20px"
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#1e293b"
  },
  faqItem: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "15px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },
  question: {
    backgroundColor: "#f1f5f9",
    padding: "15px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  symbol: {
    fontSize: "18px"
  },
  answer: {
    overflow: "hidden",
    transition: "all 0.4s ease",
    backgroundColor: "#ffffff"
  }
};
