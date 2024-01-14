import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { orderService } from "../../services/OrdersServices";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { Course, CourseFormat, CourseType, EditOrderFormData, EditOrderModalProps, StatusWork } from "../../interfaces";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditOrderModal: React.FC<EditOrderModalProps> = ({ isOpen, onRequestClose }) => {
  const dispatch = useAppDispatch();
  const { orderActive, groups, addGroupTriger } = useAppSelector((state: RootState) => state.orders);
  const { me } = useAppSelector((state: RootState) => state.auth);
  const [groupName, setGroupName] = useState('');
  const [groupSelect, setGroupSelect] = useState('add');


  const phoneRegExp = /^\+380\d{3}\d{2}\d{2}\d{2}$/;

  const schema = yup.object().shape({
    name: yup.string().required("Ім'я є обов'язковим полем"),
    surname: yup.string().required("Прізвище є обов'язковим полем"),
    email: yup.string().email("Введіть правильний email").required("Email є обов'язковим полем"),
    phone: yup.string().matches(phoneRegExp, 'Введіть телефон у форматі +380 00 000 00 00').required("Телефон є обов'язковим полем"),
    groupName: yup.string().notRequired(),
    age: yup.number().required("Введіть вік"),
    course: yup.string().required("Курс є обов'язковим полем"),
    course_format: yup.string().required("Формат курсу є обов'язковим полем"),
    course_type: yup.string().required("Тип курсу є обов'язковим полем"),
    status: yup.string().notRequired(),
    sum: yup.number().required("Введіть суму"),
    alreadyPaid: yup.boolean().notRequired(),
    created_at: yup.string().required("Дата створення є обов'язковою"),
  });


  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
    if (orderActive.userId === null || orderActive.userId.toString() === me._id) {
      const dataFormat = { ...data, age: +data.age, already_paid: data.alreadyPaid };
      await orderService.updateOrder(orderActive._id, dataFormat);
      dispatch(ordersActions.setUpdateOrderTriger());
      onRequestClose();
    } else {
      alert("You don't change this order");
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

  useEffect(() => {
    dispatch(ordersActions.getGroups())
  }, [addGroupTriger, dispatch]);


  const onAddGroup = (group: string) => {
    setGroupSelect('add');
    const isGroup = groups.filter(item => item.title === group);

    if (isGroup.length < 1) {
      dispatch(ordersActions.setaddGroupTriger());
      orderService.createGroup({ title: group });
      toast.success(`Group ${group.toUpperCase()}  was created `);
    } else {
      setGroupSelect('add');
      toast.error('This group already exists!');
    }
  };



  const onSelectGroup = (group: string) => {
    dispatch(ordersActions.setaddGroupTriger())
    setGroupSelect('select')
  }

  const renderFormFields = () => {
    if (!orderActive) {
      return null;
    }

    return Object.entries(orderActive).map(([key, value]) => (
      <div key={key as string} className="modal-item">
        {(key !== "userId" && key !== "msg") && (
          <>
            <label htmlFor={key as string}>{key}:</label>
            {(key === "course" || key === "course_format" || key === "course_type" || key === "status") ? (
              <div className="select-wrapper">
                <select {...register(key as keyof EditOrderFormData)}>
                  {Object.values((key === "course" ? Course : key === "course_format" ? CourseFormat : key === "course_type" ? CourseType : StatusWork)).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                {key === "groupName" ? (
                  <div className="group-name-wrapper">
                    {groupSelect === 'select' ? (
                      <>
                        <select {...register(key as keyof EditOrderFormData)} onChange={(e) => setGroupName(e.target.value)}>
                          {groups.map((group) => (
                            <option key={group._id} value={group.title}>
                              {group.title}
                            </option>
                          ))}
                        </select>
                        <button type="button" className="button" onClick={() => onSelectGroup(groupName)}> Select group </button>
                        <button type="button" className="button" onClick={() => onAddGroup(groupName)}> Add group </button>
                      </>
                    ) : (
                      <>
                        <input type="text" {...register(key as keyof EditOrderFormData)} value={groupName || ''} onChange={(e) => setGroupName(e.target.value)} />
                        <button type="button" className="button" onClick={() => onAddGroup(groupName)}> Add group </button>
                        <button type="button" className="button" onClick={() => onSelectGroup(groupName)}> Select group </button>
                      </>
                    )}
                  </div>
                ) : (
                  <input {...register(key as keyof EditOrderFormData)} />
                )}
              </>
            )}

            {/* Показати повідомлення про помилку валідації, якщо є */}
            {errors[key as keyof EditOrderFormData] && (
              <p className="error-message">{String(errors[key as keyof EditOrderFormData].message)}</p>
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
        <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))} className="form-modal">
          {renderFormFields()}
          <button type="submit">Save Changes</button>
        </form>

        <button onClick={onRequestClose}>Close Modal</button>

        <ToastContainer />
      </Modal>
    </div>
  );
};

export { EditOrderModal };


