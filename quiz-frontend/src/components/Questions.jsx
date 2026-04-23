import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";


const Questions = () => {
  const initialFormState = {
    category: "",
    difficultyLevel: "Easy",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    questionTitle: "",
    rightAnswer: "",
  };

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [formData, setFormData] = useState(initialFormState);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:8080/api/v1/question/allQuestions");
      setQuestions(response.data);
    } catch {
      setError("Unable to load questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!isAddModalOpen) {
      setSubmitSuccess("");
    }
  }, [isAddModalOpen]);

  const handleEdit = (id) => {
    console.log(id);
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleAddQuestion = () => {
    setSubmitError("");
    setSubmitSuccess("");
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsAddModalOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitNewQuestion = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const hasEmptyField = Object.values(formData).some((value) => !value.trim());
    if (hasEmptyField) {
      setSubmitError("Please fill in all fields before submitting.");
      return;
    }

    if (![formData.option1, formData.option2, formData.option3, formData.option4].includes(formData.rightAnswer)) {
      setSubmitError("Right answer must match one of the provided options.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("http://localhost:8080/api/v1/question/add", formData);
      setSubmitSuccess("Question added successfully.");
      setFormData(initialFormState);
      setIsAddModalOpen(false);
      await fetchQuestions();
    } catch (submitErr) {
      setSubmitError(submitErr?.response?.data?.message || "Unable to add question. Please try again.");
    } finally {
      setSubmitting(false);
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
      <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>Questions</h1>
      <p style={{ marginTop: "8px", marginBottom: "22px", color: "#94a3b8" }}>
        Browse all available quiz questions.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
        <button onClick={() => handleAddQuestion()} style={{ width: "13%", minWidth: "160px", height: "40px", background: "linear-gradient(135deg, #1d4ed8, #7c3aed)", color: "#e2e8f0", border: "none", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", fontWeight: 600, boxShadow: "0 10px 25px rgba(29, 78, 216, 0.25)" }}>Add Question <IoIosAddCircleOutline style={{ fontSize: "20px" }}/>
        </button>
      </div>
      {loading ? (
        <div style={{ color: "#94a3b8" }}>Loading questions...</div>
      ) : null}

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

      {!loading && !error && questions.length === 0 ? (
        <div style={{ color: "#94a3b8" }}>No questions found.</div>
      ) : null}

      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr style={{ background: "#0b1220" }}>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>ID</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Question</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Category</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Option 1</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Option 2</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Option 3</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Option 4</th>
                <th style={{ textAlign: "left", padding: "12px 14px", color: "#cbd5e1", fontSize: "13px" }}>Options</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={question.id} style={{ background: index % 2 === 0 ? "#111827" : "#0f172a" }}>
                  <td style={{ padding: "12px 14px", color: "#7dd3fc", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    #{question.id}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#e2e8f0", fontSize: "14px", borderTop: "1px solid #1f2937" }}>
                    {question.questionTitle}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#94a3b8", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    {question.category}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    {question.option1}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    {question.option2}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    {question.option3}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    {question.option4}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#cbd5e1", fontSize: "13px", borderTop: "1px solid #1f2937" }}>
                    <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => handleEdit(question.id)} style={{ width: "70px", height: "30px", backgroundColor: "#1e293b", color: "#cbd5e1", border: "none", borderRadius: "5px" }}>Edit</button>
                    <button onClick={() => handleDelete(question.id)} style={{ width: "70px", height: "30px", backgroundColor: "#1e293b", color: "#cbd5e1", border: "none", borderRadius: "5px" }}>Delete</button>
                    </div>
                 </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen ? (
        <div
          onClick={closeModal}
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
            onSubmit={handleSubmitNewQuestion}
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "min(720px, 100%)",
              background: "linear-gradient(160deg, #0b1220, #101a31 40%, #1f1a4d 100%)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 32px 80px rgba(2, 6, 23, 0.62), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "22px" }}>Create Question</h2>
                <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
                  Fill all required fields to add a new quiz question.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "999px",
                  border: "1px solid rgba(148, 163, 184, 0.32)",
                  background: "rgba(15, 23, 42, 0.82)",
                  color: "#cbd5e1",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
                disabled={submitting}
              >
                x
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Category
                <input name="category" value={formData.category} onChange={handleFormChange} placeholder="e.g. java" style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }} />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Difficulty
                <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleFormChange} style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }}>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </label>
              <label style={{ gridColumn: "1 / -1", display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Question Title
                <input name="questionTitle" value={formData.questionTitle} onChange={handleFormChange} placeholder="Enter question title" style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }} />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Option 1
                <input name="option1" value={formData.option1} onChange={handleFormChange} placeholder="Option 1" style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }} />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Option 2
                <input name="option2" value={formData.option2} onChange={handleFormChange} placeholder="Option 2" style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }} />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Option 3
                <input name="option3" value={formData.option3} onChange={handleFormChange} placeholder="Option 3" style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }} />
              </label>
              <label style={{ display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Option 4
                <input name="option4" value={formData.option4} onChange={handleFormChange} placeholder="Option 4" style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }} />
              </label>
              <label style={{ gridColumn: "1 / -1", display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" }}>
                Right Answer
                <select name="rightAnswer" value={formData.rightAnswer} onChange={handleFormChange} style={{ background: "rgba(15, 23, 42, 0.75)", color: "#e2e8f0", border: "1px solid rgba(148, 163, 184, 0.25)", borderRadius: "10px", padding: "11px 12px", outline: "none" }}>
                  <option value="">Select right answer</option>
                  <option value={formData.option1}>{formData.option1 || "Option 1"}</option>
                  <option value={formData.option2}>{formData.option2 || "Option 2"}</option>
                  <option value={formData.option3}>{formData.option3 || "Option 3"}</option>
                  <option value={formData.option4}>{formData.option4 || "Option 4"}</option>
                </select>
              </label>
            </div>

            {submitError ? (
              <p style={{ color: "#fecaca", margin: "12px 0 0 0", background: "#3f1d1d", borderRadius: "8px", padding: "10px 12px", fontSize: "13px" }}>
                {submitError}
              </p>
            ) : null}

            {submitSuccess ? (
              <p style={{ color: "#bbf7d0", margin: "12px 0 0 0", background: "#14532d", borderRadius: "8px", padding: "10px 12px", fontSize: "13px" }}>
                {submitSuccess}
              </p>
            ) : null}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                style={{
                  minWidth: "96px",
                  height: "40px",
                  border: "1px solid #334155",
                  background: "#0f172a",
                  color: "#cbd5e1",
                  borderRadius: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  minWidth: "140px",
                  height: "40px",
                  border: "none",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  color: "#e2e8f0",
                  borderRadius: "8px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  opacity: submitting ? 0.85 : 1,
                }}
              >
                {submitting ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Questions;