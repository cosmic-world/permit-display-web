import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SetPermitList } from "../action/userSlice";
import Table from "react-bootstrap/Table";
import "../css/page_layout.css";
import {
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  Select,
  CircularProgress,
} from "@mui/material";

export default function PermitDisplay() {
  const dispatch = useDispatch();
  const { selectedTerminal, PermitList } = useSelector((state) => state.myApp);
  const locationName = selectedTerminal[selectedTerminal.length - 1];
  const [saveLoader, setSaveLoader] = useState(false);
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
        console.error("Error fetching sheet data2:", error);
      }
    };
    setInterval(() => {
      fetchSheetData();
    }, 10000);
  }, []);

  const [menuPosition, setMenuPosition] = useState(null);
  const [rowNumber, setRowNumber] = useState(null);
  const [oldrowNumber, setOldRowNumber] = useState(null);
  const [mark, setMark] = useState("new");
  const handleClick = (e, value) => {
    setMenuPosition({
      mouseX: e.clientX,
      mouseY: e.clientY,
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
            { col: 14, value: mark === "existing" ? y : menuPosition.mouseY },
            { col: 15, value: mark === "existing" ? x : menuPosition.mouseX },
          ]),
        }),
      });
      mark != "existing" ? setSaveLoader(false) : null;
      handleMenuClose();
    } catch (error) {
      console.error(error);
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
        console.error(error);
      }
    }
  };

  return (
    <>
      <div
        className={
          "d-flex justify-content-center align-items-start w-100 h-100 p-2"
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
            style={{ backgroundColor: "white" }}
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
                      backgroundColor: "yellow",
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
                      background: `linear-gradient(to right, yellow 50%, #6ccded 50%)`,
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
        </div>
        <div
          className="image-div"
          onDoubleClick={(e) => handleClick(e, "new")}
          style={{
            position: "relative",
            width: "80%",
            background: `url(${process.env.PUBLIC_URL}/asset/coimbatore_terminal.png)`,
          }}
        >
          {saveLoader ? (
            <CircularProgress
              color="success"
              style={{
                position: "fixed",
                zIndex: 2000,
                zoom: 3,
                left: "50%",
                top: "50%",
              }}
            />
          ) : null}
        </div>
      </div>
      <Menu
        open={menuPosition !== null}
        onClose={() => handleMenuClose()}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition !== null
            ? { top: menuPosition.mouseY + 20, left: menuPosition.mouseX + 20 }
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

      {PermitList.filter((val) => val.page_left && val.page_top).map(
        (val, index) => {
          const text = Object.entries(val)
            .filter(
              ([key]) =>
                key !== "" && key !== "page_top" && key !== "page_left",
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
                  top: val.page_top,
                  left: val.page_left,
                  height: 30,
                  width: 30,
                  borderRadius: "50%",
                  background:
                    val["Permit Type"] == "HOT WORK"
                      ? "#e7028c"
                      : val["Permit Type"] == "COLD WORK"
                        ? "yellow"
                        : val["Permit Type"] == "ELECTRICAL WORK"
                          ? "#6ccded"
                          : val["Permit Type"] == "HEIGHT + HOT WORK"
                            ? `linear-gradient(to right, #e7028c 50%, #6ccded 50%)`
                            : val["Permit Type"] == "HEIGHT + COLD WORK"
                              ? `linear-gradient(to right, yellow 50%, #6ccded 50%)`
                              : "#ccc",
                }}
              />
            </Tooltip>
          );
        },
      )}
    </>
  );
}
