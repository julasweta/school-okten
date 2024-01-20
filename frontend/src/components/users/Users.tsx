import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { UserInfo } from "./UserInfo";


const Users: React.FC = () => {
  const { users } = useAppSelector((state: RootState) => state.users);
  
  return (
    <div className="user-box">
      <h2>Users</h2>
      { users.map(item => <UserInfo user={ item} />)}

    </div>
  );
};

export { Users }