import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { RootState } from "../../redux/store";
import { orderService } from "../../services/OrdersServices";
import { EditOrderModal } from "./EditOrderModal";
import { UserName } from "../users";

interface FormData {
  message: string;
}



const OrderForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { orderActive, messages, createMessagTriger } = useAppSelector(
    (state: RootState) => state.orders
  );
  const { me } = useAppSelector((state: RootState) => state.auth);

  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    if (orderActive?._id) {
      dispatch(ordersActions.getMessagesAll(orderActive._id.toString()));
    }
  }, [orderActive, dispatch, createMessagTriger]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (orderActive?.user?._id?.toString() === me?._id?.toString()) {
        const dataCreate = {
          text: data.message,
          orderId: orderActive._id?.toString(),
        };
        await orderService.createMessage(dataCreate);
        dispatch(ordersActions.setCreateMessagTriger());
        reset();
      } else {
        toast.error(
          'Only the manager of this order can add a message. To take this order to work, click the "Open Edit Modal" button.'
        );
      }
    } catch (error) {
      console.error('Error while submitting message:', error);
      toast.error('An error occurred while submitting the message.');
    }
  };

  const dateFormat = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

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
        theme="light"
      />

      <div className="messages">
        <ol>
          {messages?.map((item, index) => (
            <li key={index}>
              <div className="comment-part">{item.text}</div>
              <div className="comment-part">
                author: <UserName id={item.userId} />
              </div>
              <div className="comment-part">{dateFormat(item.date)}</div>
            </li>
          ))}
        </ol>
      </div>

      {(orderActive?.user?._id === me?._id?.toString() ) && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="message">Message:</label>
            <input {...register('message')} id="message" />

            <button type="submit" className="button">
              Send Message
            </button>
          </form>
        )}

      {(orderActive?.user?._id?.toString() === me?._id?.toString() ||
        !orderActive?.user?._id) && (
          <button onClick={openEditModal} className="button">
            Open Edit Modal
          </button>
        )}

      <EditOrderModal isOpen={isEditModalOpen} onRequestClose={closeEditModal} />
    </div>
  );
};

export { OrderForm};

