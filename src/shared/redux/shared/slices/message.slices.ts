import { createAsyncThunk } from "@reduxjs/toolkit";
import shareApplicationServices from "../services/shareApplication.services";

export const getUserProfile = createAsyncThunk(
    "shareApplication/getProfile",
    async (_, thunkAPI) => {
      try {
        const data = await shareApplicationServices.getUserProfile();
        return data;
      } catch (error: any) {
        const message = error.message;
        error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );