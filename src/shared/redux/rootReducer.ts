import { combineReducers } from "@reduxjs/toolkit";
import sharedLandingReducers from "./shared/slices/shareLanding.slices";
import shareApplicationReducers from "./shared/slices/shareApplication.slices";
import notificationApplicationReduers from "./admin/slices/notificationApplication.slices"
import applicatonReducer from "./admin/slices/application.slices";

const rootReducer = combineReducers({
  shared: sharedLandingReducers,
  application: applicatonReducer,
  shareApplication: shareApplicationReducers,
  notificationApplication: notificationApplicationReduers,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
