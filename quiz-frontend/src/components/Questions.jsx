import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";


const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/question/allQuestions")
      .then((response) => {
        setQuestions(response.data);
      })
      .catch(() => {
        setError("Unable to load questions.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    console.log(id);
  }

  const handleDelete = (id) => {
    console.log(id);
  }

  const handleAddQuestion = () => {
    console.log("Add Question");
  }

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
        <button onClick={() => handleAddQuestion()} style={{ width: "13%", height: "40px", backgroundColor: "#1e293b", color: "#cbd5e1", border: "none", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>Add Question <IoIosAddCircleOutline style={{ fontSize: "20px" }}/>
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
    </div>
  );
};

export default Questions;