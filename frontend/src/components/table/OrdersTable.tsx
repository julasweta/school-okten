// OrderTable.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { columns } from "../../constants/list.table";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { RootState } from "../../redux/store";
import { OrderForm, SearchForm } from "../forms";
import { Pagin } from "../pagination/Pagin";
import { AppRoutes } from "../../routing/AppRoutes";

import queryString from 'query-string';

const OrdersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const {
    orders,
    orderActive,
    activePage,
    addGroupTriger,
    sort,
    nameSortRow,
    limit,
    searchQuery,
  } = useAppSelector((state: RootState) => state.orders);

  //додаємо в браузерний рядок дані
  const filter = {
    page: activePage || 1,
    age: searchQuery.age,
    userId: searchQuery.userId,
    nameSortRow: nameSortRow,
    sort: sort,
    name: searchQuery.name,
    surname: searchQuery.surname,
    email: searchQuery.email,
    phone: searchQuery.phone,
    course: searchQuery.course,
    course_format: searchQuery.course_format,
    course_type: searchQuery.course_type,
    status: searchQuery.status,
    groupName: searchQuery.groupName,
    limit:limit
  };
  const stringified = queryString.stringify(filter);
  window.history.pushState({}, '', `?${stringified}`);


  useEffect(() => {
    const isAccess = localStorage.getItem("accessToken");
    if (!isAccess) {
      navigate(AppRoutes.LOGIN);
    }
  }, []);

  useEffect(() => {
    dispatch(ordersActions.getGroups());
  }, [addGroupTriger, dispatch]);


  useEffect(() => {
    try {
      dispatch(
        ordersActions.getOrders({
          sort: filter.sort,
          nameSortRow: filter.nameSortRow ? filter.nameSortRow : '',
          limit: filter.limit,
          page: filter.page,
          surname: filter.surname === null || filter.surname === undefined || filter.surname === '' ? "" : filter.surname,
          email: filter.email !== undefined && filter.email !== '' ? filter.email : '',
          age: filter.age !== undefined && filter.age !== '' ? filter.age : '',
          name: filter.name !== undefined && filter.name !== '' ? filter.name : '',
          phone: filter.phone !== undefined && filter.phone !== '' ? filter.phone : '',
          course: filter.course !== undefined && filter.course !== '' ? filter.course : '',
          course_format: filter.course_format !== undefined && filter.course_format !== '' ? filter.course_format : '',
          course_type: filter.course_type !== undefined && filter.course_type !== '' ? filter.course_type : '',
          status: filter.status !== undefined && filter.status !== '' ? filter.status : '',
          groupName: filter.groupName !== undefined && filter.groupName !== '' ? filter.groupName : '',
          userId: filter.userId !== undefined && filter.userId !== '' ? filter.userId : '',
        }),
      );
    } catch (error) {
      console.error("An error occurred while fetching orders:", error);
    }
  }, [sort, nameSortRow, limit, activePage, searchQuery]);

  const onSortRow = (column: string) => {
    dispatch(ordersActions.setSort(sort === "DESC" ? "ASC" : "DESC"));
    dispatch(ordersActions.setNameRowSort(column));
    dispatch(ordersActions.setActivePage(1))
  };

  const onGetOrderActive = (orderId: string) => {
    dispatch(ordersActions.getOrderActive(orderId));
  };

  const renderTableHeader = () => {
    return columns.map((column) => (
      <th
        key={column}
        onClick={() => onSortRow(column)}
        title={`sort ` + column}
      >
        {column}
      </th>
    ));
  };
  return (
    <div>
      <SearchForm />
      <table>
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>
          {orders && orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr
                onClick={() => onGetOrderActive(order._id)}
                className={orderActive?._id === order._id ? "focus" : ""}
              >
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
                <td>{order.groupName}</td>
                <td>
                  {/*  < id={order.user._id?.toString()} /> */}
                  {order.user._id ? order.user._id.toString() : ""}
                </td>
                {/* Додати інші стовпці за потребою */}
              </tr>
              {orderActive?._id === order._id && (
                <tr key={`${order._id}-details`}>
                  <td colSpan={14}>
                    <OrderForm />
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
