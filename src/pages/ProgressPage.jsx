import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavBarComponent } from "../action/userSlice";

function App() {
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          dispatch(NavBarComponent("home"));
          return 100;
        }
        return prev + 1;
      });
    }, 50); // speed control

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f9",
      }}
    >
      <div
        style={{
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{ marginBottom: "5rem", color: "#333", fontStyle: "italic" }}
        >
          Welcome to the Live Permit Display
        </h1>
        <h3>Loading... {progress}%</h3>
        <div
          style={{
            height: "30px",
            width: "40%",
            backgroundColor: "#ddd",
            borderRadius: "25px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #0d6efd, #6610f2)",
              transition: "width 0.1s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
