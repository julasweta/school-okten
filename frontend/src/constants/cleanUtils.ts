import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ordersActions } from "../redux/slices/OrderSlices";

const useCleanrUtils = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCleanUtils = async () => {
    navigate(`/orders?page=1`);
    dispatch(
      ordersActions.setSearchQuery({
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
      })
    );
    dispatch(ordersActions.setActivePage(1));
    dispatch(ordersActions.setUpdateOrderTriger());
    dispatch(ordersActions.setSort("DESC"));
    dispatch(ordersActions.setNameRowSort(""));
    dispatch(ordersActions.setIsChecked("off"));

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
