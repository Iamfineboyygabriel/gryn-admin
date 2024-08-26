import { combineReducers } from "@reduxjs/toolkit";
import sharedLandingReducers from "./shared/slices/shareLanding.slices";
import shareApplicationReducers from "./shared/slices/shareApplication.slices";
import applicatonReducer from "./admin/slices/application.slices";

const rootReducer = combineReducers({
  shared: sharedLandingReducers,
  application: applicatonReducer,
  shareApplication: shareApplicationReducers,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
