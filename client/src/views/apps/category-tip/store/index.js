// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
export const getCategoryTipList = createAsyncThunk('appCategoryTip/category-tip/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`category-tip/list`, {
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

export const getCategoryTip = createAsyncThunk('appCategoryTip/category-tip/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`category-tip/single/${id}`)
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(err.response.data)
  }
})

export const createCategoryTip = createAsyncThunk('appCategoryTip/category-tip/create', async (categoryTip, { fulfillWithValue, rejectWithValue }) => {
  try {
    const response = await axios.post('category-tip/create', categoryTip)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const updateCategoryTip = createAsyncThunk('appCategoryTip/category-tip/update', async ({ id, categoryTip }, { fulfillWithValue, rejectWithValue }) => {
  try {
    const { name, note, active } = categoryTip
    const response = await axios.put(`category-tip/update/${id}`, {
      name,
      note,
      active
    })
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const deleteCategoryTip = createAsyncThunk('appCategoryTip/category-tip/delete', async (id, { fulfillWithValue, rejectWithValue }) => {
  try {
    const response = await axios.delete(`category-tip/delete/${id}`)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const appCategoryTipSlice = createSlice({
  name: 'appCategoryTip',
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
    update: {
      data: [],
      loading: false,
      error: false
    },
    single: {
      data: {},
      loading: false,
      error: false
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCategoryTipList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getCategoryTipList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getCategoryTipList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get CategoryTip by id
      .addCase(getCategoryTip.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getCategoryTip.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getCategoryTip.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create CategoryTip
      .addCase(createCategoryTip.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createCategoryTip.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createCategoryTip.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete CategoryTip
      .addCase(deleteCategoryTip.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteCategoryTip.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteCategoryTip.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      .addCase(updateCategoryTip.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateCategoryTip.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateCategoryTip.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appCategoryTipSlice.reducer
