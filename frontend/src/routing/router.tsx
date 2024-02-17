import { Navigate, createBrowserRouter } from "react-router-dom";

import { Activate, LoginForm } from "../components";
import { MainLayout } from "../layouts/MainLayout";
import { AppRoutes } from "./AppRoutes";
import { Admin, OrdersPage } from "../pages";
import Error404 from "../components/Error404";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={AppRoutes.ORDERS} />,
      },
      {
        path: "*",
        element: <Error404 />,
      },
      {
        path: AppRoutes.ORDERS,
        element: <OrdersPage />,
      },
      {
        path: AppRoutes.ACTIVATE,
        element: <Activate />,
      },
      {
        path: AppRoutes.ADMIN,
        element: <Admin />,
      },
      {
        path: AppRoutes.LOGIN,
        element: <LoginForm />,
      },
    ],
  },
]);
