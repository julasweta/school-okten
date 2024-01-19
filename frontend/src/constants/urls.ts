const baseURL = process.env.REACT_APP_API;

const orders = "/orders";
const auth = "/auth";
const users = "/users";
const messages = '/messages';
const groups = '/groups';
const urls = {
  orders: {
    base: orders,
    byId: (id: string): string => `${orders}/${id}`,
    update: (id: string): string => `${orders}/update/${id}`,
    messages: messages,
    messagesAll: `${messages}/all`,
    groups: groups,
    groupCreate: `${groups}/create`,
  },
  auth: {
    login: "auth/login",
    refresh: `${auth}/refresh`,
    register: `auth/create/user`,
    me: `${auth}/me`,
    logout: `auth/logout`,
  },
  users: {
    byId: (id: string): string => `${users}/${id}`,
    create: `${auth}/create/user`,
    getAll:`${users}`
  },
};

export { baseURL, urls };
