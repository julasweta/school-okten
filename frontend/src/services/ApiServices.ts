import axios, { AxiosInstance, AxiosResponse } from "axios";

type IRes<DATA> = Promise<AxiosResponse<DATA>>;


const baseURL = process.env.REACT_APP_API;
const apiService: AxiosInstance = axios.create({ baseURL });

//прокидуємо токен
apiService.interceptors.request.use((req) => {
  req.headers["Content-Type"] = "application/json";

  return req;
});

export { apiService, baseURL };
export type { IRes };
