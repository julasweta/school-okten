import { urls } from "../constants/urls";
import { IPageInterface, IUser } from "../interfaces";
import { IRes, apiService } from "./ApiServices";

const userService = {
  getUserById: (id: string): IRes<IUser> => apiService.get(urls.users.byId(id)),
  createUser: (data: IUser): IRes<IUser> =>
    apiService.post(urls.users.create, data),
  getAllUsers: ({
    page,
    limit,
    email,
  }: {
    page?: number;
    limit?: number;
    email?: string;
  }): IRes<IPageInterface<IUser>> =>
    apiService.get(
      urls.users.getAll +
        `?page=${page ?? ""}&limit=${limit ?? ""}&email=${email ?? ""}`
    ),

  banUserById: (id: string, status: string): IRes<IUser> =>
    apiService.put(urls.users.ban(id), { status: status }),
};

export { userService };
