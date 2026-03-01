import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useRef } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./pages/Header";
import LandingPage from "./pages/landingPage";
import { useDispatch, useSelector } from "react-redux";
import { NavBarComponent } from "./action/userSlice";
import storage from "redux-persist/lib/storage";

function App() {
  const dispatch = useDispatch();
  const navBarComponent = useSelector((state) => state.itas.navBarComponent);

    useEffect(() => {
    const channel = new BroadcastChannel("permit_channel");

    // Send a message that this tab is active
    channel.postMessage("tab_opened");

    // Handle incoming messages
    channel.onmessage = (event) => {
      if (event.data === "tab_opened") {
        alert("A duplicate tab is detected. Click OK to close this session");
        window.location.href = "about:blank"; // Redirect the duplicate tab
      }
    };

    // Cleanup
    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
      //     sessionStorage.clear();
      // sessionStorage.removeItem("persist:root");
      // storage.removeItem("persist:root");
    if(navBarComponent != "permitDisplay"){
    dispatch(NavBarComponent(""))
    }
  }, []);
  return (
    <div className="App d-flex flex-column vh-100 vw-100">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default React.memo(App);
