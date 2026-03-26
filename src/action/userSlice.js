import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
export const userSlice = createSlice({
  name: "myApp_redux",
  initialState: {
    // These variables are used to store initial sates and to be used in anywhere in the programmed like global variable.
    navBarComponent: "", // to store page name which is to be displayed. default is login
    selectedTerminal: "", // to store selected material name
    PermitList: [], // to store Permit List data from Google Sheets
    locationList: [], // to store location list data from Google Sheets
    usertype:'Normal'
  },
  reducers: {
    NavBarComponent: (state, action) => {
      state.navBarComponent = action.payload;
    },
    SelectedTerminal: (state, action) => {
      state.selectedTerminal = action.payload;
    },
    SetPermitList: (state, action) => {
      state.PermitList = action.payload;
    },
    SetLocationList: (state, action) => {
      state.locationList = action.payload;
    },
    SetUsertype: (state, action) => {
      state.usertype = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  NavBarComponent,
  SelectedTerminal,
  SetPermitList,
  SetLocationList,
  SetUsertype
} = userSlice.actions;

export default userSlice.reducer;
