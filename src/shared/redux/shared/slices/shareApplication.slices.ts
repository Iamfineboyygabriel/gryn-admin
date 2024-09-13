import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { setMessage } from "../../message.slices";
import shareApplicationServices from "../services/shareApplication.services";

interface UpdateProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface CreateApplicationBody {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  state?: string;
  localGovtArea?: string;
  country: CustomCountry | null;
  internationalPassportNumber?: string;
  degreeType?: string;
  course?: string;
  university?: string;
}

type CustomCountry = {
  cca2: string;
  name: string;
};

interface UpdateStudentBody {
  firstName: string;
  lastName: string;
  // otherName?: string;
}

interface UpdateStudentPayload {
  body: UpdateStudentBody;
  userId: string;
}


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

export const getCurrentUser = createAsyncThunk(
  "shareApplication/getCurrentProfile",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getCurrentUser();
      return data;
    } catch (error: any) {
      const message = error.message || "Failed to fetch user details";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "shareApplication/uploadProfile",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.uploadAvatar(body);
      return data;
    } catch (error: any) {
      const message = error.message || "Something went wrong!";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "shareApplication/updateProfile",
  async (body: UpdateProfile, thunkAPI) => {
    try {
      const data = await shareApplicationServices.updateProfile(body);
      return data;
    } catch (error: any) {
      error.toString();
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const updatePassword = createAsyncThunk(
  "shareApllication/updatePassword",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.updatePassword(body);
      return data;
    } catch (error: any) {
      error.toString();
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createVisaApplication = createAsyncThunk(
  "shareApllication/createVisaApplication",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createVisaApplication(body);
      return data;
    } catch (error: any) {
      const message = error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTopCountries = createAsyncThunk(
  "shareApplication/getTopCountries",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getTopCountries();
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTopUniversities = createAsyncThunk(
  "shareApplication/getTopUniversities",
  async (_, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getTopUniversities();
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllStudents = createAsyncThunk(
  "shareApplication/getAllStudents",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllStudents(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllAgents = createAsyncThunk(
  "shareApplication/getAllAgents",
   async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
     const response = await shareApplicationServices.getAllAgents(page, limit, search);
     return {
       agents: response.data,
       totalPages: response.data.totalPages,
       currentPage: page
     };
   }
 );

export const createInvoice = createAsyncThunk(
  "shareApplication/createInvoice",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createInvoice(body);
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

export const createDraft = createAsyncThunk(
  "shareApplication/createDraft",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createDraft(body);
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

export const getAllDraftItems = createAsyncThunk(
  "shareApplication/getAllDraftItems",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllDraftItems(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllInvoice = createAsyncThunk(
  "shareApplication/getAllInvoice",
  async ({ page, limit }: { page: number; limit: number }, thunkAPI) => {
    try {
      const data = await shareApplicationServices.getAllInvoice(page, limit);
      return data;
    } catch (error: any) {
      const message = error.message;
      error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createApplication = createAsyncThunk(
  "shareApplication/createApplication",
  async (body: CreateApplicationBody, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createApplication(body);
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

export const getAllVisaApplication = createAsyncThunk(
  "shareApplication/getAllVisaApplication",
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await shareApplicationServices.getAllVisaApplication(page, limit, search);
    return {
      visas: response.data.applications,
      totalPages: response.data.totalPages,
      currentPage: page
    };
  }
);

export const getAllPendingAgents = createAsyncThunk(
 "shareApplication/getAllPendingAgents",
  async ({ page, limit, search }: { page: number; limit: number; search: string }) => {
    const response = await shareApplicationServices.getAllPendingAgents(page, limit, search);
    return {
      allPending: response.data,
      totalPages: response.data.totalPages,
      currentPage: page
    };
  }
);

export const createStudent = createAsyncThunk(
  "shareApllication/createStudent",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createStudent(body);
      return data;
    } catch (error: any) {
      const message = error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createAgent = createAsyncThunk(
  "shareApllication/createAgent",
  async (body: any, thunkAPI) => {
    try {
      const data = await shareApplicationServices.createAgent(body);
      return data;
    } catch (error: any) {
      const message = error;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const findStudentByEmail = createAsyncThunk(
  "shareApplication/findStudentByEmail",
   async (email:string) => {
     const response = await shareApplicationServices.findStudentByEmail(email);
     return response.data
   }
 );

 export const findAgentByEmail = createAsyncThunk(
  "shareApplication/findAgentByEmail",
   async (email:string) => {
     const response = await shareApplicationServices.findAgentByEmail(email);
     return response.data
   }
 );


 export const updateStudentCreated = createAsyncThunk(
  "shareApplication/updateStudentCreated",
  async ({ body, userId }: UpdateStudentPayload, thunkAPI) => {
    try {
      const data = await shareApplicationServices.updateStudentCreated(body, userId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const updateAgentCreated = createAsyncThunk(
  "shareApplication/updateAgentCreated",
  async ({ body, userId }: UpdateStudentPayload, thunkAPI) => {
    try {
      const data = await shareApplicationServices.updateAgentCreated(body, userId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

interface ApplicationState {
  userProfile: null;
  currentUser: null;
  avatarUrl: null;
  updateProfile: null;
  updatePassword: null;
  registerVisaApplication: null;
  topCountries: null;
  topUniversities: null;
  registerInvoice: null;
  registerDraft: null;
  registerApplication: null;
  registerVisaAppliction: null;
  registerStudent:null;
  registerAgent:null,
  updateStudent: null,
  updateAgent:null,
  student: null;
  agent:null,
  allStudents: {
    data: {
      students: any[];
    } | null;
    totalItems: number;
  };
  allDraftItems: {
    data: {
      draftsItems: any[];
    } | null;
    totalItems: number;
  };
  allInvoice: {
    data: {
      invoice: any[];
    } | null;
    totalItems: number;
  };
  allAgents: {
    agents: any[]; 
    totalPages: number;
    currentPage: number;
  };
  allVisa: {
    visas: any[];
    totalPages: number;
    currentPage: number;
  };
  allPendingAgents: {
    allPending: any[]; 
    totalPages: number;
    currentPage: number;
  };
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const initialState: ApplicationState = {
  userProfile: null,
  currentUser: null,
  avatarUrl: null,
  updateProfile: null,
  updatePassword: null,
  registerVisaApplication: null,
  registerStudent:null,
  registerAgent:null,
  topCountries: null,
  topUniversities: null,
  registerApplication: null,
  registerVisaAppliction: null,
  updateStudent: null,
  updateAgent: null,
  student: null,
  agent:null,
  allStudents: {
    data: null,
    totalItems: 0,
  },
  registerInvoice: null,
  registerDraft: null,
  allDraftItems: {
    data: null,
    totalItems: 0,
  },
  allInvoice: {
    data: null,
    totalItems: 0,
  },
   allAgents: {
    agents: [],
    totalPages: 0,
    currentPage: 1,
  },
  allVisa: {
    visas: [],
    totalPages: 0,
    currentPage: 1,
  },
  allPendingAgents: {
    allPending: [],
    totalPages: 0,
    currentPage: 1,
  },
  loading: false,
  error: null,
  searchTerm: '',
};

export const shareApplicationSlice = createSlice({
  name: "shareApplication",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.userProfile = action.payload;
        }
      )
      .addCase(getUserProfile.rejected, (state, action) => {
        state.userProfile = null;
        const errorMessage =
          action.error.message || "Failed to fetch user profile.";
        setMessage(errorMessage);
      })

      .addCase(
        getCurrentUser.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.currentUser = action.payload;
        }
      )
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.currentUser = null;
        const errorMessage =
          action.error.message || "Failed to fetch current user profile.";
        setMessage(errorMessage);
      })

      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.avatarUrl = action.payload.data.publicURL;
      })

      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.updateProfile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateProfile = null;
        const errorMessage =
          action.error.message || "Failed to update user profile.";
        setMessage(errorMessage);
      })

      .addCase(updatePassword.fulfilled, (state, action) => {
        state.updatePassword = action.payload as null;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.updatePassword = null;
      })

      .addCase(
        createVisaApplication.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.registerVisaApplication = action.payload;
        }
      )
      .addCase(createVisaApplication.rejected, (state, action) => {
        state.registerVisaApplication = null;
        const errorMessage =
          action.error.message || "Visa Application creation failed.";
        setMessage(errorMessage);
      })

      .addCase(
        getTopCountries.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.topCountries = action.payload;
        }
      )
      .addCase(getTopCountries.rejected, (state, action) => {
        state.topCountries = null;
        const errorMessage =
          action.error.message || "Failed to fetch top countries";
        setMessage(errorMessage);
      })

      .addCase(
        getTopUniversities.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.topUniversities = action.payload;
        }
      )
      .addCase(getTopUniversities.rejected, (state, action) => {
        state.topUniversities = null;
        const errorMessage =
          action.error.message || "Failed to fetch top universities.";
        setMessage(errorMessage);
      })

      .addCase(getAllStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        getAllStudents.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStudents.data = action.payload.data;
          state.allStudents.totalItems = action.payload.totalItems;
          state.loading = false;
        }
      )

      .addCase(getAllStudents.rejected, (state, action) => {
        state.allStudents = {
          data: null,
          totalItems: 0,
        };
        const errorMessage =
          action.error.message || "Failed to fetch all students.";
        setMessage(errorMessage);
      })

     .addCase(getAllAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAgents.fulfilled, (state, action: PayloadAction<{
        agents: any[];
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allAgents = action.payload;
      })
      .addCase(getAllAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch all agents";
      })

      .addCase(createInvoice.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerInvoice = action.payload;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.registerInvoice = null;
        const errorMessage = action.error.message || "Invoice creation failed.";
        setMessage(errorMessage);
      })

      .addCase(createDraft.fulfilled, (state, action: PayloadAction<any>) => {
        state.registerDraft = action.payload;
      })
      .addCase(createDraft.rejected, (state, action) => {
        state.registerDraft = null;
        const errorMessage = action.error.message || "Draft creation failed.";
        setMessage(errorMessage);
      })

      .addCase(
        getAllDraftItems.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allDraftItems = action.payload;
          state.allInvoice.totalItems = action.payload.totalItems;
          state.loading = false;
        }
      )
      .addCase(getAllDraftItems.rejected, (state, action) => {
        state.allDraftItems = {
          data: null,
          totalItems: 0,
        };
      })

      .addCase(getAllInvoice.fulfilled, (state, action: PayloadAction<any>) => {
        state.allInvoice = action.payload;
        state.allInvoice.totalItems = action.payload.totalItems;
        state.loading = false;
      })
      .addCase(getAllInvoice.rejected, (state, action) => {
        state.allInvoice = {
          data: null,
          totalItems: 0,
        };
      })

      .addCase(
        createApplication.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.registerApplication = action.payload;
        }
      )
      .addCase(createApplication.rejected, (state, action) => {
        state.registerApplication = null;
        const errorMessage =
          action.error.message || "Application creation failed.";
        setMessage(errorMessage);
      })


      .addCase(getAllVisaApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVisaApplication.fulfilled, (state, action: PayloadAction<{
        visas: any[];
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allVisa = action.payload;
      })
      .addCase(getAllVisaApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch visa applications";
      })

     .addCase(getAllPendingAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPendingAgents.fulfilled, (state, action: PayloadAction<{
        allPending: any[];
        totalPages: number;
        currentPage: number;
      }>) => {
        state.loading = false;
        state.allPendingAgents = action.payload;
      })
      .addCase(getAllPendingAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch pending agents";
      })

      .addCase(
        createStudent.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.registerStudent = action.payload;
        }
      )
      .addCase(createStudent.rejected, (state, action) => {
        state.registerStudent = null;
        const errorMessage =
          action.error.message || "Student Application creation failed.";
        setMessage(errorMessage);
      })

      .addCase(
        createAgent.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.registerAgent = action.payload;
        }
      )
      .addCase(createAgent.rejected, (state, action) => {
        state.registerAgent = null;
        const errorMessage =
          action.error.message || "Agent Application creation failed.";
        setMessage(errorMessage);
      })

       .addCase(findStudentByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findStudentByEmail.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(findStudentByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to find student";
      })

      .addCase(findAgentByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findAgentByEmail.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.agent = action.payload;
      })
      .addCase(findAgentByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to find agent";
      })

      .addCase(updateStudentCreated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateStudentCreated.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.updateStudent = action.payload;
          state.error = null;
        },
      )
      .addCase(updateStudentCreated.rejected, (state, action) => {
        state.loading = false;
        state.updateStudent = null;
        state.error = action.payload as string || "Failed to update user profile.";
      })

      .addCase(updateAgentCreated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAgentCreated.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.updateAgent = action.payload;
          state.error = null;
        },
      )
      .addCase(updateAgentCreated.rejected, (state, action) => {
        state.loading = false;
        state.updateAgent = null;
        state.error = action.payload as string || "Failed to update user profile.";
      });
  },
});

const { reducer } = shareApplicationSlice;
export default reducer;
