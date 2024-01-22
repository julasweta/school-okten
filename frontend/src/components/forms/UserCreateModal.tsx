import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { EditOrderModalProps, IUser } from "../../interfaces";
import { usersActions } from "../../redux/slices/UserSlices";
import { RootState } from "../../redux/store";

const UserCreateModal: React.FC<EditOrderModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<IUser>();
  const { users } = useAppSelector((state: RootState) => state.users);
  const [usersTriger, setUsersTriger] = useState(true);

  useEffect(() => {
    dispatch(usersActions.getAllUsers());
  }, [usersTriger, dispatch]);

  const onSubmit: SubmitHandler<IUser> = async (data) => {
    const isUser =
      users &&
      users.filter(
        (user) => user.email.toLowerCase() === data.email.toLowerCase(),
      );
    if (isUser.length >= 1) {
      toast.error("this user is already registered", {
        className: "toast",
        bodyClassName: "grow-font-size",
        progressClassName: "fancy-progress-bar",
      });
    } else {
      await dispatch(usersActions.createUser(data));
      onRequestClose();

      setUsersTriger(!usersTriger);
    }
  };

  useEffect(() => {
    Modal.setAppElement(".modal");
  }, []);

  const renderFormFields = () => (
    <div className="modal create-field">
      <div className="modal-item create-field">
        <label htmlFor="email">Email:</label>
        <input {...register("email")} />
      </div>
      <div className="modal-item create-field">
        <label htmlFor="role">Role:</label>
        <select {...register("role")} defaultValue="user">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="modal-item create-field">
        <label htmlFor="name">Name:</label>
        <input {...register("name")} />
      </div>
    </div>
  );

  return (
    <div className="modal">
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Create User Modal"
      >
        <h2>Create User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form-modal">
          {renderFormFields()}
          <button type="submit" className="button create-field">
            Create User
          </button>
        </form>
        <button onClick={onRequestClose}>Close Modal</button>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export { UserCreateModal };
