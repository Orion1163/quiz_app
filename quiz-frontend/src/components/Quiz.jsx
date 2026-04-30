import React, { useEffect, useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizQuestionsLoading, setQuizQuestionsLoading] = useState(false);
  const [quizQuestionsError, setQuizQuestionsError] = useState("");

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

  const fetchQuizQuestions = async (quiz) => {
    try {
      setSelectedQuiz(quiz);
      setQuizQuestionsLoading(true);
      setQuizQuestionsError("");
      const response = await axios.get(`http://localhost:8080/api/v1/quiz/get/${quiz.id}`);
      setQuizQuestions(response.data || []);
    } catch {
      setQuizQuestions([]);
      setQuizQuestionsError("Unable to load quiz questions.");
    } finally {
      setQuizQuestionsLoading(false);
    }
  };

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
            <button
              key={quiz.id}
              onClick={() => fetchQuizQuestions(quiz)}
              style={{
                textAlign: "left",
                background: "linear-gradient(155deg, #111827, #1e293b 58%, #312e81)",
                border: "1px solid rgba(148, 163, 184, 0.24)",
                borderRadius: "14px",
                padding: "14px",
                boxShadow: "0 14px 30px rgba(2, 6, 23, 0.28)",
                cursor: "pointer",
                color: "inherit",
              }}
            >
              <p style={{ margin: 0, color: "#93c5fd", fontSize: "12px", fontWeight: 600 }}>Quiz ID</p>
              <p style={{ margin: "3px 0 10px 0", color: "#f8fafc", fontSize: "16px", fontWeight: 700 }}>
                #{quiz.id}
              </p>
              <p style={{ margin: 0, color: "#cbd5e1", fontSize: "12px", fontWeight: 600 }}>Title</p>
              <p style={{ margin: "3px 0 0 0", color: "#e2e8f0", fontSize: "15px" }}>{quiz.title}</p>
              <p style={{ margin: "10px 0 0 0", color: "#a5b4fc", fontSize: "12px", fontWeight: 600 }}>Click to view quiz</p>
            </button>
          ))}
        </div>
      ) : null}

      {selectedQuiz ? (
        <div
          style={{
            marginTop: "20px",
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: "14px",
            padding: "16px",
          }}
        >
          <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "20px" }}>
            {selectedQuiz.title} - Questions
          </h2>
          <p style={{ margin: "6px 0 16px 0", color: "#94a3b8", fontSize: "13px" }}>
            Quiz #{selectedQuiz.id}
          </p>

          {quizQuestionsLoading ? <div style={{ color: "#94a3b8" }}>Loading quiz questions...</div> : null}

          {quizQuestionsError ? (
            <div
              style={{
                background: "#3f1d1d",
                color: "#fecaca",
                padding: "12px 14px",
                borderRadius: "10px",
              }}
            >
              {quizQuestionsError}
            </div>
          ) : null}

          {!quizQuestionsLoading && !quizQuestionsError && quizQuestions.length === 0 ? (
            <div style={{ color: "#94a3b8" }}>No questions found for this quiz.</div>
          ) : null}

          {!quizQuestionsLoading && !quizQuestionsError && quizQuestions.length > 0 ? (
            <div style={{ display: "grid", gap: "12px" }}>
              {quizQuestions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    background: "linear-gradient(155deg, #0f172a, #1e293b)",
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    borderRadius: "12px",
                    padding: "14px",
                  }}
                >
                  <p style={{ margin: 0, color: "#93c5fd", fontSize: "12px", fontWeight: 600 }}>
                    Question {index + 1}
                  </p>
                  <p style={{ margin: "6px 0 12px 0", color: "#f8fafc", fontSize: "15px", fontWeight: 600 }}>
                    {question.questionTitle}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
                    <div style={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "13px" }}>A. {question.option1}</div>
                    <div style={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "13px" }}>B. {question.option2}</div>
                    <div style={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "13px" }}>C. {question.option3}</div>
                    <div style={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: "8px", padding: "8px 10px", color: "#cbd5e1", fontSize: "13px" }}>D. {question.option4}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Quiz;