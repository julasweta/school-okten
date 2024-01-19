import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../services/UsersServices";
import { IUser } from "../../interfaces";
import { AxiosError } from "axios";

interface UserState {
  users: IUser[];
  userById: IUser;
  createdUser: IUser;
}

const initialState: UserState = {
  users: [],
  userById: null,
  createdUser: {
    _id: "",
    email: "",
    role: "",
    name: "",
    status: "",
    token:
      "",
  },
};

const getAllUsers = createAsyncThunk<IUser[]>(
  "usersSlice/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response.data;
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err);
    }
  }
);




const getUserById = createAsyncThunk<
  IUser,
  string,
  { rejectValue: AxiosError }
>("usersSlice/getUserById", async (id, { rejectWithValue }) => {
  try {
    const response = await userService.getUserById(id);
    return response.data;
  } catch (e) {
    const err = e as AxiosError;
    return rejectWithValue(err);
  }
});

const createUser = createAsyncThunk<IUser, IUser, { rejectValue: AxiosError }>(
  "usersSlice/createUser",
  async (data, { rejectWithValue }) => {
    try {
      console.log('slice', data);
      const response = await userService.createUser(data);
      return response.data;
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err);
    }
  }
);



/*--------------------- SLICE--------------------  */

export const UsersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    setActivePage: (state, action) => {},
  },

  extraReducers: (builder) =>
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userById = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createdUser = action.payload;
      }).addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      }),
});

const { reducer: usersReducer, actions } = UsersSlice;

const usersActions = {
  ...actions,
  getUserById,
  createUser,
  getAllUsers,
};

export { usersActions, usersReducer };
