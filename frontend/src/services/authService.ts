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
  async login(authData: IAuth): Promise<IUser> {
    const { data } = await apiService.post<ITokens>(urls.auth.login, authData);
    this.setTokens(data);
    const { data: me } = await this.me();
    return me;
  },

  //додавання паролю по токену
  activateUser: (pass: string, token: string): IRes<IUser> =>
    apiService.put(`${urls.auth.activate}?token=${token}`, { password: pass }),

  //створення нового паролю/відправляємо email, отримуємо токен, на сервері додаємо його до юзера, потім button *recovery password* змінюється на *activate*
  recoveryPassword: (email: string): IRes<string> =>
    apiService.put(`${urls.auth.recoveryPassword}`, { email: email }),

  async logout(): Promise<string> {
    await apiService.post(urls.auth.logout);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return "res";
  },

  async refresh(): Promise<void> {
    const refresh = this.getRefreshToken();
    if (refresh) {
      const { data } = await apiService.post<ITokens>(urls.auth.refresh, {
        refresh,
      });
      this.setTokens(data);
    }
  },

  //тут лише отримання данних з авторизованого користувача, після оновлення сторінки і при наявності токена
  async me(): Promise<IRes<IUser>> {
    return await apiService.get(urls.auth.me);
  },

  async setTokens(data: ITokens): Promise<void> {
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
