// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const getRoot = createAsyncThunk('appRoot/root/single', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.get(`root/single/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const getRootList = createAsyncThunk('appRoot/root/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { page, limit, fieldSort, sortValue, search } = paginate
        const response = await axios.get(`root/list`, {
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

export const deleteRoot = createAsyncThunk('appRoot/root/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
        const response = await axios.delete(`root/delete/${id}`)
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const createRoot = createAsyncThunk('appRoot/root/create', async (root, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { name, active, description } = root;
        const response = await axios.post('root/create', {
            name,
            active,
            description
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const updateRoot = createAsyncThunk('appRoot/root/update', async ({ id, root }, { rejectWithValue, fulfillWithValue }) => {
    try {
        const { name, active, description } = root
        const response = await axios.put(`root/update/${id}`, {
            name,
            active,
            description
        })
        return fulfillWithValue(response.data);
    } catch (error) {
        return rejectWithValue(error.response.data)
    }
})

export const appRootSlice = createSlice({
    name: 'appRoot',
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
            .addCase(getRootList.pending, (state) => {
                state.list.loading = true
            })
            .addCase(getRootList.fulfilled, (state, action) => {
                state.list.loading = false
                state.list.data = action.payload
                state.list.error = false
            })
            .addCase(getRootList.rejected, (state, action) => {
                state.list.loading = false
                state.list.data = action.payload
                state.list.error = true
            })
            // ** Get medical history
            .addCase(getRoot.pending, (state) => {
                state.single.loading = true
            })
            .addCase(getRoot.fulfilled, (state, action) => {
                state.single.loading = false
                state.single.data = action.payload
                state.single.error = false
            })
            .addCase(getRoot.rejected, (state, action) => {
                state.single.loading = false
                state.list.single = action.payload
                state.single.error = true
            })
            // ** Delete medical history
            .addCase(deleteRoot.pending, (state) => {
                state.delete.loading = true
            })
            .addCase(deleteRoot.fulfilled, (state, action) => {
                state.delete.loading = false
                state.delete.data = action.payload
                state.delete.error = false
            })
            .addCase(deleteRoot.rejected, (state, action) => {
                state.delete.loading = false
                state.delete.data = action.payload
                state.delete.error = true
            })
            // ** Create medical history
            .addCase(createRoot.pending, (state) => {
                state.create.loading = true
            })
            .addCase(createRoot.fulfilled, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = false
            })
            .addCase(createRoot.rejected, (state, action) => {
                state.create.loading = false
                state.create.data = action.payload
                state.create.error = true
            })
            // ** Update medical history
            .addCase(updateRoot.pending, (state) => {
                state.update.loading = true
            })
            .addCase(updateRoot.fulfilled, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = false
            })
            .addCase(updateRoot.rejected, (state, action) => {
                state.update.loading = false
                state.update.data = action.payload
                state.update.error = true
            })
    }
})

export default appRootSlice.reducer
