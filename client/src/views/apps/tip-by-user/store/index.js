// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getTipByUser = createAsyncThunk('appTip/tipByUser/list', async (tipByUser, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.get('medical/tip-by-user', tipByUser)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response.data)
  }
})

export const appTipByUserSlice = createSlice({
  name: 'appTip',
  initialState: {
    list: {
      loading: false,
      error: false,
      data: []
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getTipByUser.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getTipByUser.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getTipByUser.rejected, (state) => {
        state.list.loading = false
        state.list.error = true
      })
  }
})

export default appTipByUserSlice.reducer
