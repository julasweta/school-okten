import { IUser } from "../../interfaces";

interface UserProps {
  user: IUser;
}

const User: React.FC<UserProps> = ({ user }) => {
  return (
    <div className="user-details">
      <h2>Created User Details</h2>
      {Object.entries(user).map(([key, value]) => (
        <div className="user-property" key={key}>
          <label>{key}:</label>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
};

export { User };
