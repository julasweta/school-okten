import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order } from "../../interfaces";
import { orderService } from "../../services/OrdersServices";
import { AxiosError } from "axios";
import { IPageData } from "../../interfaces/IPaginationOrder";

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

/*-----------------AsyncThunk -------------------------------  */
const getOrders = createAsyncThunk<
  IPageData<Order>,
  { limit: number; page: number },
  { rejectValue: AxiosError }
>("ordersSlice/getOrders", async ({ limit, page }, { rejectWithValue }) => {
  try {
    const { data } = await orderService.getOrders(limit, page);
    return data;
  } catch (e) {
    const err = e as AxiosError;
    return rejectWithValue(err);
  }
});

/*--------------------- SLICE--------------------  */

export const OrdersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setShowBurger: (state, action) => {
      state.orders = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload.data;
    }),
});

const { reducer: ordersReducer, actions } = OrdersSlice;

const ordersActions = {
  ...actions,
  getOrders,
};

export { ordersActions, ordersReducer };
