import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Message, Order } from "../../interfaces";
import { orderService } from "../../services/OrdersServices";
import { AxiosError } from "axios";
import { IPageInterface } from "../../interfaces/IPaginationOrder";
import { IGroup } from "../../interfaces/IGroup";

interface OrderState {
  orders: Order[];
  orderActive: Order;
  messages: Message[];
  updateOrderTriger: boolean;
  createMessagTriger: boolean;
  itemsFound: number;
  activePage: number;
  searchValue: string;
  nameSearchRow: string;
  groups: IGroup[],
  addGroupTriger: boolean;
  isChecked: boolean;
  sort: string;
}

const initialState: OrderState = {
  orders: [],
  orderActive: null,
  messages: null,
  updateOrderTriger: true,
  createMessagTriger: true,
  itemsFound: 0,
  activePage: 1,
  searchValue: "",
  nameSearchRow: "",
  groups: [],
  addGroupTriger: true,
  isChecked: false,
  sort: 'DESC',
};

/*-----------------AsyncThunk -------------------------------  */
const getOrders = createAsyncThunk<
  IPageInterface<Order>,
  {
    sort: string;
    limit: number;
    page?: number | null; // Змінив тип на необов'язковий
    search: string;
    nameSortRow: string;
    nameSearchRow: string;
  },
  { rejectValue: AxiosError }
>(
  "ordersSlice/getOrders",
  async (
    { sort, limit, page, search, nameSortRow, nameSearchRow },
    { rejectWithValue }
  ) => {
    try {
      console.log("Before request - search:", search);

      const { data } = await orderService.getOrders(
        sort,
        limit,
        page,
        search ? search.trim():'',
        nameSortRow,
        nameSearchRow? nameSearchRow : ''
      );

      console.log("After request - page:", page);

      return data;
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

export const getGroups = createAsyncThunk<IGroup[], void>(
  "ordersSlice/getGroups",
  async (_, { rejectWithValue }) => {
    try {
      const {data} = await orderService.getAllGroups();
      return data;
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
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setSearchNameRow: (state, action) => {
      state.nameSearchRow = action.payload;
    },
    setaddGroupTriger: (state) => {
      state.addGroupTriger = !state.addGroupTriger;
    },
    setIsChecked: (state) => {
      state.isChecked = !state.isChecked;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
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
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      }),
});

const { reducer: ordersReducer, actions } = OrdersSlice;

const ordersActions = {
  ...actions,
  getOrders,
  getOrderActive,
  getMessagesAll,
  getGroups,
};

export { ordersActions, ordersReducer };
