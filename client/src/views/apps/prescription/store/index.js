// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getPrescriptionList = createAsyncThunk('appPrescription/prescription/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`prescription/list`, {
      params: {
        page,
        limit,
        fieldSort,
        sortValue,
        search
      }
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const createPrescription = createAsyncThunk('appPrescription/prescription/create', async (prescription, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, prescription_content, active, note, advice } = prescription
    const response = await axios.post('prescription/create', {
      name,
      prescription_content,
      active,
      note,
      advice
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getPrescription = createAsyncThunk('appPrescription/prescription/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`prescription/single/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updatePrescription = createAsyncThunk('appPrescription/prescription/update', async ({ id, prescription }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, prescription_content, active, note, advice } = prescription
    const response = await axios.put(`prescription/update/${id}`, {
      name,
      prescription_content,
      active,
      note,
      advice
    })
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deletePrescription = createAsyncThunk('appRole/prescription/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`prescription/delete/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const appPrescriptionSlice = createSlice({
  name: 'appPrescription',
  initialState: {
    list: {
      loading: false,
      error: false,
      data: null
    },
    create: {
      loading: false,
      error: false,
      data: null
    },
    delete: {
      data: null,
      loading: false,
      error: false
    },
    single: {
      data: null,
      loading: false,
      error: false
    },
    update: {
      data: null,
      loading: false,
      error: false
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // ** Get prescription list
      .addCase(getPrescriptionList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getPrescriptionList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getPrescriptionList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get prescription by id
      .addCase(getPrescription.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getPrescription.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getPrescription.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create prescription
      .addCase(createPrescription.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete prescription
      .addCase(deletePrescription.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deletePrescription.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deletePrescription.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Update prescription
      .addCase(updatePrescription.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updatePrescription.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appPrescriptionSlice.reducer
