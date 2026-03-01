import React, { useEffect, useState, useRef } from "react";
import "../css/page_layout.css";
import { Cascader } from "antd";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { NavBarComponent, SelectedTerminal } from "../action/userSlice";

export default function Home({}) {
  const dispatch = useDispatch();
  const [pass, SetPass] = useState("");
  const { selectedTerminal } = useSelector(
    (state) => state.itas
  );
  const [passcode, setPasscode] = useState(""); 
 const locationName = selectedTerminal[selectedTerminal.length - 1];
 const SHEET_ID = "1xq4qffj9jqguQn2b8qUvVlIhZwesp2pHiQ29cEPRZEQ";

    useEffect(() => {
      const fetchSheetData = async () => {
        try {
          const response = await fetch(
            `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=credentials`
          );
          const text = await response.text();
          // Remove unwanted characters from response
          const json = JSON.parse(text.substring(47).slice(0, -2));
          const rows = json.table.rows.map(row=>row.c.map(ele=>ele.v));
          const cols = json.table.cols.map(col=>col.label);
  
          // Convert rows into simple array
          const formattedData = rows.map(row =>{
            const obj = {};
            row.forEach((cell, index) => {
              obj[cols[index]] = cell;
            });    
            return obj; 
          }
          );
          const filteredData = formattedData.filter(ele=>ele['Location_Name'].toLowerCase() === locationName.toLowerCase());               
          setPasscode(filteredData.length>0?filteredData[0]['Passcode']:'');
        } catch (error) {
          console.error("Error fetching sheet data:", error);
        }
      };
      if(locationName!=""){
      fetchSheetData();
      }
    }, [locationName]);

  const stateOfficeList = [
    {
      label: "TNSO",
      value: "TNSO",
      children: [
        {
          label: "COIMBATORE TERMINAL",
          value: "COIMBATORE TERMINAL",
        },
                {
          label: "TRICHY TERMINAL",
          value: "TRICHY TERMINAL",
        },
      ],
    },
    // {
    //   label: "BSO",
    //   value: "BSO",
    //   children: [
    //     {
    //       label: "Patna Terminal",
    //       value: "Patna Terminal",
    //     },
    //   ],
    // }
  ];

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center h-100"
      style={{
        background:
          "radial-gradient(circle, rgb(207, 225, 238) 20%, #f3f2f0 80%)",
      }}
    >
      <Cascader
        options={stateOfficeList}
        expandTrigger="hover"
        placeholder={
          selectedTerminal === "" || selectedTerminal === undefined
            ? "Select Terminal..."
            : `${selectedTerminal[0]} / ${selectedTerminal[selectedTerminal.length - 1]}`
        }
        className="custom-cascader"
        style={{
          width: "40vw",
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
          dispatch(NavBarComponent("permitDisplay"));
        }}
        variant="contained"
        size="large"
        disabled={selectedTerminal === "" || selectedTerminal === undefined || pass === "" || pass != passcode}
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
