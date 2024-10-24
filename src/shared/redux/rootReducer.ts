import { combineReducers } from "@reduxjs/toolkit";
import sharedLandingReducers from "./shared/slices/shareLanding.slices";
import shareApplicationReducers from "./shared/slices/shareApplication.slices";
import notificationApplicationReduers from "./admin/slices/notificationApplication.slices"
import messageReduers from "./shared/slices/message.slices"
import applicatonReducer from "./admin/slices/application.slices";

const rootReducer = combineReducers({
  shared: sharedLandingReducers,
  application: applicatonReducer,
  shareApplication: shareApplicationReducers,
  notificationApplication: notificationApplicationReduers,
  message: messageReduers,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
