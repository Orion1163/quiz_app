import React, { useEffect, useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAllQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:8080/api/v1/quiz/getallquizzes");
      setQuizzes(response.data || []);
    } catch {
      setError("Unable to load quizzes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllQuizzes();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        padding: "clamp(16px, 3vw, 28px)",
        paddingTop: "clamp(64px, 9vw, 28px)",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>Quizzes</h1>
      <p style={{ marginTop: "8px", marginBottom: "20px", color: "#94a3b8" }}>
        Browse all created quizzes.
      </p>

      {loading ? <div style={{ color: "#94a3b8" }}>Loading quizzes...</div> : null}

      {error ? (
        <div
          style={{
            background: "#3f1d1d",
            color: "#fecaca",
            padding: "12px 14px",
            borderRadius: "10px",
            marginBottom: "14px",
          }}
        >
          {error}
        </div>
      ) : null}

      {!loading && !error && quizzes.length === 0 ? (
        <div style={{ color: "#94a3b8" }}>No quizzes found.</div>
      ) : null}

      {!loading && !error && quizzes.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              style={{
                background: "linear-gradient(155deg, #111827, #1e293b 58%, #312e81)",
                border: "1px solid rgba(148, 163, 184, 0.24)",
                borderRadius: "14px",
                padding: "14px",
                boxShadow: "0 14px 30px rgba(2, 6, 23, 0.28)",
              }}
            >
              <p style={{ margin: 0, color: "#93c5fd", fontSize: "12px", fontWeight: 600 }}>Quiz ID</p>
              <p style={{ margin: "3px 0 10px 0", color: "#f8fafc", fontSize: "16px", fontWeight: 700 }}>
                #{quiz.id}
              </p>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "12px", fontWeight: 600 }}>Title</p>
              <p style={{ margin: "3px 0 0 0", color: "#e2e8f0", fontSize: "15px" }}>{quiz.title}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Quiz;