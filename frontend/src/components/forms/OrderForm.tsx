import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditOrderModal } from "./EditOrderModal";
import { orderService } from "../../services/OrdersServices";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { UserName } from "../users/UserName";
import { ToastContainer, toast } from 'react-toastify';



interface FormData {
  message: string;
}

const OrderForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  const { orderActive, messages, createMessagTriger } = useAppSelector((state: RootState) => state.orders);


  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    dispatch(ordersActions.getMessagesAll(orderActive?._id.toString() && orderActive._id.toString()));
  }, [orderActive, dispatch, createMessagTriger]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (orderActive.userId) {
      const dataCreate = { text: data.message, orderId: orderActive._id && orderActive._id.toString() }
      await orderService.createMessage(dataCreate);
      dispatch(ordersActions.setCreateMessagTriger());
      reset();
    } else {
      toast.error('Only manager of this order can add message. To take this order to work, click button "OPEN EDIT MODAL"', {
        className: "toast",
        bodyClassName: "grow-font-size",
        progressClassName: "fancy-progress-bar",
      });
    }
  };

  const dateFormat = (date: string) => {
    const newDate = new Date(date);
    const res = newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return res;
  }

  return (
    <div className="order-form">

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
        theme="light" />

      <div className="messages">
        <ol>{messages && messages.map((item, index) =>
          <li key={index}>
            <div className="comment-part">{item.text}</div>
            <div className="comment-part">author: <UserName id={item.userId} /></div>
            <div className="comment-part"> {dateFormat(item.date)}</div>
          </li>)}
        </ol>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="message">Message:</label>
        <input {...register("message")} id="message" />

        <button type="submit" className="button">Send Message</button>
      </form>

      {/* Кнопка для відкриття модального вікна редагування */}
      <button onClick={openEditModal} className="button">Open Edit Modal</button>

      {/* Модальне вікно для редагування замовлення */}
      <EditOrderModal isOpen={isEditModalOpen} onRequestClose={closeEditModal} />

    </div>
  );
};

export { OrderForm };
