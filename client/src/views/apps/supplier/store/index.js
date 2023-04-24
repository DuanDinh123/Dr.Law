// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getSupplierList = createAsyncThunk('appSupplier/supplier/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`supplier/list`, {
      params: {
        page,
        limit,
        fieldSort,
        sortValue,
        search
      },
    })
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getSupplier = createAsyncThunk('appSupplier/supplier/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`supplier/single/${id}`)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const createSupplier = createAsyncThunk('appSupplier/supplier/create', async (supplier, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.post('supplier/create', supplier)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const updateSupplier = createAsyncThunk('appSupplier/supplier/update', async ({ id, supplier }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.put(`supplier/update/${id}`, supplier)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const deleteSupplier = createAsyncThunk('appSupplier/supplier/delete', async (id, { dispatch, rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`supplier/delete/${id}`)
    return fulfillWithValue(response.data)
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const appSupplierSlice = createSlice({
  name: 'appSupplier',
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
      .addCase(getSupplierList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getSupplierList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getSupplierList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get Supplier by id
      .addCase(getSupplier.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getSupplier.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getSupplier.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create Supplier
      .addCase(createSupplier.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete Supplier
      .addCase(deleteSupplier.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      .addCase(updateSupplier.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appSupplierSlice.reducer
