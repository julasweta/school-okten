import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ordersActions } from "../redux/slices/OrderSlices";

const useCleanrUtils = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCleanUtils = () => {
    navigate(`/orders?page=1`);
    dispatch(ordersActions.setSearchValue(""));
    dispatch(ordersActions.setSearchNameRow(""));
    dispatch(ordersActions.setActivePage(1));
    dispatch(ordersActions.setUpdateOrderTriger());
    dispatch(ordersActions.setSort('DESC'));

    // Якщо isChecked знаходиться в компоненті, передайте його значення або додайте його в аргументи функції
    // dispatch(ordersActions.setIsChecked());
    // searchColumns і setValue повинні також бути передані або доступні в контексті цієї функції
   // searchColumns.forEach((column) => {
     // setValue(column, watch(column) || "");
   // });
  };

  return {
    onCleanUtils,
  };
};

export default useCleanrUtils;
