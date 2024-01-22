import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isRejected,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";

import { IAuth, IReg, IUser } from "../../interfaces";
import { authService } from "../../services/authService";

interface AuthState {
  deleteTriger: boolean;
 errors: {
   response?: { data: { password: string; username: string;  detail:string}};
  };
  me: IUser | null;
}

const initialState: AuthState = {
  deleteTriger: true,
  errors: null,
  me: null,
};

const register = createAsyncThunk<void, { user: IReg }>(
  "carsSlice/register",
  async ({ user }, { rejectWithValue, dispatch }) => {
    try {
      await authService.register(user);
      // other code
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err);
    }
  },
);

const login = createAsyncThunk<IUser, { user: IAuth }>(
  "authSlice/login",
  async ({ user }, { rejectWithValue, dispatch }) => {
    try {
      const us2 = await authService.login(user);
      return us2;
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err);
    }
  },
);

const me = createAsyncThunk<IUser>(
  "authSlice/me",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await authService.me();
      return data;
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err);
    }
  },
);

export const AuthSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setDeleteTriger: (state) => {
      state.deleteTriger = !state.deleteTriger;
    },
    deleteMe: (state) => {
      state.me = null;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.me = action.payload;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.me = action.payload;
      })
      .addMatcher(isRejected, (state, action) => {
        state.errors = action.payload;
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.errors = null;
      }),
});

const { reducer: authReducer, actions } = AuthSlice;

const authActions = {
  ...actions,
  register,
  login,
  me,
};

export { authActions, authReducer };
