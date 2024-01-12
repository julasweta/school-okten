// OrderTable.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { Pagin } from "../pagination/Pagin";
import { useLocation, useNavigate } from "react-router-dom";
import { urls } from "../../constants/urls";
import { UserName } from "../users/UserName";
import { OrderForm } from "../forms/OrderForm";
import { columns } from "../../constants/list.table";
import { SearchForm } from "../forms/SearshForm";




const OrdersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { orders, updateOrderTriger, orderActive, activePage, searchValue, nameSearchRow } = useAppSelector((state: RootState) => state.orders);
  const [sort, setSort] = useState('DESC');
  const [nameSortRow, setNameRow] = useState('');
  const searchParams = new URLSearchParams(location.search);
  const pageNumber = +searchParams.get('page');

  const onSetOrderActive = (orderId: string) => {
    dispatch(ordersActions.getOrderActive(orderId));
  };

  useEffect(() => {
    const isAccess = localStorage.getItem("accessToken");
    if (!isAccess) {
      navigate(urls.auth.login);
    }
  }, [navigate]);

  useEffect(() => {
    if (pageNumber) {
      dispatch(ordersActions.setActivePage(pageNumber))
    }
    else {
      dispatch(ordersActions.setActivePage(1))
    }
    dispatch(ordersActions.getOrderActive(null));
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (orders.length < 1) {
      dispatch(ordersActions.setSearchValue(''));
      activePage && dispatch(ordersActions.getOrders({ sort: sort, limit: 15, page: activePage, search: searchValue.trim(), nameSortRow: nameSortRow, nameSearchRow: nameSearchRow }));
    }
    else { activePage && dispatch(ordersActions.getOrders({ sort: sort, limit: 15, page: activePage, search: searchValue.trim(), nameSortRow: nameSortRow, nameSearchRow: nameSearchRow })); }
  }, [activePage, updateOrderTriger, searchValue, nameSortRow, sort, nameSearchRow, dispatch]);

  const onSortRow = (column: string) => {
    setSort(sort === 'DESC' ? 'ASC' : 'DESC');
    setNameRow(column);
  }


  const renderTableHeader = () => {
    return columns.map((column) => (
      <th key={column} onClick={() => onSortRow(column)} title={`sort ` + column}>
        {column}
      </th>
    ));
  };


  return (
    <div>
      <SearchForm />
      <table>
        <thead>
          <tr>
            {renderTableHeader()}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr onClick={() => onSetOrderActive(order._id)} className={orderActive?._id === order._id ? 'focus' : ''}>

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
                <td><UserName id={order.userId?.toString()} /></td>
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



