import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from "react-bootstrap/Table";
import { SetPermitList } from "../action/userSlice";
import "../css/page_layout.css";

export default function PermitDisplay() {
  const dispatch = useDispatch();
  const { selectedTerminal, PermitList } = useSelector((state) => state.myApp);
  const [startIndex, setstartIndex] = useState(0);

  const locationName = selectedTerminal[selectedTerminal.length - 1];

  const $table = document.querySelector(".ttes_table_div");
  const $table_height = $table ? $table.clientHeight : 500;
  const $thead = document.querySelector(".table-head");
  const $thead_height = $thead ? $thead.clientHeight : 50;
  const tbody_rows_count = Math.floor(($table_height - $thead_height) / 30) - 1;
  const step = tbody_rows_count;

  const [clock, setClock] = React.useState(0);

  useEffect(() => {
    setInterval(() => {
      if (clock > 5000) {
        setClock(0);
      } else {
        setClock((prevTemp) => prevTemp + 1);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    setstartIndex((prevState) =>
      prevState + step < PermitList.length ? prevState + step : 0,
    );
  }, [clock]);

  function formatDate(date1) {
    const date = new Date(...date1.slice(5, -1).split(","));
    return date
      .toLocaleDateString("en-GB")
      .replace(",", "")
      .replaceAll("/", "-");
  }
  function formatTime(date1) {
    const date = new Date(...date1.slice(5, -1).split(","));
    return date.toLocaleTimeString("en-GB", { hour12: false }).replace(",", "");
  }

  const SHEET_ID = "1xq4qffj9jqguQn2b8qUvVlIhZwesp2pHiQ29cEPRZEQ";

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const response = await fetch(
          `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=permit_details`,
        );
        const text = await response.text();
        // Remove unwanted characters from response
        const json = JSON.parse(text.substring(47).slice(0, -2));

        const rows = json.table.rows.map((row) =>
          row.c.map((ele) => ele?.v ?? ""),
        );
        const cols = json.table.cols.map((col) => col.label);

        // Convert rows into simple array
        const formattedData = rows.map((row) => {
          const obj = {};
          row.forEach((cell, index) => {
            obj[cols[index]] = cell;
          });
          return obj;
        });
        const filteredData1 = formattedData
          .filter(
            (ele) =>
              ele["Location_Name"].toLowerCase() === locationName.toLowerCase(),
          )
          .filter(
            (ele) =>
              formatTime(ele["Clearance given till"]) >
              new Date().toLocaleTimeString("en-GB"),
          );
        const filteredData2 = filteredData1.map((item) => ({
          Date: formatDate(item.Timestamp),
          ...item,
          // "Clearance given from": formatTime(item["Clearance given from"]),
          // "Clearance given till": formatTime(item["Clearance given till"]),
        }));
        const filteredData = filteredData2.map((obj) =>
          Object.fromEntries(
            Object.entries(obj).filter(
              ([key]) => !["Timestamp", "Jdbc_Status"].includes(key),
            ),
          ),
        );
        // // ✅ Save into useState list
        dispatch(SetPermitList(filteredData));
      } catch (error) {
        console.error("Error fetching sheet data1:", error);
      }
    };
    setInterval(() => {
      fetchSheetData();
    }, 10000);
  }, []);

  return (
    <div
      className={
        "d-flex justify-content-center align-items-center w-100 h-100 p-2"
      }
      style={{
        overflow: "none",
        overflowX: "auto",
        backgroundColor: "#dee4ea",
      }}
    >
      <div className="ttes_table_div">
        <Table bordered hover className="ttes_table">
          <thead className="table-head">
            <tr>
              <th>DATE</th>
              <th>PERMIT TYPE</th>
              <th>WORK DESCRIPTION</th>
              <th>WORK LOCATION</th>
              <th>RECEIVER NAME</th>
              <th>CLEARANCE FROM</th>
              <th>CLEARANCE TILL</th>
              <th>CONTRACTOR NAME</th>
              <th>CONTRACTOR SUPERVISOR</th>
              <th>LOCATION NAME</th>
              <th>DIVISION</th>
            </tr>
          </thead>
          <tbody
            style={{
              overflow: "hidden",
            }}
          >
            {Array.from({ length: tbody_rows_count }, (_, i) => {
              const permit = PermitList[i + startIndex];
              return (
                <tr key={i}>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Date"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Permit Type"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Work Description"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Work Location"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Receiver Name"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Clearance given from"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Clearance given till"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Contractor Name"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Contractor Supervisor"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Location_Name"] : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {permit ? permit["Division"] : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
