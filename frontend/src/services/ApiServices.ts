import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { authService } from "./authService";
import { urls } from "../constants/urls";

type IRes<DATA> = Promise<AxiosResponse<DATA>>;

const baseURL = process.env.REACT_APP_API;
const apiService: AxiosInstance = axios.create({ baseURL });

// записуємо токен у всі запити в header
apiService.interceptors.request.use((req) => {
  const access = authService.getAccessToken();
  console.log(access);
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
    if (error.response) {
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
            //  router.navigate('/login?SessionExpired=true')
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
    }

    return Promise.reject(error);
  },
);
type IWaitList = () => void;
const subscribeToWaitList = (cb: IWaitList): void => {
  waitList.push(cb);
};

const afterRefresh = (): void => {
  while (waitList.length) {
    const cb = waitList.pop();
    cb();
  }
};

export { apiService, baseURL };
export type { IRes };
