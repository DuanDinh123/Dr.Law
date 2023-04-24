// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
export const getAdviceList = createAsyncThunk('appAdvice/advice/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`advice/list`, {
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

export const getAdvice = createAsyncThunk('appAdvice/advice/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`advice/single/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const createAdvice = createAsyncThunk('appAdvice/advice/create', async (advice, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, sample_content, active, note } = advice
    const response = await axios.post('advice/create', {
      name,
      sample_content,
      active,
      note
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateAdvice = createAsyncThunk('appAdvice/advice/update', async ({ id, advice }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, sample_content, active, note } = advice
    const response = await axios.put(`advice/update/${id}`, {
      name,
      sample_content,
      active,
      note
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteAdvice = createAsyncThunk('appAdvice/advice/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`advice/delete/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const appAdviceSlice = createSlice({
  name: 'appAdvice',
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
      // ** Get list advice
      .addCase(getAdviceList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getAdviceList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getAdviceList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get advice by id
      .addCase(getAdvice.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getAdvice.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getAdvice.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create Advice
      .addCase(createAdvice.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createAdvice.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createAdvice.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete advice
      .addCase(deleteAdvice.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteAdvice.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteAdvice.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Update advice
      .addCase(updateAdvice.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateAdvice.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateAdvice.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appAdviceSlice.reducer
