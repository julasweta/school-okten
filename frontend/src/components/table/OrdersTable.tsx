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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageParam = searchParams.get("page");
  const isAccess = localStorage.getItem("accessToken");



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

  const emailParam = searchParams.get("email");
  const ageParam = searchParams.get("age");
  const surnameParam = searchParams.get("surname");
  const nameParam = searchParams.get("name");
  const phoneParam = searchParams.get("phone");
  const courseParam = searchParams.get("course");
  const course_typeParam = searchParams.get("course_type");
  const course_formatParam = searchParams.get("course_format");
  const groupNameParam = searchParams.get("groupName");
  const statusParam = searchParams.get("status");
  const userIdParam = searchParams.get("userId");


  const filter = {
    page: activePage !==0 ? activePage : pageParam? +pageParam :1,
    age: searchQuery.age || ageParam || undefined,
    userId: searchQuery.userId === 'select' ? undefined : (searchQuery.userId || userIdParam || undefined) ,
    nameSortRow: nameSortRow || undefined,
    sort: sort,
    name: searchQuery.name || nameParam || undefined,
    surname: searchQuery.surname || surnameParam || undefined,
    email: searchQuery.email || emailParam || undefined,
    phone: searchQuery.phone || phoneParam || undefined,
    course: searchQuery.course === 'select' ? undefined : (searchQuery.course || courseParam || undefined),
    course_format: searchQuery.course_format === 'select' ? undefined : (searchQuery.course_format || course_formatParam || undefined),
    course_type: searchQuery.course_type === 'select' ? undefined : (searchQuery.course_type || course_typeParam || undefined),
    status: searchQuery.status === 'select' ? undefined : (searchQuery.status || statusParam || undefined),
    groupName: searchQuery.groupName === 'select' || searchQuery.groupName === undefined ? undefined : (searchQuery.groupName || groupNameParam || undefined),
    limit: limit
  };


  const stringified = queryString.stringify(filter);
  window.history.pushState({}, '', `?${stringified}`);

  useEffect(() => {
    if (!isAccess) {
      navigate(AppRoutes.LOGIN);
    }
  }, [isAccess, navigate]);

  useEffect(() => {
    dispatch(ordersActions.getGroups());
  }, [addGroupTriger, dispatch]);

  useEffect(() => {
    dispatch(ordersActions.setActivePage(+pageParam));
  }, []);


  useEffect(() => {
    console.log('filter', filter);
    try {
      dispatch(
        ordersActions.getOrders({
          sort: filter.sort,
          nameSortRow: filter.nameSortRow ? filter.nameSortRow : '',
          limit: filter.limit,
          page: filter.page,
          surname: filter.surname === undefined  ? "" : filter.surname,
          email: filter.email === undefined ? "" : filter.email,
          age: filter.age === undefined  ? "" : filter.age,
          name: filter.name === undefined ? "" : filter.name,
          phone: filter.phone === undefined ? "" : filter.phone,
          course: filter.course === undefined  ? "" : filter.course,
          course_format: filter.course_format === undefined  ? "" : filter.course_format,
          course_type: filter.course_type === undefined  ? "" : filter.course_type,
          status: filter.status === undefined  ? "" : filter.status,
          groupName: filter.groupName === undefined  ? "" : filter.groupName,
          userId: filter.userId === undefined  ? "" : filter.userId,

        }),
      )
    } catch (error) {
      console.error("An error occurred while fetching orders:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, nameSortRow, limit, activePage,
    dispatch, filter.age, filter.course, filter.course_format, filter.course_type, filter.email, filter.groupName, filter.limit, filter.name, filter.nameSortRow, filter.page, filter.phone, filter.sort, filter.status, filter.surname, filter.userId]);

console.log(orders);

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
