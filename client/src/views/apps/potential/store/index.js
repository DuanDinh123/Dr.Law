// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getPotentialList = createAsyncThunk('appPotential/patient/potential', async (potential, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { limit, value } = potential
        const response = await axios.get(`patient/potential?limit=${limit}&value=${value}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const appPotentialSlice = createSlice({
    name: 'appPotential',
    initialState: {
        list: {
            loading: false,
            error: false,
            data: null
        }
    },
    reducers: {},
    extraReducers: builder => {
        builder
            // ** Get potential list
            .addCase(getPotentialList.pending, (state) => {
                state.list.loading = true
            })
            .addCase(getPotentialList.fulfilled, (state, action) => {
                state.list.loading = false
                state.list.data = action.payload
                state.list.error = false
            })
            .addCase(getPotentialList.rejected, (state, action) => {
                state.list.loading = false
                state.list.data = action.payload
                state.list.error = true
            })
    }
})

export default appPotentialSlice.reducer
