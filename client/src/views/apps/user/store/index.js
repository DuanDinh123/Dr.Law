// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Actions
import { updateSalary, createSalary } from '../../salary/store'
import { updateBank, createBank } from '../../bank/store'

export const getUserList = createAsyncThunk('appUser/user/list', async (paginate, { rejectWithValue, fulfillWithValue }) => {
  try {
    const { page, limit, fieldSort, sortValue, search } = paginate
    const response = await axios.get(`user/list`, {
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

export const createUser = createAsyncThunk('appUser/auth/register', async (user, { dispatch, rejectWithValue, fulfillWithValue }) => {
  try {
    const {
      name,
      password,
      email,
      phone,
      address,
      note,
      active,
      date_of_birth,
      cardID,
      roleIds,
      wage,
      bonusRevenue,
      workDay,
      bonusSale,
      allowance,
      accountBankName,
      bankNumber,
      bankName
    } = user

    const response = await axios.post(`auth/register`, {
      name,
      password,
      email,
      phone,
      address,
      note,
      active,
      date_of_birth,
      cardID
    })
    await Promise.all([
      await axios.post(`user/assign-roles-to-user/${response.data?._id}`, {
        roleIds
      }),
      await dispatch(createSalary({
        userId: response.data?._id,
        wage,
        workDay,
        bonusRevenue,
        bonusSale,
        allowance
      })),
      await dispatch(createBank({
        userId: response.data?._id,
        accountBankName,
        bankNumber,
        bankName
      }))
    ])
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const deleteUser = createAsyncThunk('appRole/user/delete', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.delete(`user/delete/${id}`)
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const getUser = createAsyncThunk('appRole/user/single', async (id, { rejectWithValue, fulfillWithValue }) => {
  try {
    const response = await axios.get(`user/single/${id}`)
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const updateUser = createAsyncThunk('appRole/user/update', async ({ ids, user }, { dispatch, rejectWithValue, fulfillWithValue }) => {
  try {
    const { userId, bankId, salaryId } = ids
    const {
      name,
      email,
      phone,
      address,
      note,
      active,
      date_of_birth,
      cardID,
      roleIds,
      wage,
      bonusRevenue,
      workDay,
      bonusSale,
      allowance,
      accountBankName,
      bankNumber,
      bankName
    } = user

    // eslint-disable-next-line no-unused-vars
    const [response, ...res] = await Promise.all([
      await axios.put(`user/update/${userId}`, {
        name,
        address,
        email,
        cardID,
        phone,
        date_of_birth,
        note,
        active
      }),
      await dispatch(updateSalary({
        id: salaryId,
        salary: {
          wage,
          workDay,
          bonusRevenue,
          bonusSale,
          allowance
        }
      })),
      await dispatch(updateBank({
        id: bankId,
        bank: {
          accountBankName,
          bankNumber,
          bankName
        }
      })),
      await axios.post(`user/assign-roles-to-user/${userId}`, {
        roleIds
      })
    ])
    return fulfillWithValue(response.data)
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})

export const appUserSlice = createSlice({
  name: 'appUser',
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
      loading: false,
      error: false,
      data: null
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
      // ** Get user list
      .addCase(getUserList.pending, (state) => {
        state.list.loading = true
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = false
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.list.loading = false
        state.list.data = action.payload
        state.list.error = true
      })
      // ** Get user
      .addCase(getUser.pending, (state) => {
        state.single.loading = true
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = false
      })
      .addCase(getUser.rejected, (state, action) => {
        state.single.loading = false
        state.single.data = action.payload
        state.single.error = true
      })
      // ** Create user
      .addCase(createUser.pending, (state) => {
        state.create.loading = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = false
      })
      .addCase(createUser.rejected, (state, action) => {
        state.create.loading = false
        state.create.data = action.payload
        state.create.error = true
      })
      // ** Delete user
      .addCase(deleteUser.pending, (state) => {
        state.delete.loading = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = false
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.delete.loading = false
        state.delete.data = action.payload
        state.delete.error = true
      })
      // ** Update user
      .addCase(updateUser.pending, (state) => {
        state.update.loading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.update.loading = false
        state.update.data = action.payload
        state.update.error = true
      })
  }
})

export default appUserSlice.reducer
