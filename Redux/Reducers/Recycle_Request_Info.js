import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Coordinates: [],
  ongoingRoute: false,
  Recycleitems: {},
  customer_id: "",
  RR_address: "",
  RR_Coordinates: [],
  selected_route: "1",
};

export const Recycle_Request_Info_Slice = createSlice({
  name: "Recycle_Request_Info",
  initialState,
  reducers: {
    RecycleItemDetail: (state, action) => {
      state.Recycleitems = action.payload;
    },
    RR_Coordinates: (state, action) => {
      state.RR_Coordinates = action.payload;
    },
    RR_Address: (state, action) => {
      state.RR_address = action.payload;
    },
    RR_Customer_id: (state, action) => {
      state.customer_id = action.payload;
    },
    RecycleLocations: (state, action) => {
      state.Coordinates = action.payload;
    },
    OngoingRoute: (state, action) => {
      state.ongoingRoute = action.payload;
    },
    SelectedRoute: (state, action) => {
      state.selected_route = action.payload;
    },
  },
});
export const {
  RecycleLocations,
  OngoingRoute,
  RecycleItemDetail,
  RR_Customer_id,
  RR_Address,
  RR_Coordinates,
  SelectedRoute,
} = Recycle_Request_Info_Slice.actions;

export default Recycle_Request_Info_Slice.reducer;
