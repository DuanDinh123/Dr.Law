// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getBankByUserId = createAsyncThunk('appBank/bank/user', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.get(`bank/user/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateBank = createAsyncThunk('appBank/bank/update', async ({ id, bank }, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { accountBankName, bankNumber, bankName } = bank
        const response = await axios.put(`bank/update/${id}`, {
            name: accountBankName,
            account_number: bankNumber,
            bank_name: bankName
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})
export const createBank = createAsyncThunk('appSalary/bank/create', async (bank, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { userId, accountBankName, bankNumber, bankName } = bank
        const response = await axios.post(`bank/create`, {
            user: userId,
            name: accountBankName,
            account_number: bankNumber,
            bank_name: bankName
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteBankByUserId = createAsyncThunk('appBank/bank/user/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.delete(`bank/user/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const appBankSlice = createSlice({
    name: 'appBank',
    initialState: {
        bankByUserId: {
            data: null,
            loading: false,
            error: false
        },
        update: {
            data: null,
            loading: false,
            error: false
        },
        create: {
            data: null,
            loading: false,
            error: false
        },
        deleteBankByUserId: {
            data: null,
            loading: false,
            error: false
        }
    },
    reducers: {},
    extraReducers: builder => {
        builder
            // ** Get bank by user id
            .addCase(getBankByUserId.pending, (state) => {
                state.bankByUserId.loading = true
            })
            .addCase(getBankByUserId.fulfilled, (state, action) => {
                state.bankByUserId.loading = false
                state.bankByUserId.data = action.payload
                state.bankByUserId.error = false
            })
            .addCase(getBankByUserId.rejected, (state, action) => {
                state.bankByUserId.loading = false
                state.bankByUserId.data = action.payload
                state.bankByUserId.error = true
            })
            // ** Update bank
            .addCase(updateBank.pending, (state) => {
                state.update.loading = true
            })
            .addCase(updateBank.fulfilled, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = false
            })
            .addCase(updateBank.rejected, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = true
            })
            // ** Create bank
            .addCase(createBank.pending, (state) => {
                state.create.loading = true
            })
            .addCase(createBank.fulfilled, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = false
            })
            .addCase(createBank.rejected, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = true
            })
            // ** Delete bank by user id
            .addCase(deleteBankByUserId.pending, (state) => {
                state.deleteBankByUserId.loading = true
            })
            .addCase(deleteBankByUserId.fulfilled, (state, action) => {
                state.deleteBankByUserId.loading = false
                state.deleteBankByUserId.data = action.payload
                state.deleteBankByUserId.error = false
            })
            .addCase(deleteBankByUserId.rejected, (state, action) => {
                state.deleteBankByUserId.loading = false
                state.deleteBankByUserId.data = action.payload
                state.deleteBankByUserId.error = true
            })
    }
})

export default appBankSlice.reducer
