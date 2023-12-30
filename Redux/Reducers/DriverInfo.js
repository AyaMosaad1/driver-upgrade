import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  thumbnail: "",
  Profile: {},
  privacypolicy: "",
  termsandconditions: "",
  notificationcount: 0,
  NotificationS: {},
  sortvariable: "distance",
  Coordinates_Driver: {},
  Filter_Dates: "",
};

export const DriverDetailSlice = createSlice({
  name: "DriverDetail",
  initialState,
  reducers: {
    DriverDetails: (state, action) => {
      state.Profile = action.payload;
    },
    DriverThumbnail: (state, action) => {
      state.thumbnail = action.payload;
    },
    DriverinfoStoreReseted: (state) => {
      initialState;
    },
    Driverprivacypolicy: (state, action) => {
      state.privacypolicy = action.payload;
    },
    Driverterms: (state, action) => {
      state.termsandconditions = action.payload;
    },
    NotificationCount: (state, action) => {
      state.notificationcount = action.payload;
    },
    NotificationsRes: (state, action) => {
      state.NotificationS = action.payload;
    },
    SortingVariable: (state, action) => {
      state.sortvariable = action.payload;
    },
    DriverCoordinates: (state, action) => {
      state.Coordinates_Driver = action.payload;
    },
    FilterDateApply: (state, action) => {
      state.Filter_Dates = action.payload;
    },
  },
});
export const {
  DriverThumbnail,
  DriverDetails,
  DriverinfoStoreReseted,
  Driverprivacypolicy,
  Driverterms,
  NotificationCount,
  NotificationsRes,
  SortingVariable,
  DriverCoordinates,
  FilterDateApply,
} = DriverDetailSlice.actions;

export default DriverDetailSlice.reducer;
