import { useEffect } from "react";
import { Link } from "react-router-dom";
import { urls } from "../../constants/urls";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { authService } from "../../services/authService";

const Header = () => {
  const { me } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authService.getAccessToken() && !me) {
      dispatch(authActions.me());
    }
  }, []);

  return (
    <div className="header">
      {me !== null ? (
        <div className="userGreeting">Welcome, {me.login}!</div>
      ) : (
        <div className="login-btn">
          <Link to={urls.auth.login}>
            <button className="button">Login</button>
          </Link>
          <Link to={urls.auth.register}>
            <button className="button">Register</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export { Header };
