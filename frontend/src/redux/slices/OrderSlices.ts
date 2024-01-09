import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IMessages, Message, Order } from "../../interfaces";
import { orderService } from "../../services/OrdersServices";
import { AxiosError } from "axios";
import { IPageInterface } from "../../interfaces/IPaginationOrder";

interface OrderState {
  orders: Order[];
  orderActive: Order;
  messages: Message[];
  updateOrderTriger: boolean;
  createMessagTriger: boolean;
  itemsFound: number;
  activePage: number;
}

const initialState: OrderState = {
  orders: [],
  orderActive: null,
  messages: null,
  updateOrderTriger: true,
  createMessagTriger: true,
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

const getOrderActive = createAsyncThunk<
  Order,
  string,
  { rejectValue: AxiosError }
>("ordersSlice/getOrderActives", async (id, { rejectWithValue }) => {
  try {
    const { data } = await orderService.getOrder(id);
    return data;
  } catch (e) {
    const err = e as AxiosError;
    return rejectWithValue(err);
  }
});

const getMessagesAll = createAsyncThunk(
  "ordersSlice/getMessagesAll",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllMessages(orderId);
      const data = response.data; 

      const dataFilter = data.filter((item) => item.orderId === orderId);

      return dataFilter;
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
    setUpdateOrderTriger: (state) => {
      state.updateOrderTriger = !state.updateOrderTriger;
    },
    setCreateMessagTriger: (state) => {
      state.createMessagTriger = !state.createMessagTriger;
    },
  },

  extraReducers: (builder) =>
    builder
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data;
        state.itemsFound = action.payload.itemsFound;
      })
      .addCase(getOrderActive.fulfilled, (state, action) => {
        state.orderActive = action.payload;
      })
      .addCase(getMessagesAll.fulfilled, (state, action) => {
        state.messages = action.payload;
      }),
});

const { reducer: ordersReducer, actions } = OrdersSlice;

const ordersActions = {
  ...actions,
  getOrders,
  getOrderActive,
  getMessagesAll,
};

export { ordersActions, ordersReducer };
