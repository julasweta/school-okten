import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { urls } from "../../constants/urls";
import { authService } from "../../services/authService";
import { AppRoutes } from "../../routing/AppRoutes";

const Header = () => {
  const { me } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.getAccessToken() && !me) {
      dispatch(authActions.me());
    }
  }, [dispatch, me]);



  const onLogout = async () => {
    await authService.logout();
    authActions.deleteMe();
    navigate('auth/login');
  }

  return (
    <header>

      {me !== null ? (
        <div className="header-box">
          <Link to={AppRoutes.HOME} className="logo">HOME</Link>
          <div className="userGreeting">Welcome, {me.name.toUpperCase()}!</div>
          <button onClick={onLogout} className="button">Logout</button>
          {me.role === 'admin' && <Link to={AppRoutes.ADMIN}><button className="admin-button">Admin Panel</button></Link>}
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
    </header>

  );
};

export { Header };
