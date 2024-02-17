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

const OrdersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    orders,
    updateOrderTriger,
    orderActive,
    activePage,
    addGroupTriger,
    sort,
    nameSortRow,
    limit,
    searchQuery,
    isChecked
  } = useAppSelector((state: RootState) => state.orders);

  const searchParams = new URLSearchParams(location.search);
  const pageNumber = searchParams.get("page");
  const sortRowNameParam = searchParams.get("nameSortRow");
  const sortParamValue = searchParams.get("order");


  const onGetOrderActive = (orderId: string) => {
    dispatch(ordersActions.getOrderActive(orderId));
  };


  //write params
  useEffect(() => {
    dispatch(ordersActions.setActivePage(+pageNumber));
    dispatch(ordersActions.setNameRowSort(sortRowNameParam && sortRowNameParam));
    if (sortParamValue !== null && sortParamValue !== "false") {
      dispatch(ordersActions.setSort(sortParamValue));
    }
  }, [sortRowNameParam, sortParamValue, pageNumber, dispatch]);

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
      console.log(sort);
      dispatch(
        ordersActions.getOrders({
          sort: sort,
          nameSortRow: nameSortRow ? nameSortRow : '',
          limit: limit,
          page: activePage,
          surname: searchQuery.surname === null || searchQuery.surname === undefined || searchQuery.surname === '' ? "" : searchQuery.surname,
          email: searchQuery.email !== undefined && searchQuery.email !== '' ? searchQuery.email : '',
          age: searchQuery.age !== undefined && searchQuery.age !== '' ? searchQuery.age : '',
          name: searchQuery.name !== undefined && searchQuery.name !== '' ? searchQuery.name : '',
          phone: searchQuery.phone !== undefined && searchQuery.phone !== '' ? searchQuery.phone : '',
          course: searchQuery.course !== undefined && searchQuery.course !== '' ? searchQuery.course : '',
          course_format: searchQuery.course_format !== undefined && searchQuery.course_format !== '' ? searchQuery.course_format : '',
          course_type: searchQuery.course_type !== undefined && searchQuery.course_type !== '' ? searchQuery.course_type : '',
          status: searchQuery.status !== undefined && searchQuery.status !== '' ? searchQuery.status : '',
          groupName: searchQuery.groupName !== undefined && searchQuery.groupName !== '' ? searchQuery.groupName : '',
          userId: searchQuery.userId !== undefined && searchQuery.userId !== '' ? searchQuery.userId : '',
        }),
      );

      const currentPath = window.location.pathname;
      if (currentPath === "/orders") {
        navigate(
          `?${activePage && `page=${activePage}`}&limit=${limit}&order=${sort && sort}${nameSortRow ? `&nameSortRow=${nameSortRow}` : ""}${searchQuery.email ? `&email=${searchQuery.email}` : ''}${searchQuery.age ? `&age=${searchQuery.age}` : ''}${searchQuery.name ? `&name=${searchQuery.name}` : ''}${searchQuery.phone ? `&phone=${searchQuery.phone}` : ''}${searchQuery.course ? `&course=${searchQuery.course}` : ''}${searchQuery.course_type ? `&course_type=${searchQuery.course_type}` : ''}${searchQuery.course_format ? `&course_format=${searchQuery.course_format}` : ''}${searchQuery.status ? `&status=${searchQuery.status}` : ''}${searchQuery.groupName ? `&groupName=${searchQuery.groupName}` : ''}${searchQuery.userId ? `&userId=${searchQuery.userId}` : ''}`,
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching orders:", error);
    }
  }, [
    activePage,
    updateOrderTriger,
    nameSortRow,
    sort,
    isChecked,
    orderActive,
    searchQuery,
    
    limit,
    dispatch,
    navigate,
  ]);

  const onSortRow = (column: string) => {
    dispatch(ordersActions.setSort(sort === "DESC" ? "ASC" : "DESC"));
    dispatch(ordersActions.setNameRowSort(column));
    dispatch(ordersActions.setActivePage(1))
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
