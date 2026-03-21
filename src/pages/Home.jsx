import React, { useEffect, useState, useRef } from "react";
import "../css/page_layout.css";
import { Cascader } from "antd";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NavBarComponent, SelectedTerminal } from "../action/userSlice";

export default function Home({}) {
  const dispatch = useDispatch();
  const [pass, SetPass] = useState("");
  const [admin_pass, SetAdmin_pass] = useState("");
  const { selectedTerminal, locationList } = useSelector(
    (state) => state.myApp,
  );
  const [passcode, setPasscode] = useState("");
  const locationName = selectedTerminal[selectedTerminal.length - 1];
  const SHEET_ID = "1xq4qffj9jqguQn2b8qUvVlIhZwesp2pHiQ29cEPRZEQ";

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=credentials`,
        );
        const text = await response.text();
        // Remove unwanted characters from response
        const json = JSON.parse(text.substring(47).slice(0, -2));
        const rows = json.table.rows.map((row) => row.c.map((ele) => ele.v));
        const cols = json.table.cols.map((col) => col.label);

        // Convert rows into simple array
        const formattedData = rows.map((row) => {
          const obj = {};
          row.forEach((cell, index) => {
            obj[cols[index]] = cell;
          });
          return obj;
        });
        const filteredData = formattedData.filter(
          (ele) =>
            ele["Location Name"].toLowerCase() ===
            ((locationName !== "") & (locationName != undefined)
              ? locationName.toLowerCase()
              : "test"),
        );
        setPasscode(filteredData.length > 0 ? filteredData[0]["Passcode"] : "");
        SetAdmin_pass(
          filteredData.length > 0 ? filteredData[0]["Admin_pass"] : "",
        );
      } catch (error) {
        console.error("Error fetching sheet data:", error);
      }
    };
    if (selectedTerminal != "") {
      fetchSheetData();
    }
  }, [locationName]);
  const zlist = [];

  locationList.forEach((obj) => {
    const existing = zlist.find((item) => item.value === obj["State Office"]);

    if (existing) {
      existing.children.push({
        label: obj["Location Name"],
        value: obj["Location Name"],
      });
    } else {
      zlist.push({
        label: obj["State Office"],
        value: obj["State Office"],
        children: [
          {
            label: obj["Location Name"],
            value: obj["Location Name"],
          },
        ],
      });
    }
  });

  const stateOfficeList = zlist;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center h-100">
      <Cascader
        className="custom-cascader"
        popupClassName="custom-cascader-dropdown"
        options={stateOfficeList}
        expandTrigger="hover"
        placeholder={
          selectedTerminal === "" || selectedTerminal === undefined
            ? "Select Terminal..."
            : `${selectedTerminal[0]} / ${selectedTerminal[selectedTerminal.length - 1]}`
        }
        style={{
          width: 360,
          height: 60,
          marginBottom: 20,
        }}
        onChange={(newValue) => {
          newValue
            ? dispatch(SelectedTerminal(newValue))
            : dispatch(SelectedTerminal(""));
        }}
      />
      <TextField
        id="passcode"
        label="Enter Passcode For This Location"
        size="large"
        value={pass}
        style={{ marginBottom: 20, width: 360, backgroundColor: "white" }}
        InputProps={{ inputProps: { autoComplete: "off" } }}
        type={"password"}
        required
        onChange={(e) => SetPass(e.target.value.trim())}
      />
      <Button
        onClick={(e) => {
          dispatch(NavBarComponent("formControl"));
        }}
        variant="contained"
        size="large"
        disabled={
          selectedTerminal === "" ||
          selectedTerminal === undefined ||
          pass === "" ||
          pass != passcode
        }
        sx={{
          width: 200,
          fontSize: 20,
          fontFamily: "calibri",
          "&:disabled": {
            cursor: "not-allowed",
            color: "black",
            backgroundColor: "white",
            pointerEvents: "all !important",
          },
        }}
      >
        {"Submit"}
      </Button>
    </div>
  );
}
