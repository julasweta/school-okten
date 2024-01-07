// OrderTable.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { Pagin } from "../pagination/Pagin";
import { useLocation, useNavigate } from "react-router-dom";
import { urls } from "../../constants/urls";

const OrdersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { orders, activePage } = useAppSelector((state: RootState) => state.orders);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageNumber = searchParams.get('page');

  useEffect(() => {
    dispatch(ordersActions.setActivePage(+pageNumber))
  }, [dispatch, pageNumber]);

  useEffect(() => {
    const isAccess = localStorage.getItem("accessToken");
    if (!isAccess) { navigate(urls.auth.login) }
  }, [])


  useEffect(() => {
    dispatch(ordersActions.getOrders({ sort: 'DESC', limit: 5, page: activePage }));
  }, [activePage, dispatch]);

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
            {/* Додати інші стовпці за потребою */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
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
              {/* ДодаТи інші стовпці за потребою */}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagin />
    </div>
  );
};

export { OrdersTable };
