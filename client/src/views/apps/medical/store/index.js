// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const getStatusList = createAsyncThunk(
  "appMedical/status/list",
  async () => {
    const response = await axios.get(`status/list`);
    return response.data;
  }
);

export const getMedicalList = createAsyncThunk(
  "appMedical/medical/list",
  async (patentId) => {
    const response = await axios.get(`/medical/list?patient_id=${patentId}`);
    return response.data;
  }
);

export const getMedical = createAsyncThunk(
  "appMedical/medical/single",
  async (medical) => {
    const response = await axios.get(`/medical/single/${medical}`);
    return response.data;
  }
);

export const updateMedical = createAsyncThunk(
  "appMedical/medical/update",
  async ({ medical_id, medical }, dispatch) => {
    const response = await axios.put(`/medical/update/${medical_id}`, medical);
    dispatch(getMedical(medical_id));
    return response.data;
  }
);

export const getTipList = createAsyncThunk("appPatient/tip/list", async () => {
  const response = await axios.get(`/tip/list`);
  return response.data;
});

export const addMedical = createAsyncThunk(
  "appMedical/addMedical",
  async (medical, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post("medical/create", medical);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTip = createAsyncThunk(
  "appMedical/addTip",
  async (tip, { dispatch }) => {
    await axios.post("tip/create", tip);
    return tip;
  }
);

export const getCategoryTipList = createAsyncThunk(
  "appMedical/category-tip/list",
  async () => {
    const response = await axios.get(`/category-tip/list`);
    return response.data;
  }
);

export const getUserList = createAsyncThunk(
  "appMedical/user/list",
  async () => {
    const response = await axios.get(`/user/list`);
    return response.data;
  }
);

export const getMedicalHistoryList = createAsyncThunk(
  "appMedical/medical-history/list",
  async () => {
    const response = await axios.get(`medical-history/list`);
    return response.data;
  }
);
export const getUserSupport = createAsyncThunk(
  "appMedical/user-support/list",
  async () => {
    const response = await axios.get(`/user/list`);
    return response.data;
  }
);

export const createPrescription = createAsyncThunk(
  "appMedical/create-prescription",
  async (prescription, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post("medical/create-prescription", prescription);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const appMedicalSlice = createSlice({
  name: "appMedical",
  initialState: {
    status: [],
    categoryTipList: [],
    userList: [],
    tipList: [],
    single: {
      data: {},
      loading: false,
      error: false,
    },
    createMedical: {
      data: {},
      loading: false,
      error: false,
    },
    updateMedical: {
      data: {},
      loading: false,
      error: false,
    },
    medicalHistoryList: {
      data: {},
      loading: false,
      error: false,
    },
    userSupport: {
      data: {},
      loading: false,
      error: false,
    },
    addPrescription: {
      data: {},
      loading: false,
      error: false,
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatusList.fulfilled, (state, action) => {
        state.status = action.payload.docs;
        // state.data = action.payload.docs
      })
      .addCase(getCategoryTipList.fulfilled, (state, action) => {
        state.categoryTipList = action.payload.docs;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userList = action.payload.docs;
      })
      .addCase(getTipList.fulfilled, (state, action) => {
        state.tipList = action.payload.docs;
      })
      // ** Get medical list
      .addCase(getMedical.pending, (state) => {
        state.single.loading = true;
      })
      .addCase(getMedical.fulfilled, (state, action) => {
        state.single.loading = false;
        state.single.data = action.payload;
        state.single.error = false;
      })
      .addCase(getMedical.rejected, (state) => {
        state.single.loading = false;
        state.single.error = true;
      })
      // ** Create medical
      .addCase(addMedical.pending, (state) => {
        state.createMedical.loading = true;
      })
      .addCase(addMedical.fulfilled, (state, action) => {
        state.createMedical.loading = false;
        state.createMedical.data = action.payload;
        state.createMedical.error = false;
      })
      .addCase(addMedical.rejected, (state, action) => {
        state.createMedical.loading = false;
        state.createMedical.data = action.payload;
        state.createMedical.error = true;
      })
      // ** Update medical
      .addCase(updateMedical.pending, (state) => {
        state.updateMedical.loading = true;
      })
      .addCase(updateMedical.fulfilled, (state, action) => {
        state.updateMedical.loading = false;
        state.updateMedical.data = action.payload;
        state.updateMedical.error = false;
      })
      .addCase(updateMedical.rejected, (state) => {
        state.updateMedical.loading = false;
        state.updateMedical.error = true;
      })
      // ** Get medical history
      .addCase(getMedicalHistoryList.pending, (state) => {
        state.medicalHistoryList.loading = true;
      })
      .addCase(getMedicalHistoryList.fulfilled, (state, action) => {
        state.medicalHistoryList.loading = false;
        state.medicalHistoryList.data = action.payload;
        state.medicalHistoryList.error = false;
      })
      .addCase(getMedicalHistoryList.rejected, (state) => {
        state.medicalHistoryList.loading = false;
        state.medicalHistoryList.error = true;
      })
      // ** Get User Support
      .addCase(getUserSupport.pending, (state) => {
        state.userSupport.loading = true;
      })
      .addCase(getUserSupport.fulfilled, (state, action) => {
        state.userSupport.loading = false;
        state.userSupport.data = action.payload;
        state.userSupport.error = false;
      })
      .addCase(getUserSupport.rejected, (state) => {
        state.userSupport.loading = false;
        state.userSupport.error = true;
      })
      // ** Create Prescription
      .addCase(createPrescription.pending, (state) => {
        state.addPrescription.loading = true;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.addPrescription.loading = false;
        state.addPrescription.data = action.payload;
        state.addPrescription.error = false;
      })
      .addCase(createPrescription.rejected, (state) => {
        state.addPrescription.loading = false;
        state.addPrescription.error = true;
      });
  },
});

export default appMedicalSlice.reducer;
