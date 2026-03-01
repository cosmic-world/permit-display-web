import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
export const userSlice = createSlice({
  name: "itas_redux",
  initialState: {
    // These variables are used to store initial sates and to be used in anywhere in the programmed like global variable.

    isUserLoggedIn: false, // to store user logged in status true or false
    user: null, // to store user details
    navBarComponent: "permitDisplay", // to store page name which is to be displayed. default is login
    lanStatus: {}, // to store lan status
    selectedTerminal: "", // to store selected material name
    configdata: [], // to store expand modal configdata
    reduxPipelineList: {}, // to store tfmswebsocket in reduxPipelineList variable and same to be used while tfms websocket is close
    LPData: [], // to store TLF gantry details from TLFWebsocket
    MaterialList: [], // to store all tfms material details from tfms websocket
    ShowList: [], // to store list of parameters from tfms websocket which are to be displayed while we click on a tank
    activeFooterButton: [], // to store button name which have been clicked to change their css style. It is used in some pages.
    utilitiesElement: "DYKE", // to store utilities footer button name. default is DYKE
    fasElement: "SMOKE DETECTOR", // to store fas footer button name. default is SMOKE DETECTOR
    mfmFooter: "live", // to store mfm footer button name. default is live
    alarmEventFooter: "show_critical",
    TANKModeString: {}, // to store tank mode number to string list from tfms websocket
    TANKTypeString: {}, // to store tank type number to string list from tfms websocket
    PumpSeqString: {}, // to store pump sequence number to string list from tfms websocket
    misc_devices_data: [], // to store misc devices list from tfms websocket
    navbarON: false, // this flag is used to display the itas page is full screen mode
    activeGantry: 1, // to store gantry number to be displayed. default 1
    dragOn: false, // to enable whether the truck can be dragged for bay change or not in BCU Utility page.
    plantName: "", // to store plant name from tfms websocket
    bcuSerialPortDetails: [], // to store Bcu Serial Port Details from tlf websocket
    trendHistoryData: [], // to store Trend History Data
    PermitList: [], // to store Permit List data from Google Sheets
  },
  reducers: {
    Login: (state) => {
      state.isUserLoggedIn = true;
    },
    CurrentUser: (state, action) => {
      state.user = action.payload.user;
    },
    Logout: (state) => {
      state.isUserLoggedIn = false;
      state.user = null;
      sessionStorage.clear();
      sessionStorage.removeItem("persist:root");
      storage.removeItem("persist:root");
      // window.location.reload();
    },
    NavBarComponent: (state, action) => {
      state.navBarComponent = action.payload;
    },
    ActiveFooterButton: (state, action) => {
      state.activeFooterButton = action.payload;
    },
    LanStatus: (state, action) => {
      state.lanStatus = action.payload;
    },
    SelectedTerminal: (state, action) => {
      state.selectedTerminal = action.payload;
    },
    SetConfigData: (state, action) => {
      state.configdata = action.payload;
    },
    SetReduxPipelineList: (state, action) => {
      state.reduxPipelineList = action.payload;
    },
    SetMaterialList: (state, action) => {
      state.MaterialList = action.payload;
    },
    SetShowList: (state, action) => {
      state.ShowList = action.payload;
    },
    UtilitiesElement: (state, action) => {
      state.utilitiesElement = action.payload;
    },
    FasElement: (state, action) => {
      state.fasElement = action.payload;
    },
    SetMFMFooter: (state, action) => {
      state.mfmFooter = action.payload;
    },
    SetAlarmEventFooter: (state, action) => {
      state.alarmEventFooter = action.payload;
    },
    SetTANKModeString: (state, action) => {
      state.TANKModeString = action.payload;
    },
    SetTANKTypeString: (state, action) => {
      state.TANKTypeString = action.payload;
    },
    SetPumpSeqString: (state, action) => {
      state.PumpSeqString = action.payload;
    },
    SetMiscDevicesData: (state, action) => {
      state.misc_devices_data = action.payload;
    },
    NavbarON: (state, action) => {
      state.navbarON = action.payload;
    },
    setActiveGantry: (state, action) => {
      state.activeGantry = action.payload;
    },
    SetDragOn: (state, action) => {
      state.dragOn = action.payload;
    },
    SetPlantName: (state, action) => {
      state.plantName = action.payload;
    },
    SetBcuSerialPortDetails: (state, action) => {
      state.bcuSerialPortDetails = action.payload;
    },
    SetTrendHistoryData: (state, action) => {
      state.trendHistoryData = action.payload;
    },
    SetLPData: (state, action) => {
      state.LPData = action.payload;
    },
    SetPermitList: (state, action) => {
      state.PermitList = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  Login,
  CurrentUser,
  Logout,
  Register,
  NavBarComponent,
  LanStatus,
  SelectedTerminal,
  SetConfigData,
  SetReduxPipelineList,
  SetMaterialList,
  SetShowList,
  ActiveFooterButton,
  UtilitiesElement,
  FasElement,
  SetMFMFooter,
  SetAlarmEventFooter,
  setCommandConfirmationFromUser,
  SetTANKModeString,
  SetPumpSeqString,
  SetTANKTypeString,
  SetMiscDevicesData,
  NavbarON,
  setActiveGantry,
  SetDragOn,
  SetPlantName,
  SetBcuSerialPortDetails,
  SetTrendHistoryData,
  SetLPData,
  SetPermitList,
} = userSlice.actions;

export default userSlice.reducer;
