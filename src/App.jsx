import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState, useRef } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./pages/Header";
import LandingPage from "./pages/landingPage";
import { useDispatch, useSelector } from "react-redux";
import { NavBarComponent } from "./action/userSlice";

function App() {
  const dispatch = useDispatch();
  const navBarComponent = useSelector((state) => state.itas.navBarComponent);
  
  useEffect(() => {
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
