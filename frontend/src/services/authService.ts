import { IRes, apiService } from "./ApiServices";
import { IAuth } from "../interfaces/IAuth";
import { urls } from "../constants/urls";
import { ITokens } from "../interfaces/Itokens";
import { IUser } from "../interfaces/IUser";
import { IReg } from "../interfaces/IRegister";

const authService = {
  register: (user: IReg): IRes<IReg> =>
    apiService.post(urls.auth.register, user),

  //при логіні відправляємо два запити на авторизацію і на отримання данних токенів з auth.me
  async login(authData: IAuth): Promise<any> {
    const { data } = await apiService.post<ITokens>(urls.auth.login, authData);
    this.setTokens(data);

    const { data: me } = await this.me();
    return me;
  },

  async refresh(): Promise<void> {
    const refresh = this.getRefreshToken();
    const { data } = await apiService.post<ITokens>(urls.auth.refresh, {
      refresh,
    });
    this.setTokens(data);
  },

 

  //тут лише отримання данних з авторизованого користувача, після оновлення сторінки і при наявності токена
  me(): IRes<IUser> {
    return apiService.get(urls.auth.me);
  },

  setTokens(data: ITokens): void {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  },
  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },
  getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  },
  deleteTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export { authService };