import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import ModalDialog from "react-bootstrap/ModalDialog";
import Draggable from "react-draggable";
import {
  Add,
  Close,
} from "@mui/icons-material";
import {
  Button,
  TextField,
  CircularProgress,
  Autocomplete
} from "@mui/material";
import { NavBarComponent } from "../action/userSlice";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

class DraggableModalDialog extends React.Component {
  render() {
    return (
      <Draggable handle=".modal-header">
        <ModalDialog {...this.props} />
      </Draggable>
    );
  }
}

export default function formControlPage() {
  const dispatch = useDispatch();
  const { selectedTerminal } = useSelector((state) => state.myApp);
  const [saveLoader, setSaveLoader] = useState(false); 
  const [show, setShow] = useState(false);
  const [permitType, setPermitType] = useState("Hot Work");
  const [workDesc, setWorkDesc] = useState("Test Description");
  const [workLocation, setWorkLocation] = useState("Test Location");
  const [receiverName, setReceiverName] = useState("Test Receiver");
  const [clrStart, setClrStart] = useState("10:00");
  const [clrEnd, setClrEnd] = useState("17:00");
  const [contractorName, setContractorName] = useState("Test Contractor");
  const [supervisorName, setSupervisorName] = useState("Test Supervisor");
  const [division, setDivision] = useState("Marketing");
  const locationName = selectedTerminal[selectedTerminal.length - 1];

  const handleResetForm = () =>{
    setSaveLoader(false)
    setPermitType("");
    setWorkDesc("");
    setWorkLocation("");
    setReceiverName("");
    setClrStart("");
    setClrEnd("");
    setContractorName("");
    setSupervisorName("");
    setDivision("");
  }

  const handleCloseModal = () => {
    handleResetForm()
    setShow(false);
  };

  const sheet_url = `https://script.google.com/macros/s/AKfycbwy0x_kexcRpJk9yYJqXdZHkIRcATavhupOYqrBlPPHRDQIqLKCv9tDpm_ysDqC0EXZ/exec`;

  const handlePostData = async () => {
    if(permitType=="" || workDesc=="" || workLocation=="" || 
    receiverName=="" || clrStart=="" || clrEnd=="" || 
    contractorName=="" || supervisorName=="" || division==""){
      alert('All fields must be filled')
      return
    }
      setSaveLoader(true);
    try {
      await fetch(sheet_url, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({
          data: JSON.stringify(
            {'Permit Type':permitType,'Work Description':workDesc,'Work Location':workLocation,
              'Receiver Name':receiverName,'Clearance given from':clrStart,'Clearance given till':clrEnd,
              'Contractor Name':contractorName,'Contractor Supervisor':supervisorName,
              'Location Name':locationName,'Division':division
            }
          ),
        }),
      });
      setSaveLoader(false)
    } catch (error) {
      setSaveLoader(false)
      console.log('error...',`${error} and also check internet connection`);
    }
    }

  return (
    <>
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
      <Modal
        dialogAs={DraggableModalDialog}
        show={show}
        onHide={() => {
          handleCloseModal();
        }}
        size="lg"
        backdrop="static"
        centered
        style={{ userSelect: "none" }}
      >
        <Modal.Header style={{ cursor: "move", zIndex: 10 }} closeButton>
          <Modal.Title
            style={{
              fontSize: "25px",
              fontFamily: "Lucida Sans",
              fontWeight: "bolder",
              color: "black",
              width: "100%",
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Fill All Fields
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="row w-100">
            <div
              className="col-4 text-right border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Permit Type
            </div>
            <div className="col-8">
              <Autocomplete className="w-100"
                options={['Hot Work','Cold Work','Height + Hot Work',
                  'Height + Cold Work', 'Electrical Work'
                ]}
                name="TTNo"
                value={permitType !== "" ? permitType : null}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, newValue) =>
                  newValue !== null ? setPermitType(newValue) : setPermitType("")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={division==""}
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        fontFamily: "Lucida Sans",
                        fontSize: 20,
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Work Description
            </div>
            <div className="col-8">
              <TextField className="w-100"
              style={{fontFamily: "Lucida Sans", fontSize: 20}}
              value={workDesc}
              error={workDesc==""}
              onChange={(e)=>setWorkDesc(e.target.value)}
              InputProps={{ 
                sx: {
                  fontFamily: "Lucida Sans",
                  fontSize: "20px",
                },
                inputProps: { autoComplete: "off"} }}
              />
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Work Location
            </div>
            <div className="col-8">
              <TextField className="w-100"
              style={{fontFamily: "Lucida Sans", fontSize: 20}}
              value={workLocation}
              error={workLocation==""}
              onChange={(e)=>setWorkLocation(e.target.value)}
              InputProps={{ 
                sx: {
                  fontFamily: "Lucida Sans",
                  fontSize: "20px",
                },
                inputProps: { autoComplete: "off"} }}
              />
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Receiver Name
            </div>
            <div className="col-8">
              <TextField className="w-100"
              style={{fontFamily: "Lucida Sans", fontSize: 20}}
              value={receiverName}
              error={receiverName==""}
              onChange={(e)=>setReceiverName(e.target.value)}
              InputProps={{ 
                sx: {
                  fontFamily: "Lucida Sans",
                  fontSize: "20px",
                },
                inputProps: { autoComplete: "off"} }}
              />
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Clearance Given From
            </div>
            <div className="col-8">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem>
                  <TimePicker
                    defaultValue={dayjs()}
                    type="time"
                    name="clr-start-time"
                    value={clrStart}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          "& .MuiInputBase-input": {
                            fontSize: "20px",
                            fontFamily: "Lucida Sans",
                            color: "black",
                          }
                        }
                      }
                    }}
                    onChange={(newValue) => {
                      if (newValue) {
                        setClrStart(newValue.format("HH:mm"))
                      }
                    }}
                  />
                </DemoItem>
              </LocalizationProvider>
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Clearance Given Till
            </div>
            <div className="col-8">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoItem>
                  <TimePicker
                    defaultValue={dayjs()}
                    type="time"
                    name="clr-end-time"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          "& .MuiInputBase-input": {
                            fontSize: "20px",
                            fontFamily: "Lucida Sans",
                            color: "black",
                          }
                        }
                      }
                    }}
                    value={clrEnd}
                    onChange={(newValue) => {
                      if (newValue) {
                        setClrEnd(newValue.format("HH:mm"))
                      }
                    }}
                  />
                </DemoItem>
              </LocalizationProvider>
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Contractor Name
            </div>
            <div className="col-8">
              <TextField className="w-100"
              style={{fontFamily: "Lucida Sans", fontSize: 20}}
              value={contractorName}
              error={contractorName==""}
              onChange={(e)=>setContractorName(e.target.value)}
              InputProps={{ 
                sx: {
                  fontFamily: "Lucida Sans",
                  fontSize: "20px",
                },
                inputProps: { autoComplete: "off"} }}
              />
            </div>
          </div>

          <div className="row w-100 mt-2">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Contractor Supervisor
            </div>
            <div className="col-8">
              <TextField className="w-100"
              style={{fontFamily: "Lucida Sans", fontSize: 20}}
              value={supervisorName}
              error={supervisorName==""}
              onChange={(e)=>setSupervisorName(e.target.value)}
              InputProps={{ 
                sx: {
                  fontFamily: "Lucida Sans",
                  fontSize: "20px",
                },
                inputProps: { autoComplete: "off"} }}
              />
            </div>
          </div>

          <div className="row w-100 mt-2 mb-4">
            <div
              className="col-4 border-bottom"
              style={{
                fontSize: "18px",
                fontFamily: "Lucida Sans",
                color: "black",
                textAlign: "center",
                alignContent: "center",
              }}
            >
              Division
            </div>
            <div className="col-8">
              <Autocomplete className="w-100"
                options={['Marketing','Pipeline']}
                name="division"
                value={division !== "" ? division : null}
                isOptionEqualToValue={(option, value) => option === value}
                onChange={(e, newValue) =>
                  newValue !== null ? setDivision(newValue) : setDivision("")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={division==""}
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        fontFamily: "Lucida Sans",
                        fontSize: 20,
                      },
                    }}
                  />
                )}
              />
            </div>
          </div>

          <Button
            color="success"
            variant="contained"
            style={{
              margin: "6px 5px 0px 5px",
              height: "48px",
              width: "200px",
              fontSize: "20px",
              fontWeight: "normal",
              fontFamily: 'Lucida Sans'
            }}
            onClick={(e) => {
              handlePostData(e);
            }}
          >
            SUBMIT
          </Button>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-around">
          <Button
            variant="contained"
            color="secondary"
            style={{
              width: 150,
              fontSize: "18px",
              fontFamily: 'Lucida Sans',
              fontWeight: 'normal'
            }}
            onClick={() => {
              handleResetForm();
            }}
          >
            <Add style={{ marginRight: "5px" }} />
            ADD NEW
          </Button>

          <Button
            variant="contained"
            style={{
              width: 150,
              fontSize: "18px",
              fontFamily: 'Lucida Sans',
              fontWeight: 'normal'
            }}
            onClick={() => {
              handleCloseModal();
            }}
          >
            <Close style={{ marginRight: "5px" }} />
            CLOSE
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <Button
          variant="contained"
          size="large"
          sx={{ margin: 5, width: 200 }}
          onClick={() => setShow(true)}
        >
          Open Form
        </Button>
        <Button 
        variant="contained" 
          size="large"
          color="secondary"
          sx={{ width: 200 }}
        onClick={() => dispatch(NavBarComponent("layoutDisplay"))}>
          Go To Display
          </Button>
      </div>
    </>
  );
}
