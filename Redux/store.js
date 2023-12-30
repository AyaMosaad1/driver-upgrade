import { configureStore } from "@reduxjs/toolkit";
import DriverDetailSlice from "./Reducers/DriverInfo";
import Recycle_Request_Info from "./Reducers/Recycle_Request_Info";

export const store = configureStore({
  reducer: {
    driverdetails: DriverDetailSlice,
    recyclerequestsdetails: Recycle_Request_Info,
  },
});
