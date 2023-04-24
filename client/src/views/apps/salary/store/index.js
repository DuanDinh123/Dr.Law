// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getSalaryByUserId = createAsyncThunk('appSalary/salary/user', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.get(`salary/user/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateSalary = createAsyncThunk('appSalary/salary/update', async ({ id, salary }, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { wage, workDay, bonusRevenue, bonusSale, allowance } = salary
        const response = await axios.put(`salary/update/${id}`, {
            wage,
            work_day: workDay,
            bonus_sale: bonusSale,
            bonus_revenue: bonusRevenue,
            allowance
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const createSalary = createAsyncThunk('appSalary/salary/create', async (salary) => {
    try {
        const { userId, wage, workDay, bonusRevenue, bonusSale, allowance } = salary
        const response = await axios.post(`salary/create`, {
            user: userId,
            wage: +wage,
            work_day: +workDay,
            bonus_revenue: +bonusRevenue,
            bonus_sale: +bonusSale,
            allowance: +allowance
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteSalaryByUserId = createAsyncThunk('appSalary/salary/user/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.delete(`salary/user/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const appSalarySlice = createSlice({
    name: 'appSalary',
    initialState: {
        salaryByUserId: {
            loading: false,
            error: false,
            data: null
        },
        update: {
            loading: false,
            error: false,
            data: null
        },
        create: {
            loading: false,
            error: false,
            data: null
        },
        deleteSalaryByUserId: {
            loading: false,
            error: false,
            data: null
        },
    },
    reducers: {},
    extraReducers: builder => {
        builder
            // ** Get salary by userId
            .addCase(getSalaryByUserId.pending, (state) => {
                state.salaryByUserId.loading = true
            })
            .addCase(getSalaryByUserId.fulfilled, (state, action) => {
                state.salaryByUserId.loading = false
                state.salaryByUserId.data = action.payload
                state.salaryByUserId.error = false
            })
            .addCase(getSalaryByUserId.rejected, (state, action) => {
                state.salaryByUserId.loading = false
                state.salaryByUserId.data = action.payload
                state.salaryByUserId.error = true
            })
            // ** Update salary
            .addCase(updateSalary.pending, (state) => {
                state.update.loading = true
            })
            .addCase(updateSalary.fulfilled, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = false
            })
            .addCase(updateSalary.rejected, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = true
            })
            // ** Create salary
            .addCase(createSalary.pending, (state) => {
                state.create.loading = true
            })
            .addCase(createSalary.fulfilled, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = false
            })
            .addCase(createSalary.rejected, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = true
            })
            // ** Delete salary by userId
            .addCase(deleteSalaryByUserId.pending, (state) => {
                state.deleteSalaryByUserId.loading = true
            })
            .addCase(deleteSalaryByUserId.fulfilled, (state, action) => {
                state.deleteSalaryByUserId.loading = false
                state.deleteSalaryByUserId.data = action.payload
                state.deleteSalaryByUserId.error = false
            })
            .addCase(deleteSalaryByUserId.rejected, (state, action) => {
                state.deleteSalaryByUserId.loading = false
                state.deleteSalaryByUserId.data = action.payload
                state.deleteSalaryByUserId.error = true
            })
    }
})

export default appSalarySlice.reducer
