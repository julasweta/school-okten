import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { OrdersPage } from "../pages/OrdersPage";
import { MainLayout } from "../layouts/MainLayout";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { Admin } from "../pages";
import { Activate } from "../components/activate/Activate";

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
