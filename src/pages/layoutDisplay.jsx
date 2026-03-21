import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../css/page_layout.css";
import ReactApexChart from "react-apexcharts";
import {
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Select,
  CircularProgress,
} from "@mui/material";

export default function PermitDisplay({ state }) {
  const { PermitList, selectedTerminal } = useSelector((state) => state.myApp);
  const [saveLoader, setSaveLoader] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [rowNumber, setRowNumber] = useState(null);
  const [oldrowNumber, setOldRowNumber] = useState(null);
  const [mark, setMark] = useState("new");
  const locationName = selectedTerminal[selectedTerminal.length - 1];
  const [startIndex, setstartIndex] = useState(0);
  const $table = document.querySelector(".ttes_table_div");
  const $table_height = $table ? $table.clientHeight : 500;
  const $thead = document.querySelector(".table-head");
  const $thead_height = $thead ? $thead.clientHeight : 50;
  const tbody_rows_count = Math.floor(($table_height - $thead_height) / 30);
  const step = tbody_rows_count;

  const [clock, setClock] = React.useState(0);

  useEffect(() => {
    setInterval(() => {
      if (clock > 5000) {
        setClock(0);
      } else {
        setClock((prevTemp) => prevTemp + 1);
      }
    }, 10000);
  }, []);

  useEffect(() => {
    setstartIndex((prevState) =>
      prevState + step < PermitList.length ? prevState + step : 0,
    );
  }, [clock]);

  const handleClick = (e, value) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMenuPosition({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });

    setMarkerPosition({
      mouseX: x,
      mouseY: y,
    });
    setMark(value);
  };
  const handleSelect = (value, index) => {
    setRowNumber(index);
  };
  const handleMenuClose = () => {
    setMenuPosition(null);
    setRowNumber(null);
    setOldRowNumber(null);
    setMark("new");
  };
  const sheet_url = `https://script.google.com/macros/s/AKfycbxEeoOFk61oKOh_Jhr0nNZzxSONfPXnsflcCkGDQavFFjd-63fgSUbM7Ad2d7alF_ij/exec`;
  const handleSubmit = async () => {
    const x_list = PermitList.filter(
      (val) => val["Unique ID"] === oldrowNumber,
    );
    const x = x_list.length > 0 ? x_list[0].page_left : null;
    const y = x_list.length > 0 ? x_list[0].page_top : null;
    setSaveLoader(true);
    try {
      await fetch(sheet_url, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({
          row: rowNumber + 1,
          updates: JSON.stringify([
            { col: 14, value: mark === "existing" ? y : markerPosition.mouseY },
            { col: 15, value: mark === "existing" ? x : markerPosition.mouseX },
          ]),
        }),
      });
      mark != "existing" ? setSaveLoader(false) : null;
      handleMenuClose();
    } catch (error) {
      console.log("error...", `${error} and also check internet connection`);
    }
    if (mark === "existing") {
      try {
        await fetch(sheet_url, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams({
            row: oldrowNumber + 1,
            updates: JSON.stringify([
              { col: 14, value: "" },
              { col: 15, value: "" },
            ]),
          }),
        });
        setSaveLoader(false);
      } catch (error) {
        console.log("error...", `${error} and also check internet connection`);
      }
    }
  };

  const [imgExists, setImgExists] = useState(true);
  const imagePath = `${process.env.PUBLIC_URL}/asset/${locationName ? locationName.replace(/\s+/g, "_").toLowerCase() : "No"}.png`;
  useEffect(() => {
    const img = new Image();
    img.src = imagePath;
    img.onload = () => setImgExists(true);
    img.onerror = () => setImgExists(false);
  }, [imagePath]);

  return (
    <>
      {saveLoader ? (
        <CircularProgress
          color="success"
          style={{
            position: "fixed",
            zIndex: 2000,
            zoom: 3,
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
          }}
        />
      ) : null}
      <Menu
        open={menuPosition !== null}
        onClose={() => handleMenuClose()}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition !== null
            ? { top: menuPosition.mouseY + 5, left: menuPosition.mouseX + 5 }
            : undefined
        }
        MenuListProps={{
          sx: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      >
        <MenuItem className="m-0 p-1">
          <Select
            defaultValue=""
            // onChange={(e) => handleSelect(e)}
            size="small"
            style={{ width: 300, fontFamily: "lucida sans", fontSize: 14 }}
          >
            {PermitList.filter(
              (val) => val.page_left == "" && val.page_top == "",
            ).map((val, idx) => {
              const text = Object.entries(val)
                .filter(
                  ([key]) =>
                    key !== "Unique ID" &&
                    key !== "" &&
                    key !== "page_top" &&
                    key !== "page_left",
                )
                .map(([key, value]) => `${key} : ${value}`)
                .join("\n");
              return (
                <MenuItem
                  key={idx}
                  value={text}
                  onClick={() => {
                    handleSelect(text, val["Unique ID"]);
                  }}
                  style={{
                    fontFamily: "lucida sans",
                    fontSize: 14,
                    display: "block",
                  }}
                >
                  <div className="w-100" style={{ whiteSpace: "pre-line" }}>
                    {text}
                  </div>
                  <Divider className="bg-dark mt-2" />
                </MenuItem>
              );
            })}
          </Select>
        </MenuItem>
        <Divider className="bg-dark m-0" />
        <div className="w-100 d-flex justify-content-center">
          <Button
            variant="contained"
            size="large"
            className="m-2"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </div>
      </Menu>
      <div
        className={
          "d-flex flex-column h-100 w-100 justify-content-center align-items-center"
        }
      >
        <div
          className={
            "d-flex justify-content-center align-items-start w-100 h-75 p-2"
          }
          style={{
            overflow: "none",
            overflowX: "auto",
            backgroundColor: "#dee4ea",
          }}
        >
          <div
            className={
              "d-flex flex-column justify-content-center align-items-center"
            }
            style={{ width: "20%", marginRight: "20px" }}
          >
            <Table
              bordered
              hover
              style={{ backgroundColor: "white", marginBottom: "2rem" }}
              className="legend-table"
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>Color</th>
                  <th>Type of Permit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="d-flex justify-content-center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#e7028c",
                        textAlign: "center",
                      }}
                    ></div>
                  </td>
                  <td>Hot Work</td>
                </tr>
                <tr>
                  <td className="d-flex justify-content-center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#d9d90b",
                        marginTop: 2,
                        textAlign: "center",
                      }}
                    ></div>
                  </td>
                  <td>Cold Work</td>
                </tr>
                <tr>
                  <td className="d-flex justify-content-center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: `linear-gradient(to right, #e7028c 50%, #6ccded 50%)`,
                        marginTop: 2,
                        textAlign: "center",
                      }}
                    ></div>
                  </td>
                  <td>Height + Hot Work</td>
                </tr>
                <tr>
                  <td className="d-flex justify-content-center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: `linear-gradient(to right, #d9d90b 50%, #6ccded 50%)`,
                        marginTop: 2,
                        textAlign: "center",
                      }}
                    ></div>
                  </td>
                  <td>Height + Cold Work</td>
                </tr>
                <tr>
                  <td className="d-flex justify-content-center">
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#6ccded",
                        marginTop: 2,
                        textAlign: "center",
                      }}
                    ></div>
                  </td>
                  <td>Electrical Work</td>
                </tr>
              </tbody>
            </Table>
            <div
              id="chart"
              style={{ border: "1px solid black", backgroundColor: "white" }}
            >
              <ReactApexChart
                options={state.options}
                series={state.series}
                type="pie"
                width={window.innerWidth * 0.2}
              />
            </div>
          </div>
          {imgExists ? (
            <div className="p-3 h-100 w-100" style={{ border: "1px solid" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                }}
                onDoubleClick={(e) => handleClick(e, "new")}
              >
                <img
                  src={imagePath}
                  alt="layout"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                />
                {PermitList.filter((val) => val.page_left && val.page_top).map(
                  (val, index) => {
                    const text = Object.entries(val)
                      .filter(
                        ([key]) =>
                          key !== "" &&
                          key !== "page_top" &&
                          key !== "page_left",
                      )
                      .map(([key, value]) => `${key} : ${value}`)
                      .join("\n");
                    return (
                      <Tooltip
                        key={index}
                        arrow
                        placement="right-start"
                        slotProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: "#fff",
                              color: "black",
                              border: "1px solid #ccc",
                              fontSize: "12px",
                              fontFamily: "lucida sans",
                            },
                          },
                          arrow: {
                            sx: {
                              color: "#fff",
                            },
                          },
                        }}
                        title={
                          <Table bordered>
                            <tbody>
                              {Object.entries(val)
                                .filter(
                                  ([key]) =>
                                    key !== "Unique ID" &&
                                    key !== "" &&
                                    key !== "page_top" &&
                                    key !== "page_left",
                                )
                                .map(([key, value], index) => (
                                  <tr key={index} style={{}}>
                                    <td>{key}</td>
                                    <td>{value}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        }
                      >
                        <div
                          key={index}
                          onDoubleClick={(e) => {
                            handleClick(e, "existing");
                            setOldRowNumber(val["Unique ID"]);
                          }}
                          style={{
                            position: "absolute",
                            zIndex: 1000,
                            cursor: "pointer",
                            zoom: 1,
                            top: `${val.page_top}%`,
                            left: `${val.page_left}%`,
                            height: 30,
                            width: 30,
                            borderRadius: "50%",
                            background:
                              val["Permit Type"] == "Hot Work"
                                ? "#e7028c"
                                : val["Permit Type"] == "COLD WORK"
                                  ? "#d9d90b"
                                  : val["Permit Type"] == "Electrical Work"
                                    ? "#6ccded"
                                    : val["Permit Type"] == "Height + Hot Work"
                                      ? `linear-gradient(to right, #e7028c 50%, #6ccded 50%)`
                                      : val["Permit Type"] ==
                                          "Height + Cold Work"
                                        ? `linear-gradient(to right, yellow 50%, #6ccded 50%)`
                                        : "#ccc",
                          }}
                        />
                      </Tooltip>
                    );
                  },
                )}
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid",
                fontFamily: "Lucida Sans",
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              Layout Not Available
            </div>
          )}
        </div>
        <div className="ttes_table_div px-2">
          <Table bordered hover className="ttes_table m-0">
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
    </>
  );
}
