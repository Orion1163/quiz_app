import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Quiz from "./components/Quiz";
import Questions from "./components/Questions";
import Sidebar from "./components/global/Sidebar";

function App() {
  const sidebarWidth = 260;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="App">
      <Router>
        <div style={{ height: "100vh", overflow: "hidden", background: "#0f172a" }}>
          {isMobile ? (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                position: "fixed",
                top: "14px",
                left: "14px",
                zIndex: 50,
                width: "38px",
                height: "38px",
                border: "1px solid #334155",
                borderRadius: "10px",
                background: "#0b1220",
                color: "#e2e8f0",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ☰
            </button>
          ) : null}

          <Sidebar
            width={sidebarWidth}
            isOpen={isSidebarOpen}
            isMobile={isMobile}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main
            style={{
              marginLeft: isMobile ? "0" : `${sidebarWidth}px`,
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route exact path="/quiz" element={<Quiz />} />
              <Route exact path="/questions" element={<Questions />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;