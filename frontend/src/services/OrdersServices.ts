import { Order } from "../interfaces";
import { IPageData } from "../interfaces/IPaginationOrder";
import {  IRes, apiService } from "./ApiServices";

const orderService = {
  getOrders: (limit: number, page: number): IRes<IPageData<Order>> =>
    apiService.get(`orders/getAllQuery?limit=${limit}&page=${page}`),
};

export { orderService };
