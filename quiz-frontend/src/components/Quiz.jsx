import React, { useEffect, useState } from "react";
import axios from "axios";

const Quiz = () => {
  const initialCreateQuizForm = {
    category: "",
    numQ: "",
    title: "",
  };

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizQuestionsLoading, setQuizQuestionsLoading] = useState(false);
  const [quizQuestionsError, setQuizQuestionsError] = useState("");
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [createQuizError, setCreateQuizError] = useState("");
  const [createQuizForm, setCreateQuizForm] = useState(initialCreateQuizForm);

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

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2600);
    return () => clearTimeout(timer);
  }, [successMessage]);

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

  const openCreateQuizModal = () => {
    setCreateQuizError("");
    setCreateQuizForm(initialCreateQuizForm);
    setIsCreateQuizModalOpen(true);
  };

  const closeCreateQuizModal = () => {
    if (creatingQuiz) return;
    setIsCreateQuizModalOpen(false);
  };

  const handleCreateQuizFormChange = (event) => {
    const { name, value } = event.target;
    setCreateQuizForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateQuiz = async (event) => {
    event.preventDefault();
    setCreateQuizError("");

    const { category, numQ, title } = createQuizForm;
    if (!category.trim() || !numQ || !title.trim()) {
      setCreateQuizError("Please fill in category, number of questions, and quiz title.");
      return;
    }

    const totalQuestions = Number(numQ);
    if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) {
      setCreateQuizError("Number of questions must be a positive whole number.");
      return;
    }

    try {
      setCreatingQuiz(true);
      await axios.post("http://localhost:8080/api/v1/quiz/create", null, {
        params: {
          category: category.trim(),
          numQ: totalQuestions,
          title: title.trim(),
        },
      });
      setIsCreateQuizModalOpen(false);
      setSuccessMessage("Quiz created successfully.");
      await fetchAllQuizzes();
    } catch (createErr) {
      setCreateQuizError(createErr?.response?.data?.message || "Unable to create quiz.");
    } finally {
      setCreatingQuiz(false);
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
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
        <button
          onClick={openCreateQuizModal}
          style={{
            minWidth: "150px",
            height: "40px",
            border: "1px solid rgba(191, 219, 254, 0.25)",
            background: "linear-gradient(135deg, #2563eb, #7c3aed 55%, #db2777)",
            color: "#f8fafc",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: 700,
            boxShadow: "0 14px 28px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.22)",
          }}
        >
          Create Quiz
        </button>
      </div>

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

      {successMessage ? (
        <div
          style={{
            background: "linear-gradient(135deg, #14532d, #166534)",
            color: "#dcfce7",
            padding: "12px 14px",
            borderRadius: "10px",
            marginBottom: "14px",
            border: "1px solid rgba(134, 239, 172, 0.35)",
            boxShadow: "0 12px 24px rgba(20, 83, 45, 0.28)",
          }}
        >
          {successMessage}
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

      {isCreateQuizModalOpen ? (
        <div
          onClick={closeCreateQuizModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "radial-gradient(circle at top, rgba(59, 130, 246, 0.14), rgba(2, 6, 23, 0.88) 55%)",
            backdropFilter: "blur(7px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleCreateQuiz}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(520px, 100%)",
              background: "linear-gradient(160deg, #0b1220, #101a31 40%, #1f1a4d 100%)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              borderRadius: "20px",
              padding: "22px",
              boxShadow: "0 32px 80px rgba(2, 6, 23, 0.62)",
            }}
          >
            <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "22px" }}>Create Quiz</h2>
            <p style={{ margin: "6px 0 14px 0", color: "#94a3b8", fontSize: "13px" }}>
              Add category, number of questions, and quiz title.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Category
                <input
                  name="category"
                  value={createQuizForm.category}
                  onChange={handleCreateQuizFormChange}
                  placeholder="e.g. java"
                  style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }}
                />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Number of Questions
                <input
                  name="numQ"
                  type="number"
                  min="1"
                  value={createQuizForm.numQ}
                  onChange={handleCreateQuizFormChange}
                  placeholder="e.g. 5"
                  style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }}
                />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Quiz Title
                <input
                  name="title"
                  value={createQuizForm.title}
                  onChange={handleCreateQuizFormChange}
                  placeholder="e.g. JQuiz"
                  style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }}
                />
              </label>
            </div>

            {createQuizError ? (
              <p style={{ color: "#fecaca", margin: "12px 0 0 0", background: "#3f1d1d", borderRadius: "8px", padding: "10px 12px", fontSize: "13px" }}>
                {createQuizError}
              </p>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={closeCreateQuizModal}
                disabled={creatingQuiz}
                style={{
                  minWidth: "96px",
                  height: "40px",
                  border: "1px solid rgba(148, 163, 184, 0.36)",
                  background: "linear-gradient(180deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))",
                  color: "#dbeafe",
                  borderRadius: "10px",
                  cursor: creatingQuiz ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creatingQuiz}
                style={{
                  minWidth: "126px",
                  height: "40px",
                  border: "1px solid rgba(216, 180, 254, 0.3)",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed 55%, #db2777)",
                  color: "#f8fafc",
                  borderRadius: "10px",
                  cursor: creatingQuiz ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  opacity: creatingQuiz ? 0.85 : 1,
                }}
              >
                {creatingQuiz ? "Creating..." : "Create Quiz"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Quiz;