// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
export const getGroupSupplieList = createAsyncThunk('appGroupSupplie/group-supplie/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search, active } = paginate
    const response = await axios.get(`group-supplie/list`, {
      params: {
        page,
        limit,
        fieldSort,
        sortValue,
        search,
        active
      }
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getGroupSupplie = createAsyncThunk('appGroupSupplie/group-supplie/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`group-supplie/single/${id}`)
    return fulfillWithValue(response.data);
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const createGroupSupplie = createAsyncThunk('appGroupSupplie/group-supplie/create', async (groupSupplie, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.post('group-supplie/create', groupSupplie)
    return fulfillWithValue(response.data);
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const updateGroupSupplie = createAsyncThunk('appGroupSupplie/group-supplie/update', async ({ id, groupSupplie }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.put(`group-supplie/update/${id}`, groupSupplie)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const deleteGroupSupplie = createAsyncThunk('appGroupSupplie/group-supplie/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`group-supplie/delete/${id}`)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const appGroupSupplieSlice = createSlice({
  name: 'appGroupSupplie',
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
      .addCase(getGroupSupplieList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getGroupSupplieList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getGroupSupplieList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get GroupSupplie by id
      .addCase(getGroupSupplie.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getGroupSupplie.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getGroupSupplie.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create GroupSupplie
      .addCase(createGroupSupplie.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createGroupSupplie.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createGroupSupplie.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete GroupSupplie
      .addCase(deleteGroupSupplie.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteGroupSupplie.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteGroupSupplie.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Update Supplie
      .addCase(updateGroupSupplie.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateGroupSupplie.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateGroupSupplie.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appGroupSupplieSlice.reducer
