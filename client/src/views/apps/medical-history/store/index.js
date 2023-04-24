// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getMedicalHistory = createAsyncThunk('appMedicalHistory/medical-history/single', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.get(`medical-history/single/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const getMedicalHistoryList = createAsyncThunk('appMedicalHistory/medical-history/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { page, limit, fieldSort, sortValue, search } = paginate
        const response = await axios.get(`medical-history/list`, {
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

export const deleteMedicalHistory = createAsyncThunk('appMedicalHistory/medical-history/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.delete(`medical-history/delete/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const createMedicalHistory = createAsyncThunk('appMedicalHistory/medical-history/create', async (medicalHistory, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { name, active, description } = medicalHistory;
        const response = await axios.post('medical-history/create', {
            name,
            active,
            description
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateMedicalHistory = createAsyncThunk('appMedicalHistory/medical-history/update', async ({ id, medicalHistory }, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { name, active, description } = medicalHistory
        const response = await axios.put(`medical-history/update/${id}`, {
            name,
            active,
            description
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})



export const appMedicalHistorySlice = createSlice({
    name: 'appMedicalHistory',
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
            // ** Get medical history list
            .addCase(getMedicalHistoryList.pending, (state) => {
                state.list.loading = true
            })
            .addCase(getMedicalHistoryList.fulfilled, (state, action) => {
                state.list.loading = false
                state.list.data = action.payload
                state.list.error = false
            })
            .addCase(getMedicalHistoryList.rejected, (state, action) => {
                state.list.loading = false
                state.list.data = action.payload
                state.list.error = true
            })
            // ** Get medical history
            .addCase(getMedicalHistory.pending, (state) => {
                state.single.loading = true
            })
            .addCase(getMedicalHistory.fulfilled, (state, action) => {
                state.single.loading = false
                state.single.data = action.payload
                state.single.error = false
            })
            .addCase(getMedicalHistory.rejected, (state, action) => {
                state.single.loading = false
                state.list.single = action.payload
                state.single.error = true
            })
            // ** Delete medical history
            .addCase(deleteMedicalHistory.pending, (state) => {
                state.delete.loading = true
            })
            .addCase(deleteMedicalHistory.fulfilled, (state, action) => {
                state.delete.loading = false
                state.delete.data = action.payload
                state.delete.error = false
            })
            .addCase(deleteMedicalHistory.rejected, (state, action) => {
                state.delete.loading = false
                state.delete.data = action.payload
                state.delete.error = true
            })
            // ** Create medical history
            .addCase(createMedicalHistory.pending, (state) => {
                state.create.loading = true
            })
            .addCase(createMedicalHistory.fulfilled, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = false
            })
            .addCase(createMedicalHistory.rejected, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = true
            })
            // ** Update medical history
            .addCase(updateMedicalHistory.pending, (state) => {
                state.update.loading = true
            })
            .addCase(updateMedicalHistory.fulfilled, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = false
            })
            .addCase(updateMedicalHistory.rejected, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = true
            })
    }
})

export default appMedicalHistorySlice.reducer
