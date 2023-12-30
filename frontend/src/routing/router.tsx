import React from "react";
import { createHashRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes";
import { OrdersPage } from "../pages/OrdersPage";
import { OrderPage } from "../pages";
import { MainLayout } from "../layouts/MainLayout";

export const router = createHashRouter([
  {
    path: AppRoutes.HOME || "julides/",
    element: <MainLayout />,
    children: [
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