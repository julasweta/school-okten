import React, { useEffect } from "react";
import Modal from "react-modal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { orderService } from "../../services/OrdersServices";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { Course, CourseFormat, CourseType, EditOrderFormData, EditOrderModalProps, StatusWork } from "../../interfaces";




const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onRequestClose }) => {
  const dispatch = useAppDispatch();
  const { orderActive } = useAppSelector((state: RootState) => state.orders);
  const { me } = useAppSelector((state: RootState) => state.auth);
  const { register, handleSubmit, setValue } = useForm<EditOrderFormData>();

  const onSubmit: SubmitHandler<EditOrderFormData> = async (data) => {
    if (orderActive.userId.toString() && orderActive.userId.toString() === me._id && me._id) {

      const dataFormat = { ...data, age: +data.age }
      await orderService.updateOrder(orderActive._id, dataFormat);
      dispatch(ordersActions.setUpdateOrderTriger());
      onRequestClose();
    }
    else {
      alert('You don`t change this order');
    }
  };

  useEffect(() => {
    if (orderActive) {
      Object.entries(orderActive).forEach(([key, value]) => {
        setValue(key as keyof EditOrderFormData, value);
      });
    }
  }, [orderActive, setValue]);

  useEffect(() => {
    Modal.setAppElement('.modal');
  }, []);

  const renderFormFields = () => {
    if (!orderActive) {
      return null;
    }

    return Object.entries(orderActive).map(([key, value]) => (
      <div key={key as string}>
        {(key !== "userId" && key !== "msg") && ( // Умова для ігнорування ключа "userId"
          <>
            <label htmlFor={key as string}>{key}:</label>
            {(key === "course" || key === "course_format" || key === "course_type" || key === "status") ? (
              <select {...register(key as keyof EditOrderFormData)} defaultValue={value}>
                {Object.values((key === "course" ? Course : key === "course_format" ? CourseFormat : key === "course_type" ? CourseType : StatusWork)).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input {...register(key as keyof EditOrderFormData)} defaultValue={value} />
            )}
          </>
        )}
      </div>
    ));

  };

  return (
    <div className="modal">
      <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Order Modal">
        <h2>Edit Order</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderFormFields()}
          <button type="submit">Save Changes</button>
        </form>
        <button onClick={onRequestClose}>Close Modal</button>
      </Modal>
    </div>
  );
};

export { EditOrderModal };
