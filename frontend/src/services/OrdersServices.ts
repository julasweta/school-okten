import { urls } from "../constants/urls";
import { EditOrderFormData, Order } from "../interfaces";
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
  getOrder: (id: string): IRes<any> => apiService.get(urls.orders.byId(id)),
  updateOrder: (id: string, data: EditOrderFormData): IRes<any> =>
    apiService.put(urls.orders.update(id), data),
  createMessage: (data: object): IRes<any>=> apiService.post(urls.orders.messages, data)
};

export { orderService };
