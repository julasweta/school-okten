import { useEffect, useState } from "react";
import { IUser } from "../../interfaces";
import { Link } from "react-router-dom";
import { userService } from "../../services/UsersServices";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { usersActions } from "../../redux/slices/UserSlices";
import { RootState } from "../../redux/store";

interface UserProps {
  user: IUser;
}

const UserInfo: React.FC<UserProps> = ({ user }) => {

  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useAppDispatch();
  const { updateUserTriger } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(usersActions.getAllUsers());
  }, [updateUserTriger, dispatch]);

  const onBan = async(id:string) => {
    await userService.banUserById(id);
    dispatch(usersActions.setUpdateUserTriger())
  }

  return (
    <div className="user-info">
      {isOpen ? Object.entries(user).map(([key, value]) => (
        key === 'name' &&
        <div className="user pointer" key={key} onClick={()=> setIsOpen(false)}>
          <label>{key}:</label>
          <span>{value}</span>
        </div>
      )) : Object.entries(user).map(([key, value]) => (
        <div className="user">
          <div  key={key}>
            <label>{key}:</label>
            <span>{value}</span>
          </div>
        </div>
      ))}
      <div className="user-buttons">
        {!isOpen &&
          <button className="button" onClick={() => setIsOpen(true)}>Close</button>}
        {user.token && <Link to={`http://localhost:3001/auth/activate?token=${user.token}`} className="button" >Activate</Link>}
        {user.status === 'activate' && <button className="button" >Recovery Password</button>}
        {(user.status === 'activate' && user.role !== 'admin') && <button className="button" onClick={() => onBan(user._id)}>BAN</button>}
        {(user.status === 'ban' && user.role !== 'admin')  && <button className="button" onClick={() => onBan(user._id)}>UNBAN</button>}
      </div>
    </div>
  );
};

export { UserInfo }