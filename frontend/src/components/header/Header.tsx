import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { authService } from "../../services/authService";
import { AppRoutes } from "../../routing/AppRoutes";
import useCleanrUtils from "../../constants/cleanUtils";

const Header = () => {
  const { me } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { onCleanUtils } = useCleanrUtils();

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
          <Link to={AppRoutes.HOME} className="logo" onClick={onCleanUtils}>HOME</Link>
          <div className="userGreeting">Welcome, {me.name.toUpperCase()}!</div>
          <button onClick={onLogout} className="button">Logout</button>
          {me.role === 'admin' && <Link to={AppRoutes.ADMIN}><button className="admin-button">Admin Panel</button></Link>}
        </div>
      ) : ''}
    </header>

  );
};

export { Header };
