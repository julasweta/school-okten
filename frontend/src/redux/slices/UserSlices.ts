import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userService } from "../../services/UsersServices";
import { IUser } from "../../interfaces";
import { AxiosError } from "axios";

interface UserState {
  users: IUser[];
  userById: IUser;
}

const initialState: UserState = {
  users: [],
  userById: null,
};

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



/*--------------------- SLICE--------------------  */

export const UsersSlice = createSlice({
  name: "usersSlice",
  initialState,
  reducers: {
    setActivePage: (state, action) => {},
  },

  extraReducers: (builder) =>
    builder.addCase(getUserById.fulfilled, (state, action) => {
      state.userById = action.payload;
    }),
});

const { reducer: usersReducer, actions } = UsersSlice;

const usersActions = {
  ...actions,
  getUserById,
};

export { usersActions, usersReducer };
