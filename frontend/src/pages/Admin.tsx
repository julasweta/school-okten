import React, { useEffect } from "react";
import { UserCreateModal } from "../components/forms";
import {  useAppSelector } from "../hooks/hooks";
import { RootState } from "../redux/store";
import { User } from "../components/users/User";

const Admin = () => {
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const { createdUser } = useAppSelector((state: RootState) => state.users);

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
  console.log(createdUser);

  return <div className="admin-page">
    <button onClick={openEditModal} className="button create-field">Open Modal Create User</button>
    <UserCreateModal isOpen={isEditModalOpen} onRequestClose={closeEditModal} />
    {createdUser.token ? (<>  {showActivateLinkForUser()}</>) : ''}
  </div>;
};

export { Admin };