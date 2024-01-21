import { urls } from "../constants/urls";
import { EditOrderFormData, IMessages, Order } from "../interfaces";
import { IGroup } from "../interfaces/IGroup";
import { IPageInterface } from "../interfaces/IPaginationOrder";
import { IRes, apiService } from "./ApiServices";

const orderService = {
  getOrders: (
    sort: string,
    limit: number,
    page: number,
    search: string,
    nameSortRow: string,
    nameSearchRow: string,
  ): IRes<IPageInterface<Order>> =>
    apiService.get(
      `orders/getAllQuery?order=${sort}&limit=${limit}&page=${page}${
        search !== undefined && search !== "" ? `&search=${search}` : ""
      }${
        nameSortRow !== undefined && nameSortRow !== ""
          ? `&nameSortRow=${nameSortRow}`
          : ""
      }
      ${
        nameSearchRow !== undefined && nameSearchRow !== ""
          ? `&nameSearchRow=${nameSearchRow}`
          : ""
      }`,
    ),

  getAll: (): IRes<Order[]> => apiService.get(urls.orders.all),
  getOrder: (id: string): IRes<any> => apiService.get(urls.orders.byId(id)),
  updateOrder: (id: string, data: EditOrderFormData): IRes<any> =>
    apiService.put(urls.orders.update(id), data),
  createMessage: (data: object): IRes<any> =>
    apiService.post(urls.orders.messages, data),
  getAllMessages: (orderId: string): Promise<IMessages> =>
    apiService.get(urls.orders.messagesAll, { params: { orderId } }),
  getAllGroups: (): IRes<IGroup[]> => apiService.get(urls.orders.groups),
  createGroup: (title: { title: string }): IRes<void> =>
    apiService.post(urls.orders.groupCreate, title),
};

export { orderService };
