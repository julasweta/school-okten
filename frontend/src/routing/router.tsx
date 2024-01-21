import { Navigate, createBrowserRouter } from "react-router-dom";

import { Activate, LoginForm, RegisterForm } from "../components";
import { MainLayout } from "../layouts/MainLayout";
import { AppRoutes } from "./AppRoutes";
import { Admin, OrdersPage } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={AppRoutes.LOGIN} />,
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
      {
        path: AppRoutes.REGISTER,
        element: <RegisterForm />,
      },
    ],
  },
]);
