// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getTipList = createAsyncThunk('appTip/tip/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`tip/list`, {
      params: {
        page,
        limit,
        fieldSort,
        sortValue,
        search
      }
    })
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getTip = createAsyncThunk('appTip/tip/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`tip/single/${id}`)
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const createTip = createAsyncThunk('appTip/tip/create', async (tip, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.post('tip/create', tip)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const updateTip = createAsyncThunk('appTip/tip/update', async ({ id, tip }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.put(`tip/update/${id}`, tip)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const deleteTip = createAsyncThunk('appTip/tip/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`tip/delete/${id}`)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const appTipSlice = createSlice({
  name: 'appTip',
  initialState: {
    list: {
      loading: false,
      error: false,
      data: []
    },
    create: {
      loading: false,
      error: false,
      data: []
    },
    delete: {
      data: [],
      loading: false,
      error: false
    },
    single: {
      data: {},
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
      .addCase(getTipList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getTipList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getTipList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get tip by id
      .addCase(getTip.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getTip.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getTip.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create tip
      .addCase(createTip.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createTip.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createTip.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete tip
      .addCase(deleteTip.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteTip.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteTip.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      .addCase(updateTip.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateTip.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateTip.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appTipSlice.reducer
