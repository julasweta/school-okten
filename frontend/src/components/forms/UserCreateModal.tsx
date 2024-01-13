import React, { useEffect } from "react";
import Modal from "react-modal";
import { useAppDispatch } from "../../hooks/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import {  EditOrderModalProps, IUser } from "../../interfaces";
import { usersActions } from "../../redux/slices/UserSlices";



const UserCreateModal: React.FC<EditOrderModalProps> = ({ isOpen, onRequestClose }) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm<IUser>();

  const onSubmit: SubmitHandler<IUser> = async (data) => {
    console.log('create', data);
    dispatch(usersActions.createUser(data));
    onRequestClose();
  };

  useEffect(() => {
    Modal.setAppElement('.modal');
  }, []);

  const renderFormFields = () => (
    <div className="modal create-field">
      <div className="modal-item create-field">
        <label htmlFor="email">Email:</label>
        <input {...register('email')} />
      </div>
      <div className="modal-item create-field">
        <label htmlFor="role">Role:</label>
        <select {...register('role')} defaultValue="user">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="modal-item create-field">
        <label htmlFor="name">Name:</label>
        <input {...register('name')} />
      </div>
    </div>
  );

  return (
    <div className="modal">
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Create User Modal">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form-modal">
          {renderFormFields()}
          <button type="submit" className="button create-field">
            Create User
          </button>
        </form>
        <button onClick={onRequestClose}>Close Modal</button>
      </Modal>
    </div>
  );
};

export { UserCreateModal };

