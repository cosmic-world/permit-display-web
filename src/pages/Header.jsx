import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typewriter from "typewriter-effect";
import HomeIcon from "@mui/icons-material/Home";
import { NavBarComponent } from "../action/userSlice";

export default function Header({}) {
  const dispatch = useDispatch();
  const selectedTerminal = useSelector((state) => state.itas.selectedTerminal);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every 1 second

    return () => clearInterval(interval); // cleanup
  }, []);
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        fontFamily: "calibri",
        fontSize: "1.5rem",
        height: 50,
        backgroundColor: "white",
        border: "1px solid #0d6efd",
      }}
    >
      <HomeIcon
        style={{ cursor: "pointer", zoom: 1.5, color: "black" }}
        onClick={() => dispatch(NavBarComponent("home"))}
      />
      <div
        className="d-flex justify-content-center align-items-center h-100"
        style={{
          color: "white",
          backgroundColor: "#0d6efd",
          width: "25%",
        }}
      >
        {selectedTerminal === "" || selectedTerminal === undefined
          ? ""
          : selectedTerminal[selectedTerminal.length - 1]}
      </div>
      {/* locationName */}
      <div
        className={`header-locationName h-100
      fw-bold d-flex flex-grow-1 justify-content-center align-items-center text-white user-select-none`}
      >
        <Typewriter
          options={{
            strings: "Live Permit Display",
            pauseFor: 5000,
            autoStart: true,
            loop: true,
            cursor: "",
          }}
        />
      </div>

      {/* current date-time stamp display */}
      <div
        className="d-flex justify-content-center align-items-center h-100"
        style={{
          color: "white",
          backgroundColor: "#0d6efd",
          width: "15%",
        }}
      >
        <label>
          {currentTime.toLocaleDateString("en-GB").replace(/\//g, "-")}{" "}
          {currentTime.toLocaleTimeString("en-GB", { hour12: false })}
        </label>
      </div>

            <div
        className="d-flex justify-content-center align-items-center h-100"
        style={{
          color: "#0d6efd",
          // backgroundColor: "#0d6efd",
          width: "20%",
          fontStyle: "italic",
          fontWeight: "bold",
        }}
      >
        <label>
          Developed by TAS R&D
        </label>
      </div>
    </div>
  );
}
