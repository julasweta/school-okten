import React, { useEffect } from "react";
import { UserCreateModal } from "../components/forms";
import { Users } from "../components/users";
import { User } from "../components/users/User";

import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { Order } from "../interfaces";
import { ordersActions } from "../redux/slices/OrderSlices";
import { RootState } from "../redux/store";

const Admin = () => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const { createdUser } = useAppSelector((state: RootState) => state.users);
  const { orders, updateOrderTriger } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      ordersActions.getOrders({
        sort: "DESC",
        limit: 0,
        page: 1,
        nameSortRow: "_id",
        name: "",
        surname: "",
        email: "",
        age: "",
        phone: "",
        course: "",
        course_format: "",
        course_type: "",
        status: "",
        groupName: "",
        userId: "",
      }),
    );
  }, [updateOrderTriger, dispatch]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const showActivateLinkForUser = () => {
    return <User user={createdUser}></User>;
  };

  useEffect(() => {}, [createdUser]);

  const filterOrders = (key: keyof Order, value: string | null) => {
    return orders && orders.filter((item) => item[key] === value);
  };

  return (
    <div className="admin-page">
      <button onClick={openEditModal} className="button create-field">
        Create User
      </button>
      <UserCreateModal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
      />
      {createdUser.token ? <> {showActivateLinkForUser()}</> : ""}
      <div> total: {orders.length}</div>
      <div> inWork: {filterOrders("status", "In work".trim()).length}</div>
      <div> NEW: {filterOrders("status", null).length}</div>
      <Users />
    </div>
  );
};

export { Admin };
