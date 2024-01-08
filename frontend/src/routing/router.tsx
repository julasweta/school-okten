import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { OrdersPage } from "../pages/OrdersPage";
import { OrderPage } from "../pages";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";

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
        path: AppRoutes.ORDER,
        element: <OrderPage />,
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
