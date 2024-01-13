import { urls } from "../constants/urls";
import { IUser } from "../interfaces";
import { IRes, apiService } from "./ApiServices";

const userService = {
  getUserById: (id: string): IRes<IUser> => apiService.get(urls.users.byId(id)),
  createUser: (data:IUser): IRes<IUser> => apiService.post(urls.users.create, data),
};

export { userService };
