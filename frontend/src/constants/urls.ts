const baseURL = process.env.REACT_APP_API;

const orders = "/orders";
const auth = "/auth";
const users = "/users";
const urls = {
  orders: {
    base: orders,
    byId: (id: number): string => `${orders}/${id}`,
  },
  auth: {
    login: "auth/login",
    refresh: `${auth}/refresh`,
    register: `auth/create/user`,
    me: `${auth}/me`,
  },
};

export { baseURL, urls };
