// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getSupplieList = createAsyncThunk('appSupplie/supplie/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search, active } = paginate
    const response = await axios.get(`supplie/list`, {
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

export const getSupplieListByGroupSupplie = createAsyncThunk('appSupplie/supplie/list-by-group', async (paginate) => {
  const { groupSupplie } = paginate
  const response = await axios.get(`supplie/group`, {
    params: {
      groupSupplie,
    }
  })
  return response.data
})

export const getSupplie = createAsyncThunk('appSupplie/supplie/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`supplie/single/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const createSupplie = createAsyncThunk('appSupplie/supplie/create', async (supplie, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, sku, price_attrition, price, unit, quantity, active, group_supplie, assets, featured_asset } = supplie;
    const response = await axios.post('supplie/create', {
      name,
      sku,
      price_attrition,
      price,
      unit,
      quantity,
      active,
      group_supplie,
      assets,
      featured_asset
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateSupplie = createAsyncThunk('appSupplie/supplie/update', async ({ id, supplie }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.put(`supplie/update/${id}`, supplie)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteSupplie = createAsyncThunk('appSupplie/supplie/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`supplie/delete/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const appSupplieSlice = createSlice({
  name: 'appSupplie',
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
    update: {
      data: null,
      loading: false,
      error: false
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
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSupplieList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getSupplieList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getSupplieList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      .addCase(getSupplieListByGroupSupplie.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getSupplieListByGroupSupplie.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getSupplieListByGroupSupplie.rejected, (state, action) => {
        state.list.loading = false
        state.list.loading = action.payload
        state.list.error = true
      })
      // ** Get Supplie by id
      .addCase(getSupplie.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getSupplie.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getSupplie.rejected, (state, action) => {
        state.single.loading = false
        state.list.single = action.payload
        state.single.error = true
      })
      // ** Create Supplie
      .addCase(createSupplie.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createSupplie.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createSupplie.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete Supplie
      .addCase(deleteSupplie.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteSupplie.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteSupplie.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Update Supplie
      .addCase(updateSupplie.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateSupplie.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateSupplie.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appSupplieSlice.reducer
