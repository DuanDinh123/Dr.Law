// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getStatusList = createAsyncThunk('appStatus/status/list', async (paginate, { fulfillWithValue, rejectWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`status/list`, {
      params: {
        page,
        limit,
        fieldSort,
        sortValue,
        search
      }
    })
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const createStatus = createAsyncThunk('appStatus/status/create', async (data, { fulfillWithValue, rejectWithValue }) => {
  try {
    const { name, description, active } = data
    const response = await axios.post('status/create', {
      name,
      description,
      active
    })
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const getStatus = createAsyncThunk('appSupplie/status/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`status/single/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateStatus = createAsyncThunk('appStatus/status/update', async ({ id, status }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, description, active } = status
    const response = await axios.put(`status/update/${id}`, {
      name,
      description,
      active
    })
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const deleteStatus = createAsyncThunk('appStatus/status/delete', async (id, { fulfillWithValue, rejectWithValue }) => {
  try {
    const response = await axios.delete(`status/delete/${id}`)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const appStatusSlice = createSlice({
  name: 'appStatus',
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
      // ** Get status list
      .addCase(getStatusList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getStatusList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getStatusList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Create Status
      .addCase(createStatus.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete Status
      .addCase(deleteStatus.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Update Status
      .addCase(updateStatus.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
      // ** Get single status
      .addCase(getStatus.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getStatus.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getStatus.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
  }
})

export default appStatusSlice.reducer
