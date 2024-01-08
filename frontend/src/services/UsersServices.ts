import { urls } from "../constants/urls";
import { IUser } from "../interfaces";
import { IRes, apiService } from "./ApiServices";

const userService = {
  getUserById: (id: string): IRes<IUser> => apiService.get(urls.users.byId(id)),
};

export { userService };
