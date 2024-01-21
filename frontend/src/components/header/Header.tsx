import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const token = searchParams.get('token');
    if (authService.getAccessToken() && !me) {
      dispatch(authActions.me());
    } if (token !== null) {
      navigate(`${AppRoutes.ACTIVATE}?token=${token}`);
    } if (!authService.getAccessToken()) { navigate(AppRoutes.LOGIN); }

  }, [dispatch, navigate, me]);


  const onLogout = async () => {
    await authService.logout();
    authActions.deleteMe();
    onCleanUtils()
    navigate('/auth/login');
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
