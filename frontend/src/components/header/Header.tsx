import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { urls } from "../../constants/urls";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { authService } from "../../services/authService";

const Header = () => {
  const { me } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.getAccessToken() && !me) {
      dispatch(authActions.me());
    }
  }, []);

  const onLogout = () => {
    authService.logout();
    navigate(urls.auth.login);
  }

  return (
    <div className="header">
      {me !== null ? (
        <div>
          <div className="userGreeting">Welcome, {me.login}!</div>
          <button onClick={onLogout}>Logout</button>
        </div>
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
