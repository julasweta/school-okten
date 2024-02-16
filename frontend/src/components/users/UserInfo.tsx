import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { IUser, Order, StatusWork } from "../../interfaces";
import { usersActions } from "../../redux/slices/UserSlices";
import { RootState } from "../../redux/store";
import { authService,  userService } from "../../services";

interface UserProps {
  user: IUser;
}

const UserInfo: React.FC<UserProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useAppDispatch();
  const { updateUserTriger, activePageUsers } = useAppSelector(
    (state: RootState) => state.users,
  );
  const { orders } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    dispatch(usersActions.getAllUsers());
  }, [updateUserTriger, dispatch]);

  const getMyOrders = async () => {
    const resFilter =
      (orders &&
        user._id) &&
      orders.filter((item) => item.user._id && item.user._id.toString() === user._id);
    setMyOrders(resFilter || []);
  };

  useEffect(() => {
    getMyOrders();
  }, [user._id, orders, activePageUsers]);

  const StatusCount = (status: StatusWork) => {
    const res = myOrders && myOrders.filter((item) => item.status === status);
    return res;
  };

  const onBanUnBan = async (id: string, status: string) => {
    const resStatus = () => {
      if (status === "ban") {
        return "activate";
      } else {
        return "ban";
      }
    };
    await userService.banUserById(id, resStatus());
    dispatch(usersActions.setUpdateUserTriger());
  };

  const onRecovery = async (email: string) => {
    await authService.recoveryPassword(email);
    dispatch(usersActions.setUpdateUserTriger());
  };

  return (
    <div
      className="user-info pointer"
      onClick={() => setIsOpen(!isOpen)}
      key={user._id}
    >
      {isOpen
        ? Object.entries(user).map(
          ([key, value]) =>
            key === "name" && (
              <div className="user" key={key}>
                <label className="capitOne">{key}: </label>
                <span className="capitOne">{value}</span>
              </div>
            ),
        )
        : Object.entries(user).map(([key, value]) => (
          <div className="user" key={key}>
            <div>
              <label
                className={key === "status" ? "capitOne green" : "capitOne"}
              >
                {key}:{" "}
              </label>
              <span
                className={
                  value === "activate"
                    ? "capitOne green"
                    : value === "ban"
                      ? "capitOne red"
                      : value === "inactive"
                        ? "capitOne blue"
                        : "capitOne"
                }
              >
                {value}
              </span>
            </div>
          </div>
        ))}
      <hr></hr>
      <div>
        {" "}
        <b>Orders Total: </b> {myOrders.length}
      </div>
      <div>
        {" "}
        <b>Orders InWork: </b> {StatusCount(StatusWork.InWork).length}
      </div>
      {StatusCount(StatusWork.Aggre).length ? (
        <div>
          <b>Orders {StatusWork.Aggre} </b> {StatusCount(StatusWork.Aggre).length}
        </div>
      ) : (
        ""
      )}
      {StatusCount(StatusWork.Disaggre).length ? (
        <div>
          <b>Orders {StatusWork.Disaggre} </b>{" "}
          {StatusCount(StatusWork.Disaggre).length}
        </div>
      ) : (
        ""
      )}
      {StatusCount(StatusWork.Dubbing).length ? (
        <div>
          <b>Orders {StatusWork.Dubbing} </b>{" "}
          {StatusCount(StatusWork.Dubbing).length}
        </div>
      ) : (
        ""
      )}
      {StatusCount(StatusWork.New).length ? (
        <div>
          <b>Orders {StatusWork.New} </b> {StatusCount(StatusWork.New).length}
        </div>
      ) : (
        ""
      )}
      <div className="user-buttons">
        {!isOpen && (
          <button className="button" onClick={() => setIsOpen(!isOpen)}>
            Close
          </button>
        )}
        {user.token && (
          <Link to={`/auth/activate?token=${user.token}`} className="button">
            Activate
          </Link>
        )}
        {user.status === "activate" && (
          <button className="button" onClick={() => onRecovery(user.email)}>
            Recovery Password
          </button>
        )}
        {user.status === "activate" && user.role !== "admin" && (
          <button
            className="button"
            onClick={() => onBanUnBan(user._id, user.status)}
          >
            BAN
          </button>
        )}
        {user.status === "ban" && user.role !== "admin" && (
          <button
            className="button"
            onClick={() => onBanUnBan(user._id, user.status)}
          >
            UNBAN
          </button>
        )}
      </div>
    </div>
  );
};

export { UserInfo };
