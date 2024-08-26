import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import applicationServices from "../services/application.services";

export const getStats = createAsyncThunk("application/getStats", async () => {
  try {
    const data = await applicationServices.getStats();
    return data;
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
});

export const getAllApplication = createAsyncThunk(
  "application/getAllApplication",
  async (_, thunkAPI) => {
    try {
      const data = await applicationServices.getAllApplication();
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const applicationSlice = createSlice({
  name: "application",
  initialState: {
    getStats: null,
    allApplication: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStats.fulfilled, (state, action: PayloadAction<any>) => {
      state.getStats = action.payload;
    });
    builder.addCase(getStats.rejected, (state, action) => {
      state.getStats = null;
      const errorMessage =
        action.error.message || "Failed to fetch user stats.";
      setMessage(errorMessage);
    });

    builder.addCase(
      getAllApplication.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.allApplication = action.payload;
      }
    );
    builder.addCase(getAllApplication.rejected, (state, action) => {
      state.allApplication = null;
      const errorMessage =
        action.error.message || "Failed to fetch all application";
      setMessage(errorMessage);
    });
  },
});

const { reducer } = applicationSlice;
export default reducer;
