import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { authService } from "./authService";
import { urls } from "../constants";

type IRes<DATA> = Promise<AxiosResponse<DATA>>;

const baseURL = process.env.REACT_APP_API;
const apiService: AxiosInstance = axios.create({ baseURL });

// Додамо інтерсептор запитів для авторизації
apiService.interceptors.request.use((req) => {
  const access = authService.getAccessToken();
  if (access) {
    req.headers.Authorization = `Bearer ${access}`;
  }
  return req;
});

let isRefreshing = false;
const waitList: IWaitList[] = [];
apiService.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await authService.refresh();
          isRefreshing = false;
          afterRefresh();
          return apiService(originalRequest);
        } catch (e) {
          authService.deleteTokens();
          isRefreshing = false;
          console.log("i am false refreshing");
          return Promise.reject(error);
        }
      }
      if (originalRequest.url === urls.auth.refresh) {
        return Promise.reject(error);
      }

      return new Promise((resolve) => {
        subscribeToWaitList(() => resolve(apiService(originalRequest)));
      });
    }

    return Promise.reject(error);
  },
);
type IWaitList = () => void;

// Підписуємось на чергу очікування для виконання після оновлення токенів
const subscribeToWaitList = (cb: IWaitList): void => {
  waitList.push(cb);
};

// Викликається після успішного оновлення токенів
const afterRefresh = (): void => {
  console.log("i am afterrefresh");
  while (waitList.length) {
    const cb = waitList.pop();
    console.log("i am cb");
    cb(); // Викликаємо колбек
  }
};

export { apiService, baseURL };
export type { IRes };
