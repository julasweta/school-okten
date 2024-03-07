import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { IPageInterface, IUser } from "../../interfaces";
import { userService } from "../../services/UsersServices";

interface UserState {
  users: IUser[];
  userById: IUser;
  createdUser: IUser;
  updateUserTriger: boolean;
  usersFound: number;
  activePageUsers: number;
}

const initialState: UserState = {
  users: [],
  userById: null,
  usersFound: 0,
  activePageUsers: 1,
  createdUser: {
    _id: "",
    email: "",
    role: "",
    name: "",
    status: "",
    token: "",
  },

  updateUserTriger: true,
};

const getAllUsers = createAsyncThunk<
  IPageInterface<IUser>,
  { limit?: number; page?: number; email?: string },
  { rejectValue: AxiosError }
>(
  "usersSlice/getAllUsers",
  async ({ limit, page, email }, { rejectWithValue }) => {
    try {
      const { data } = await userService.getAllUsers({ limit, page, email });

      return data;
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
      console.log("slice", data);
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
    setUpdateUserTriger: (state) => {
      state.updateUserTriger = !state.updateUserTriger;
    },
    setActivePageUsers: (state, action) => {
      state.activePageUsers = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userById = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createdUser = action.payload;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.users = action.payload.data;
        state.usersFound = action.payload.itemsFound;
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
