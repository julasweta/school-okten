import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { OrdersPage } from "../pages/OrdersPage";
import { OrderPage } from "../pages";
import { MainLayout } from "../layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: '/' ,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={'orders'} />,
      },
      {
        path: AppRoutes.ORDERS,
        element: <OrdersPage />,
      },
      {
        path: AppRoutes.ORDER,
        element: <OrderPage />,
      },

    ],
  },
]);