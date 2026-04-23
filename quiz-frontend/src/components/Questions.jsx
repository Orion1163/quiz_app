import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoChevronDown } from "react-icons/io5";


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
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const fieldLabelStyle = { display: "grid", gap: "6px", color: "#cbd5e1", fontSize: "13px" };
  const fieldStyle = {
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.75))",
    color: "#e2e8f0",
    border: "1px solid rgba(148, 163, 184, 0.32)",
    borderRadius: "12px",
    padding: "11px 12px",
    outline: "none",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
  };
  const selectShellStyle = {
    position: "relative",
    display: "grid",
    alignItems: "center",
  };
  const tableActionButtonStyle = {
    minWidth: "78px",
    height: "32px",
    border: "1px solid rgba(148, 163, 184, 0.28)",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(2, 6, 23, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
  };

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

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2600);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleEdit = (id) => {
    const questionToEdit = questions.find((question) => question.id === id);
    if (!questionToEdit) return;

    setSubmitError("");
    setSubmitSuccess("");
    setEditingQuestionId(id);
    setFormData({
      category: questionToEdit.category || "",
      difficultyLevel: questionToEdit.difficultyLevel || "Easy",
      option1: questionToEdit.option1 || "",
      option2: questionToEdit.option2 || "",
      option3: questionToEdit.option3 || "",
      option4: questionToEdit.option4 || "",
      questionTitle: questionToEdit.questionTitle || "",
      rightAnswer: questionToEdit.rightAnswer || "",
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log(id);
  };

  const handleAddQuestion = () => {
    setSubmitError("");
    setSubmitSuccess("");
    setEditingQuestionId(null);
    setFormData(initialFormState);
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setIsAddModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitQuestion = async (event) => {
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
      if (editingQuestionId) {
        await axios.put(`http://localhost:8080/api/v1/question/update/${editingQuestionId}`, formData);
        setSubmitSuccess("Question updated successfully.");
        setSuccessMessage("Question updated successfully.");
      } else {
        await axios.post("http://localhost:8080/api/v1/question/add", formData);
        setSubmitSuccess("Question added successfully.");
        setSuccessMessage("Question added successfully.");
      }
      setFormData(initialFormState);
      setIsAddModalOpen(false);
      setEditingQuestionId(null);
      await fetchQuestions();
    } catch (submitErr) {
      setSubmitError(submitErr?.response?.data?.message || "Unable to save question. Please try again.");
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
        <button onClick={() => handleAddQuestion()} style={{ width: "13%", minWidth: "170px", height: "42px", background: "linear-gradient(135deg, #2563eb, #7c3aed 55%, #db2777)", color: "#f8fafc", border: "1px solid rgba(191, 219, 254, 0.25)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", cursor: "pointer", fontWeight: 700, letterSpacing: "0.2px", boxShadow: "0 14px 28px rgba(59, 130, 246, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.22)" }}>Add Question <IoIosAddCircleOutline style={{ fontSize: "20px" }}/>
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
                    <button onClick={() => handleEdit(question.id)} style={{ ...tableActionButtonStyle, background: "linear-gradient(135deg, rgba(37, 99, 235, 0.4), rgba(124, 58, 237, 0.4))" }}>Edit</button>
                    <button onClick={() => handleDelete(question.id)} style={{ ...tableActionButtonStyle, background: "linear-gradient(135deg, rgba(190, 24, 93, 0.45), rgba(239, 68, 68, 0.35))" }}>Delete</button>
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
            onSubmit={handleSubmitQuestion}
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
                <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "22px" }}>{editingQuestionId ? "Edit Question" : "Create Question"}</h2>
                <p style={{ margin: "6px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
                  {editingQuestionId ? "Update the required fields to save changes." : "Fill all required fields to add a new quiz question."}
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
              <label style={fieldLabelStyle}>
                Category
                <input name="category" value={formData.category} onChange={handleFormChange} placeholder="e.g. java" style={fieldStyle} />
              </label>
              <label style={fieldLabelStyle}>
                Difficulty
                <div style={selectShellStyle}>
                  <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleFormChange} style={{ ...fieldStyle, appearance: "none", paddingRight: "38px", cursor: "pointer" }}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                  <IoChevronDown style={{ position: "absolute", right: "12px", color: "#93c5fd", pointerEvents: "none", fontSize: "16px" }} />
                </div>
              </label>
              <label style={{ ...fieldLabelStyle, gridColumn: "1 / -1" }}>
                Question Title
                <input name="questionTitle" value={formData.questionTitle} onChange={handleFormChange} placeholder="Enter question title" style={fieldStyle} />
              </label>
              <div style={{ gridColumn: "1 / -1", background: "rgba(15, 23, 42, 0.42)", border: "1px solid rgba(148, 163, 184, 0.16)", borderRadius: "14px", padding: "12px" }}>
                <p style={{ margin: 0, marginBottom: "10px", color: "#93c5fd", fontSize: "12px", letterSpacing: "0.3px", textTransform: "uppercase", fontWeight: 600 }}>
                  Answer Options
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              <label style={fieldLabelStyle}>
                Option 1
                <input name="option1" value={formData.option1} onChange={handleFormChange} placeholder="Option 1" style={fieldStyle} />
              </label>
              <label style={fieldLabelStyle}>
                Option 2
                <input name="option2" value={formData.option2} onChange={handleFormChange} placeholder="Option 2" style={fieldStyle} />
              </label>
              <label style={fieldLabelStyle}>
                Option 3
                <input name="option3" value={formData.option3} onChange={handleFormChange} placeholder="Option 3" style={fieldStyle} />
              </label>
              <label style={fieldLabelStyle}>
                Option 4
                <input name="option4" value={formData.option4} onChange={handleFormChange} placeholder="Option 4" style={fieldStyle} />
              </label>
                </div>
              </div>
              <label style={{ ...fieldLabelStyle, gridColumn: "1 / -1" }}>
                Right Answer
                <div style={selectShellStyle}>
                  <select name="rightAnswer" value={formData.rightAnswer} onChange={handleFormChange} style={{ ...fieldStyle, appearance: "none", paddingRight: "38px", cursor: "pointer" }}>
                    <option value="">Select right answer</option>
                    <option value={formData.option1}>{formData.option1 || "Option 1"}</option>
                    <option value={formData.option2}>{formData.option2 || "Option 2"}</option>
                    <option value={formData.option3}>{formData.option3 || "Option 3"}</option>
                    <option value={formData.option4}>{formData.option4 || "Option 4"}</option>
                  </select>
                  <IoChevronDown style={{ position: "absolute", right: "12px", color: "#93c5fd", pointerEvents: "none", fontSize: "16px" }} />
                </div>
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
                  minWidth: "104px",
                  height: "42px",
                  border: "1px solid rgba(148, 163, 184, 0.36)",
                  background: "linear-gradient(180deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))",
                  color: "#dbeafe",
                  borderRadius: "12px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  boxShadow: "0 10px 24px rgba(2, 6, 23, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  minWidth: "156px",
                  height: "42px",
                  border: "1px solid rgba(216, 180, 254, 0.3)",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed 55%, #db2777)",
                  color: "#f8fafc",
                  borderRadius: "12px",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                  opacity: submitting ? 0.85 : 1,
                  boxShadow: "0 14px 28px rgba(76, 29, 149, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                {submitting ? "Saving..." : editingQuestionId ? "Update Question" : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Questions;