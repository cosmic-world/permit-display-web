import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../css/page_layout.css";

export default function PermitDisplay() {
  const { PermitList } = useSelector((state) => state.myApp);
  const [startIndex, setstartIndex] = useState(0);
  const $table = document.querySelector(".ttes_table_view");
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
      <div className="ttes_table_view">
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
                    {permit ? permit["Location Name"] : ""}
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
