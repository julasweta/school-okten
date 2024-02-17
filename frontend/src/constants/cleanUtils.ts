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
    dispatch(ordersActions.setSort("ASC"));
    dispatch(ordersActions.setNameRowSort(""));
    dispatch(ordersActions.setIsChecked("off"));
    dispatch(ordersActions.setUpdateOrderTriger());
  };

  return {
    onCleanUtils,
  };
};

export default useCleanrUtils;
