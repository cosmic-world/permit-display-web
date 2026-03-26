import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typewriter from "typewriter-effect";
import {
  NavBarComponent,
  SelectedTerminal,
  SetPermitList,
} from "../action/userSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem, Divider } from "@mui/material";

export default function Header({}) {
  const dispatch = useDispatch();
  const {selectedTerminal, navBarComponent, usertype} = useSelector((state) => state.myApp);
  const locationName = selectedTerminal[selectedTerminal.length - 1];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [anchorE1, setAnchorE1] = React.useState(null);
  const open = Boolean(anchorE1);
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
      {navBarComponent != "" ? (
        <>
          <Menu
            id="profile-dropdown"
            anchorEl={anchorE1}
            open={open}
            aria-hidden={false}
            onClose={() => setAnchorE1(null)}
            slotProps={{
              paper: {
                sx: {
                  width: 280,
                  "& .MuiMenuItem-root": {
                    fontFamily: "Candara",
                    fontSize: "1.2rem",
                    color: "black",
                    textAlign: "center !Important",
                  },
                },
              },
            }}
          >
            <MenuItem
              selected={navBarComponent == "home"}
              onClick={() => {
                dispatch(NavBarComponent("home"));
                dispatch(SetPermitList([]));
                dispatch(SelectedTerminal(""));
                setAnchorE1(null);
              }}
              className="d-flex justify-content-center"
            >
              Home
            </MenuItem>
            <Divider className="bg-dark" />
            {locationName != "" && locationName != undefined ? (
              <>
                <MenuItem
                  selected={navBarComponent == "formControl"}
                  onClick={() => {
                    dispatch(NavBarComponent("formControl"));
                    setAnchorE1(null);
                  }}
                  className="d-flex justify-content-center"
                >
                  User Form
                </MenuItem>
                <Divider className="bg-dark" />
                <MenuItem
                  selected={navBarComponent == "permitDisplay"}
                  onClick={() => {
                    dispatch(NavBarComponent("permitDisplay"));
                    setAnchorE1(null);
                  }}
                  className="d-flex justify-content-center"
                >
                  Table View
                </MenuItem>
                <Divider className="bg-dark" />
                <MenuItem
                  selected={navBarComponent == "layoutDisplay"}
                  className="d-flex justify-content-center"
                  disabled={window.innerWidth < 768}
                  onClick={() => {
                    dispatch(NavBarComponent("layoutDisplay"));
                    setAnchorE1(null);
                  }}
                >
                  Layout View (Desktop Only)
                </MenuItem>
                <Divider className="bg-dark" />
                <MenuItem
                  selected={navBarComponent == "modifyRecords"}
                  className="d-flex justify-content-center"
                  disabled={usertype!='Admin'}
                  onClick={() => {
                    dispatch(NavBarComponent("modifyRecords"));
                    setAnchorE1(null);
                  }}
                >
                  Modify Records (Admin Only)
                </MenuItem>
                <Divider className="bg-dark" />
              </>
            ) : null}
            <MenuItem
              selected={navBarComponent == "contacts"}
              className="d-flex justify-content-center"
              onClick={() => {
                dispatch(NavBarComponent("contacts"));
                setAnchorE1(null);
              }}
            >
              Contacts
            </MenuItem>
          </Menu>
        </>
      ) : null}

      <MenuIcon
        style={{
          cursor: navBarComponent != "" ? "pointer" : "default",
          zoom: 1.5,
          color: "black",
        }}
        onClick={(event) =>
          navBarComponent != "" ? setAnchorE1(event.currentTarget) : null
        }
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
      d-none d-xxl-flex flex-grow-1 justify-content-center align-items-center text-white user-select-none`}
        style={{ fontFamily: "calibri" }}
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
        className="d-none d-xxl-flex justify-content-center align-items-center h-100"
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
        className="d-none d-xxl-flex justify-content-center align-items-center h-100"
        style={{
          color: "#0d6efd",
          // backgroundColor: "#0d6efd",
          width: "20%",
          fontStyle: "italic",
          fontWeight: "bold",
        }}
      >
        <label>Developed by TAS R&D</label>
      </div>
    </div>
  );
}
