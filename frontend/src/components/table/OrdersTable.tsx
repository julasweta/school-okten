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

  const { orders, updateOrderTriger, orderActive, activePage, searchValue, nameSearchRow, addGroupTriger, sort } = useAppSelector((state: RootState) => state.orders);
  const [nameSortRow, setNameRow] = useState('');
  const searchParams = new URLSearchParams(location.search);
  const searchParam = searchParams.get('search');
  const nameSearchRowParam = searchParams.get('nameSearchRow');
  const pageNumber = +searchParams.get('page') || 1;

  const onGetOrderActive = (orderId: string) => {
    dispatch(ordersActions.getOrderActive(orderId));
  };

  useEffect(() => {
    dispatch(ordersActions.setActivePage(pageNumber));
    dispatch(ordersActions.getOrderActive(null));
    dispatch(ordersActions.setSearchValue(searchParam));
    dispatch(ordersActions.setSearchNameRow(nameSearchRowParam))
  }, [searchParam, nameSearchRowParam, pageNumber, dispatch]);

  useEffect(() => {
    const isAccess = localStorage.getItem("accessToken");
    if (!isAccess) {
      navigate(urls.auth.login);
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(ordersActions.getGroups())
  }, [addGroupTriger, dispatch]);


  useEffect(() => {
    console.log('orders Table - searchValue', searchValue);
    dispatch(
      ordersActions.getOrders({
        sort: sort,
        limit: 15,
        page: activePage,
        search: searchValue,
        nameSortRow: nameSortRow,
        nameSearchRow: nameSearchRow,
      })
    );
  }, [activePage, updateOrderTriger, searchValue, nameSortRow, sort, nameSearchRow, orderActive,  dispatch]);


  const onSortRow = (column: string) => {
    dispatch(ordersActions.setSort(sort === 'DESC' ? 'ASC' : 'DESC'))
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
              <tr onClick={() => onGetOrderActive(order._id)} className={orderActive?._id === order._id ? 'focus' : ''}>

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



