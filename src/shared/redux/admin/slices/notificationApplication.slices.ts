import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import { RootState } from "../../store";
import notificationApplicationServices from "../services/notificationApplication.services";

export const createNews = createAsyncThunk(
    "notificationApplication/createNews",
    async (body: any, thunkAPI) => {
      try {
        const data = await notificationApplicationServices.createNews(body);
        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong!";
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  export const createNewsDrafs = createAsyncThunk(
    "notificationApplication/createNewsDraft",
    async (body: any, thunkAPI) => {
      try {
        const data = await notificationApplicationServices.createNewsDraft(body);
        return data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong!";
        thunkAPI.dispatch(setMessage(message));
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
   
  export const getAllNews = createAsyncThunk(
    "notificationApplication/getAllNews",
    async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
      const response = await notificationApplicationServices.getAllNews(page, limit, search);
      return {
        news: response,
        totalPages: response.data.totalPages,
        currentPage: page
      };
    }
  );

  export const getAllDraftedNews = createAsyncThunk(
    "notificationApplication/getAllDraftedNews",
    async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
      const response = await notificationApplicationServices.getAllDraftedNews(page, limit, search);
      return {
        draftedNews: response,
        totalPages: response?.data?.totalPages,
        currentPage: page
      };
    }
  );

  export const CreateNotification  = createAsyncThunk(
    "notificationApplication/createNotification ",
    async ({ body, userId }: { body: any; userId: any }, thunkAPI) => {
      try {
        const data = await notificationApplicationServices.CreateNotification(userId, body);
        return data;
      } catch (error: any) {
        const message = error;
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  export const getAllNotification = createAsyncThunk(
    "notificationApplication/getAllNotification",
     async ({ page, limit }: { page: number; limit: number; }) => {
       const response = await notificationApplicationServices.getAllNotification(page, limit);
       return {
         notifications: response.data,
         totalPages: response.data.totalPages,
         currentPage: page
       };
     }
   );

   export const updateNotificationStatus = createAsyncThunk(
    "notificationApplication/updateNotificationStatus",
     async (notificationId:string, thunkAPI) => {
      try{
      const response = await notificationApplicationServices.updateNotificationStatus(notificationId);
        return response.data
      }catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
   }
   );
   
   export const getNotificationCount = createAsyncThunk(
    "notificationApplication/getNotificationCount",
    async (_, thunkAPI) => {
      try {
        const data = await notificationApplicationServices.getNotificationCount();
        return data;
      } catch (error: any) {
        const message = error.message;
        error.toString();
        return thunkAPI.rejectWithValue(message);
      }
    }
  );

  export const deleteNews = createAsyncThunk(
    "notificationApplication/deleteNews",
     async (newsId: any, thunkAPI) => {
      try{
      const response = await notificationApplicationServices.deleteNews(newsId);
        return response.data
      }catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
   }
   );

interface ApplicationState {
    registerNews: null;
    registerNewsDraft: null;
    registerNotification: null,
    notificationCount: null,
    updateNotification: null,
    removeNews:null,
    loading: boolean;
    error: string | null;
    sort: string | null;
    status: string | null;
    month: string | null;
    search: string;
    searchTerm: string;
    allNews: {
      news: any[];
      totalPages: number;
      currentPage: number;
    };
    allNotification: {
      notifications: any[];
      totalPages: number;
      currentPage: number;
    };
    allDraftedNews: {
      draftedNews: any[];
      totalPages: number;
      currentPage: number;
    };
   allNewsSearchTerm: string;
   allDraftedNewsSearchTerm: string;
  }
  
  const initialState: ApplicationState = {
    registerNews: null,
    removeNews: null,
    registerNewsDraft: null,
    registerNotification: null,
    updateNotification: null,
    notificationCount: null,
    loading: false,
    error: null,
    sort: null,
    status: null,
    month: null,
    search: '',
    searchTerm: "",
    allNews: {
      news: [],
      totalPages: 0,
      currentPage: 1,
    },
    allNotification: {
      notifications: [],
      totalPages: 0,
      currentPage: 1,
    },
    allDraftedNews: {
      draftedNews: [],
      totalPages: 0,
      currentPage: 1,
    },
   allNewsSearchTerm: '',
   allDraftedNewsSearchTerm: '',
  };



export const notificationApplicationSlice = createSlice({
    name: "notificationApplication",
    initialState,
    reducers: {
      setAllNewsSearchTerm: (state, action: PayloadAction<string>) => {
        state.allNewsSearchTerm = action.payload;
      },
      setAllDraftedNewsSearchTerm: (state, action: PayloadAction<string>) => {
        state.allDraftedNewsSearchTerm = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
  .addCase(createNews.fulfilled, (state, action: PayloadAction<any>) => {
    state.registerNews = action.payload;
  })
  .addCase(createNews.rejected, (state, action) => {
    state.registerNews = null;
    const errorMessage = action.error.message || "News creation failed.";
    setMessage(errorMessage);
  })

  .addCase(createNewsDrafs.fulfilled, (state, action: PayloadAction<any>) => {
    state.registerNewsDraft = action.payload;
  })
  .addCase(createNewsDrafs.rejected, (state, action) => {
    state.registerNewsDraft = null;
    const errorMessage = action.error.message || "News drafts creation failed.";
    setMessage(errorMessage);
  })

  .addCase(getAllNews.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getAllNews.fulfilled, (state, action: PayloadAction<{
    news: any[];
    totalPages: number;
    currentPage: number;
  }>) => {
    state.loading = false;
    state.allNews = action.payload;
  })
  .addCase(getAllNews.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to fetch news";
  })

  .addCase(getAllDraftedNews.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getAllDraftedNews.fulfilled, (state, action: PayloadAction<{
    draftedNews: any[];
    totalPages: number;
    currentPage: number;
  }>) => {
    state.loading = false;
    state.allDraftedNews = action.payload;
  })
  .addCase(getAllDraftedNews.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to fetch drafted news";
  })

  .addCase(
    CreateNotification.fulfilled,
    (state, action: PayloadAction<any>) => {
      state.registerNotification = action.payload;
    }
  )
  .addCase(CreateNotification.rejected, (state, action) => {
    state.registerNotification = null;
    const errorMessage =
      action.error.message || "notification failed to send.";
    setMessage(errorMessage);
  })

  .addCase(getAllNotification.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(getAllNotification.fulfilled, (state, action: PayloadAction<{
    notifications: any[];
    totalPages: number;
    currentPage: number;
  }>) => {
    state.loading = false;
    state.allNotification = action.payload;
  })
  .addCase(getAllNotification.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to fetch news";
  })

  .addCase(
    getNotificationCount .fulfilled,
    (state, action: PayloadAction<any>) => {
      state.notificationCount = action.payload;
    }
  )
  .addCase(getNotificationCount .rejected, (state, action) => {
    state.notificationCount = null;
    const errorMessage =
      action.error.message || "Failed to fetch user notification.";
    setMessage(errorMessage);
  })
  
  .addCase(updateNotificationStatus.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateNotificationStatus.fulfilled, (state, action: PayloadAction<any>) => {
    state.loading = false;
    state.updateNotification = action.payload;
  })
  .addCase(updateNotificationStatus.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to update Notification";
  })

  .addCase(deleteNews.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(deleteNews.fulfilled, (state, action: PayloadAction<any>) => {
    state.loading = false;
    state.removeNews = action.payload;
  })
  .addCase(deleteNews.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message || "Failed to update Notification";
  })
}
})


  const { reducer } = notificationApplicationSlice;
  export const {
    setAllNewsSearchTerm,
    setAllDraftedNewsSearchTerm ,
  } = notificationApplicationSlice.actions;
  export default reducer;
