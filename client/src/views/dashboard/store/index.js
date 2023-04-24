// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getRevenueStatistic = createAsyncThunk('appRevenueStatistic/salary/revenue-statistic', async (date, { rejectWithValue, fulfillWithValue }) => {
    const { startDate, endDate } = date
    try {
    const response = await axios.get('salary/revenue-statistic',{ params: { startDate: startDate, endDate: endDate } } )
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getReportEmployee = createAsyncThunk('appReportEmployee/report/employee-turnover/list', async (input) => {
  const { startDate, endDate } = input
  const response = await axios.get(`salary/revenue`, {
      params: {
          startDate: startDate,
          endDate: endDate
      }
  })
  return response.data
})

export const appDashboardSlice = createSlice({
  name: 'appDashboard',
  initialState: {
    single: {
      loading: false,
      error: false,
      data: null
    },
    list: {
      loading: false,
      error: false,
      data: []
  }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // ** Get revenue statistic
      .addCase(getRevenueStatistic.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getRevenueStatistic.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getRevenueStatistic.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
        // ** Get report employee list
        .addCase(getReportEmployee.pending, (state) => {
          state.list.loading = true
      })
      .addCase(getReportEmployee.fulfilled, (state, action) => {
          state.list.loading = false
          state.list.data = action.payload
          state.list.error = false
      })
      .addCase(getReportEmployee.rejected, (state) => {
          state.list.loading = false
          state.list.error = true
      })
  }
})

export default appDashboardSlice.reducer
