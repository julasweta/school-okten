import React, { useEffect } from "react";
import { UserCreateModal } from "../components/forms";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { RootState } from "../redux/store";
import { User } from "../components/users/User";
import { Order } from "../interfaces";
import { ordersActions } from "../redux/slices/OrderSlices";

const Admin = () => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const { createdUser } = useAppSelector((state: RootState) => state.users);
  const { orders, updateOrderTriger} = useAppSelector((state: RootState) => state.orders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(ordersActions.getOrders({ sort: 'DESC', limit: 0, page: 1, search: '', nameSortRow: '_id', nameSearchRow: '' }));
  }, [updateOrderTriger,  dispatch]);


  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const showActivateLinkForUser = () => {
    return (<User user={createdUser}></User>)
  }

  useEffect(() => {
  }, [createdUser]);


  const filterOrders = (key: keyof Order, value: string | null) => {
    return orders && orders.filter(item => item[key] === value);
  };



  return <div className="admin-page">
    <button onClick={openEditModal} className="button create-field">Open Modal Create User</button>
    <UserCreateModal isOpen={isEditModalOpen} onRequestClose={closeEditModal} />
    {createdUser.token ? (<>  {showActivateLinkForUser()}</>) : ''}
    <div> total: {orders.length}</div>
    <div> inWork: {filterOrders('status', 'In work'.trim()).length}</div>
    <div> NEW: {filterOrders('status', null).length}</div>
  </div>;
};

export { Admin };