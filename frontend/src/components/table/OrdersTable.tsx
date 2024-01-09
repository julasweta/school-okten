// OrderTable.tsx
import React, { useEffect, useState, Suspense } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { Pagin } from "../pagination/Pagin";
import { useLocation, useNavigate } from "react-router-dom";
import { urls } from "../../constants/urls";
import { UserName } from "../users/UserName";
import { OrderForm } from "../forms/OrderForm";




const OrdersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const { orders, activePage, updateOrderTriger } = useAppSelector((state: RootState) => state.orders);

  const searchParams = new URLSearchParams(location.search);
  const pageNumber = searchParams.get('page');

  const onShowOrder = (orderId: string) => {
    dispatch(ordersActions.getOrderActive(orderId))
    setActiveOrder(orderId === activeOrder ? null : orderId);
  }

  useEffect(() => {
    dispatch(ordersActions.getOrders({ sort: 'DESC', limit: 5, page: activePage }));
  }, [activePage, updateOrderTriger, dispatch]);

  useEffect(() => {
    dispatch(ordersActions.setActivePage(+pageNumber));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    const isAccess = localStorage.getItem("accessToken");
    if (!isAccess) { navigate(urls.auth.login) }
  }, [navigate]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
            <th>Course</th>
            <th>Course Format</th>
            <th>Course Type</th>
            <th>Status</th>
            <th>Sum</th>
            <th>Already Paid</th>
            <th>Created At</th>
            <th>Manager Id</th>
            {/* Додати інші стовпці за потребою */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => onShowOrder(order._id)}>
                <td>{order._id}</td>
                <td>{order.name}</td>
                <td>{order.surname}</td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{order.age}</td>
                <td>{order.course}</td>
                <td>{order.course_format}</td>
                <td>{order.course_type}</td>
                <td>{order.status}</td>
                <td>{order.sum}</td>
                <td>{order.alreadyPaid ? "Yes" : "No"}</td>
                <td>{order.created_at}</td>
                <td><UserName id={order.userId && order.userId.toString()}></UserName></td>
                {/* Додати інші стовпці за потребою */}
              </tr>
              {activeOrder === order._id && (
                <tr>
                  <td colSpan={14}>
                    <Suspense fallback={<div>Loading...</div>}>
                      <OrderForm />
                    </Suspense>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Pagin />
    </div>
  );
};

export { OrdersTable };

