import { Order } from "../interfaces";
import {  IPageInterface } from "../interfaces/IPaginationOrder";
import { IRes, apiService } from "./ApiServices";

const orderService = {
  getOrders: (
    sort: string,
    limit: number,
    page: number
  ): IRes<IPageInterface<Order>> =>
    apiService.get(
      `orders/getAllQuery?order=${sort}&limit=${limit}&page=${page}`
    ),
};

export { orderService };
