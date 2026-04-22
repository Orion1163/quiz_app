import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { text: "Questions", path: "/questions" },
  { text: "Quiz", path: "/quiz" },
//   {
//     text: "Practice",
//     path: "/practice",
//     submenu: [
//       { text: "Java", path: "/practice/java" },
//       { text: "Spring", path: "/practice/spring" },
//     ],
//   },
];

const Sidebar = ({ isOpen = true, width = 260, isMobile = false, onClose }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openSubmenu, setOpenSubmenu] = useState(
    navItems.find((item) => item.submenu?.some((subItem) => pathname.startsWith(subItem.path)))?.text || ""
  );

  const handleItemClick = (item) => {
    if (item.submenu) {
      setOpenSubmenu((prev) => (prev === item.text ? "" : item.text));
      return;
    }
    navigate(item.path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isMobile ? (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            zIndex: 39,
          }}
        />
      ) : null}

      <aside
        style={{
          width: `${width}px`,
          height: "100vh",
          borderRight: "1px solid #1f2937",
          background: "linear-gradient(180deg, #0b1220 0%, #111827 100%)",
          padding: "20px 14px",
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
          transform: isMobile ? "translateX(0)" : "none",
          boxShadow: isMobile ? "10px 0 30px rgba(0, 0, 0, 0.45)" : "none",
        }}
      >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "0 10px 20px",
          marginBottom: "4px",
          borderBottom: "1px solid #1f2937",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            QA
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>Quiz App (Admin)</div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Learning Dashboard</div>
          </div>
        </div>
        {isMobile ? (
          <button
            type="button"
            onClick={onClose}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              border: "1px solid #334155",
              background: "#0b1220",
              color: "#cbd5e1",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        ) : null}
      </div>

      <nav style={{ marginTop: "14px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          const isSubmenuOpen = openSubmenu === item.text;

          return (
            <div key={item.text} style={{ marginBottom: "6px" }}>
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                style={{
                  width: "100%",
                  border: "none",
                  background: isActive ? "#1e3a8a" : "transparent",
                  textAlign: "left",
                  padding: "11px 12px",
                  fontSize: "14px",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#dbeafe" : "#cbd5e1",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{item.text}</span>
                {item.submenu ? <span style={{ fontWeight: 700 }}>{isSubmenuOpen ? "-" : "+"}</span> : null}
              </button>

              {item.submenu && isSubmenuOpen ? (
                <div style={{ marginTop: "4px" }}>
                  {item.submenu.map((subItem) => {
                    const isSubActive = pathname === subItem.path || pathname.startsWith(`${subItem.path}/`);
                    return (
                      <button
                        key={subItem.text}
                        type="button"
                        onClick={() => navigate(subItem.path)}
                        style={{
                          width: "100%",
                          border: "none",
                          background: isSubActive ? "#312e81" : "transparent",
                          textAlign: "left",
                          padding: "9px 12px 9px 28px",
                          fontSize: "13px",
                          fontWeight: isSubActive ? 600 : 500,
                          color: isSubActive ? "#ddd6fe" : "#94a3b8",
                          cursor: "pointer",
                          borderRadius: "9px",
                          marginBottom: "4px",
                        }}
                      >
                        {subItem.text}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          padding: "14px 10px 6px",
          fontSize: "12px",
          color: "#64748b",
        }}
      >
        Keep practicing every day.
      </div>
      </aside>
    </>
  );
};

export default Sidebar;