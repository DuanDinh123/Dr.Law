// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";

export const getPatientList = createAsyncThunk(
  "appPatient/patient/list",
  async (paginate) => {
    const { page, limit, fieldSort, sortValue, search } = paginate;
    const response = await axios.get(`patient/list`, {
      params: {
        page,
        limit,
        fieldSort,
        sortValue,
        search,
      },
    });
    return response.data;
  }
);

export const createPatient = createAsyncThunk(
  "appPatient/patient/create",
  async (patient, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post("patient/create", patient);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPatient = createAsyncThunk(
  "appPatient/patient/single",
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.get(`patient/single/${id}`);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePatient = createAsyncThunk(
  "appPatient/patient/update",
  async ({ id, patient }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.put(`patient/update/${id}`, patient);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePatient = createAsyncThunk(
  "appPatient/patient/delete",
  async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.delete(`patient/delete/${id}`);
      return fulfillWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTipList = createAsyncThunk("appPatient/tip/list", async () => {
  const response = await axios.get(`/tip/list`);
  return response.data;
});

export const addTip = createAsyncThunk(
  "appPatient/tip/create",
  async (tiplist, { dispatch }) => {
    await axios.post("tip/create", tiplist);
    await dispatch(getTipList());
    return tiplist;
  }
);

export const getProvince = createAsyncThunk(
  "appPatient/province/list",
  async () => {
    const response = await axios.get("/province");
    return response.data;
  }
);

export const getDistrict = createAsyncThunk(
  "appPatient/district/list",
  async (provinceId) => {
    const response = await axios.get(`/province/d/${provinceId}`);
    return response.data;
  }
);

export const getWards = createAsyncThunk(
  "appPatient/wards/list",
  async ({ provinceId, districtId }) => {
    const response = await axios.get(`/province/w/${provinceId}/${districtId}`);
    return response.data;
  }
);

export const getMedicalList = createAsyncThunk(
  "appPatient/medical/list",
  async (patient_id) => {
    const response = await axios.get(`/medical/list?patient_id=${patient_id}`);
    return response.data;
  }
);

export const deleteMedical = createAsyncThunk(
  "appMedical/medical/delete",
  async ({ patientId, medicalId }, { dispatch }) => {
    const response = await axios.delete(`/medical/delete/${medicalId}`);
    dispatch(getMedicalList(patientId));
    return response.data;
  }
);

export const createPayment = createAsyncThunk(
  "appPatient/payment/create",
  async (payment, { dispatch }) => {
    const response = await axios
      .post("medical/payment", payment)
      .then((result) => {
        return result.data;
      })
      .catch((error) => {
        return error.response.data;
      });
    return response;
  }
);

export const getMedical = createAsyncThunk(
  "appPatient/medical/single",
  async (medical_id) => {
    const response = await axios.get(`/medical/single/${medical_id}`);
    return response.data;
  }
);

export const getRootList = createAsyncThunk(
  "appPatient/root/list",
  async () => {
    const response = await axios.get(`/root/list`);
    return response.data;
  }
);

export const appPatientSlice = createSlice({
  name: "appPatient",
  initialState: {
    listPatient: {
      data: [],
      loading: false,
      error: false,
    },
    province: {
      data: [],
      loading: false,
      error: false,
    },
    district: {
      data: [],
      loading: false,
      error: false,
    },
    wards: {
      data: [],
      loading: false,
      error: false,
    },
    medical: {
      data: {},
      loading: false,
      error: false,
    },
    medicalSingle: {
      data: {},
      loading: false,
      error: false,
    },
    createPatient: {
      data: null,
      loading: false,
      error: false,
    },
    updatePatient: {
      data: null,
      loading: false,
      error: false,
    },
    deletePatient: {
      data: [],
      loading: false,
      error: false,
    },
    payment: {
      data: {},
      loading: false,
      error: false,
    },
    getPatient: {
      data: {},
      loading: false,
      error: false,
    },
    rootList: {
      data: {},
      loading: false,
      error: false,
    },
    deleteMedical: {
      data: {},
      loading: false,
      error: false,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ** Get patient list
      .addCase(getPatientList.pending, (state) => {
        state.listPatient.loading = true;
      })
      .addCase(getPatientList.fulfilled, (state, action) => {
        state.listPatient.loading = false;
        state.listPatient.data = action.payload;
        state.listPatient.error = false;
      })
      .addCase(getPatientList.rejected, (state, action) => {
        state.listPatient.loading = false;
        state.listPatient.data = action.payload;
        state.listPatient.error = true;
      })
      // ** Get province
      .addCase(getProvince.pending, (state) => {
        state.province.loading = true;
      })
      .addCase(getProvince.fulfilled, (state, action) => {
        state.province.loading = false;
        state.province.data = action.payload;
        state.province.error = false;
      })
      .addCase(getProvince.rejected, (state, action) => {
        state.province.loading = false;
        state.province.data = action.payload;
        state.province.error = true;
      })
      // ** Get district
      .addCase(getDistrict.pending, (state) => {
        state.district.loading = true;
      })
      .addCase(getDistrict.fulfilled, (state, action) => {
        state.district.loading = false;
        state.district.data = action.payload;
        state.district.error = false;
      })
      .addCase(getDistrict.rejected, (state, action) => {
        state.district.loading = false;
        state.district.data = action.payload;
        state.district.error = true;
      })
      // ** Get wards
      .addCase(getWards.pending, (state) => {
        state.wards.loading = true;
      })
      .addCase(getWards.fulfilled, (state, action) => {
        state.wards.loading = false;
        state.wards.data = action.payload;
        state.wards.error = false;
      })
      .addCase(getWards.rejected, (state, action) => {
        state.wards.loading = false;
        state.wards.data = action.payload;
        state.wards.error = true;
      })
      // ** Get medical list
      .addCase(getMedicalList.pending, (state) => {
        state.medical.loading = true;
      })
      .addCase(getMedicalList.fulfilled, (state, action) => {
        state.medical.loading = false;
        state.medical.data = action.payload;
        state.medical.error = false;
      })
      .addCase(getMedicalList.rejected, (state) => {
        state.medical.loading = false;
        state.medical.error = true;
      })
      // ** Get medical single
      .addCase(getMedical.pending, (state) => {
        state.medicalSingle.loading = true;
      })
      .addCase(getMedical.fulfilled, (state, action) => {
        state.medicalSingle.loading = false;
        state.medicalSingle.data = action.payload;
        state.medicalSingle.error = false;
      })
      .addCase(getMedical.rejected, (state) => {
        state.medicalSingle.loading = false;
        state.medicalSingle.error = true;
      })
      // ** Create Patient
      .addCase(createPatient.pending, (state) => {
        state.createPatient.loading = true;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.createPatient.loading = false;
        state.createPatient.data = action.payload;
        state.createPatient.error = false;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.createPatient.loading = false;
        state.createPatient.data = action.payload;
        state.createPatient.error = true;
      })
      // ** Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.updatePatient.loading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.updatePatient.loading = false;
        state.updatePatient.data = action.payload;
        state.updatePatient.error = false;
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.updatePatient.loading = false;
        state.updatePatient.data = action.payload;
        state.updatePatient.error = true;
      })
      // Delete Patient
      .addCase(deletePatient.pending, (state) => {
        state.deletePatient.loading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.deletePatient.loading = false;
        state.deletePatient.data = action.payload;
        state.deletePatient.error = false;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.deletePatient.loading = false;
        state.deletePatient.data = action.payload;
        state.deletePatient.error = true;
      })
      // ** payment
      .addCase(createPayment.pending, (state) => {
        state.payment.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.payment.loading = false;
        state.payment.data = action.payload;
        state.payment.error = false;
      })
      .addCase(createPayment.rejected, (state) => {
        state.payment.loading = false;
        state.payment.error = true;
      })
      // ** Get patient
      .addCase(getPatient.pending, (state) => {
        state.getPatient.loading = true;
      })
      .addCase(getPatient.fulfilled, (state, action) => {
        state.getPatient.loading = false;
        state.getPatient.data = action.payload;
        state.getPatient.error = false;
      })
      .addCase(getPatient.rejected, (state, action) => {
        state.getPatient.loading = false;
        state.getPatient.data = action.payload;
        state.getPatient.error = true;
      })
      // ** Get root list
      .addCase(getRootList.pending, (state) => {
        state.rootList.loading = true;
      })
      .addCase(getRootList.fulfilled, (state, action) => {
        state.rootList.loading = false;
        state.rootList.data = action.payload;
        state.rootList.error = false;
      })
      .addCase(getRootList.rejected, (state, action) => {
        state.rootList.loading = false;
        state.rootList.data = action.payload;
        state.rootList.error = true;
      })
      // ** Delete medical
      .addCase(deleteMedical.pending, (state) => {
        state.rootList.loading = true;
      })
      .addCase(deleteMedical.fulfilled, (state, action) => {
        state.deleteMedical.loading = false;
        state.deleteMedical.data = action.payload;
        state.deleteMedical.error = false;
      })
      .addCase(deleteMedical.rejected, (state, action) => {
        state.deleteMedical.loading = false;
        state.deleteMedical.data = action.payload;
        state.deleteMedical.error = true;
      });
  },
});

export default appPatientSlice.reducer;
