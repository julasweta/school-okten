import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order } from "../../interfaces";
import { orderService } from "../../services/OrdersServices";
import { AxiosError } from "axios";
import { IPageInterface } from "../../interfaces/IPaginationOrder";

interface OrderState {
  orders: Order[];
  itemsFound: number;
  activePage: number;
}

const initialState: OrderState = {
  orders: [],
  itemsFound: 0,
  activePage: 1,
};

/*-----------------AsyncThunk -------------------------------  */
const getOrders = createAsyncThunk<
  IPageInterface<Order>,
  { sort: string; limit: number; page: number },
  { rejectValue: AxiosError }
>(
  "ordersSlice/getOrders",
  async ({ sort, limit, page }, { rejectWithValue }) => {
    try {
      if (page === 0) {
        page = 1;
        const { data } = await orderService.getOrders(sort, limit, page);
        return data;
      } else {
        const { data } = await orderService.getOrders(sort, limit, page);
        return data;
      }
    } catch (e) {
      const err = e as AxiosError;
      return rejectWithValue(err);
    }
  }
);

/*--------------------- SLICE--------------------  */

export const OrdersSlice = createSlice({
  name: "ordersSlice",
  initialState,
  reducers: {
    setActivePage: (state, action) => {
      state.activePage = action.payload;
    },
  },

  extraReducers: (builder) =>
    builder.addCase(getOrders.fulfilled, (state, action) => {
      state.orders = action.payload.data;
      state.itemsFound = action.payload.itemsFound;
    }),
});

const { reducer: ordersReducer, actions } = OrdersSlice;

const ordersActions = {
  ...actions,
  getOrders,
};

export { ordersActions, ordersReducer };
