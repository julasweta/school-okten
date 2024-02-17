import { urls } from "../constants/urls";
import { EditOrderFormData, IMessages, Message, Order } from "../interfaces";
import { IGroup } from "../interfaces/IGroup";
import { IPageInterface } from "../interfaces/IPaginationOrder";
import { IRes, apiService } from "./ApiServices";

const orderService =  {
getOrders: (
  sort: string,
  limit: number,
  page: number,
  nameSortRow: string,
  name: string,
  surname: string,
  email: string,
  age: string,
  phone: string,
  course: string,
  course_format: string,
  course_type: string,
  status: string,
  groupName: string,
  userId: string,
): IRes<IPageInterface<Order>> => {
  // Формування рядка запиту з врахуванням лише заповнених параметрів
    const queryString =
      `orders/getAllQuery?order=${sort}&limit=${limit}&page=${page}` +
      `${nameSortRow ? `&nameSortRow=${nameSortRow}` : ""}` +
      `${name ? `&name=${name}` : ""}` +
      `${surname ? `&surname=${surname}` : ""}` +
      `${email ? `&email=${email}` : ""}` +
      `${age ? `&age=${age}` : ""}` +
      `${phone ? `&phone=${phone}` : ""}` +
      `${course ? `&course=${course}` : ""}` +
      `${course_format ? `&course_format=${course_format}` : ""}` +
      `${course_type ? `&course_type=${course_type}` : ""}` +
      `${status ? `&status=${status}` : ""}` +
      `${groupName ? `&groupName=${groupName}` : ""}` +
      `${userId ? `&userId=${userId}` : ""}`;

  return apiService.get(queryString);
},

  getAll: (): IRes<Order[]> => apiService.get(urls.orders.all),
  getOrder: (id: string): IRes<Order> => apiService.get(urls.orders.byId(id)),
  updateOrder: (id: string, data: Partial<EditOrderFormData>): IRes<Order> =>
    apiService.put(urls.orders.update(id), data),
  createMessage: (data: object): IRes<Message> =>
    apiService.post(urls.orders.messages, data),
  getAllMessages: (orderId: string): Promise<IMessages> =>
    apiService.get(urls.orders.messagesAll, { params: { orderId } }),
  getAllGroups: (): IRes<IGroup[]> => apiService.get(urls.orders.groups),
  createGroup: (title: { title: string }): IRes<void> =>
    apiService.post(urls.orders.groupCreate, title),
};

export { orderService };
