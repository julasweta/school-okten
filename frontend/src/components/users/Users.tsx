import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { UserInfo } from "./UserInfo";


const Users: React.FC = () => {
  const { users } = useAppSelector((state: RootState) => state.users);
  
  return (
    <div className="user-box">
      <h2>Users</h2>
      { users.map((item, index )=> <UserInfo user={ item} key ={index} />)}

    </div>
  );
};

export { Users }