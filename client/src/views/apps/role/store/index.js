// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

export const createRole = createAsyncThunk('appRole/role/create', async (role, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { name, description, permissions } = role
    const response = await axios.post('role/create', {
      name,
      permissions,
      description
    })
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getRoleList = createAsyncThunk('appRole/role/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit } = paginate
    const response = await axios.get(`role/list?page=${page}&limit=${limit}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }

})

export const getRole = createAsyncThunk('appRole/role/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`/role/single/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateRole = createAsyncThunk('appRole/role/update', async ({ role_id, role }, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.put(`/role/update/${role_id}`, role)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteRole = createAsyncThunk('appRole/role/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`role/delete/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getRolesByUserId = createAsyncThunk('appRole/role/user', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`role/user/${id}`)
    return fulfillWithValue(response.data);
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const appRoleSlice = createSlice({
  name: 'appRole',
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
    single: {
      loading: false,
      error: false,
      data: null
    },
    delete: {
      data: null,
      loading: false,
      error: false
    },
    rolesByUserId: {
      data: null,
      loading: false,
      error: false
    },
    update: {
      loading: false,
      error: false,
      data: null
    }
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // ** Get role list
      .addCase(getRoleList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getRoleList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Create role
      .addCase(createRole.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createRole.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Get role
      .addCase(getRole.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getRole.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getRole.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Delete role
      .addCase(deleteRole.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Roles by user id
      .addCase(getRolesByUserId.pending, (state) => {
        state.rolesByUserId.loading = true
      })
      .addCase(getRolesByUserId.fulfilled, (state, action) => {
        state.rolesByUserId.loading = false
        state.rolesByUserId.data = action.payload
        state.rolesByUserId.error = false
      })
      .addCase(getRolesByUserId.rejected, (state, action) => {
        state.rolesByUserId.loading = false
        state.rolesByUserId.data = action.payload
        state.rolesByUserId.error = true
      })
      // ** Update role
      .addCase(updateRole.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appRoleSlice.reducer
