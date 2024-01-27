import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useCleanrUtils from "../../constants/cleanUtils";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { AppRoutes } from "../../routing/AppRoutes";
import { authService } from "../../services/authService";

const Header = () => {
  const { me } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { onCleanUtils } = useCleanrUtils();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const getRefreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (authService.getAccessToken() && !me) {
      dispatch(authActions.me())
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // Оновлення токену не вдалося (401 Unauthorized)
            authService.logout(); // Видалення токенів
            authActions.deleteMe(); // Видалення даних про користувача
            onCleanUtils();
            localStorage.clear();
            navigate(AppRoutes.LOGIN, { replace: true }); // Перенаправлення на сторінку логіну
          }
        });
    }
  }, [dispatch, navigate, getRefreshToken, me]);

  const onLogout = async () => {
    await authService.logout();
    authActions.deleteMe();
    onCleanUtils();
    localStorage.clear();
    navigate(AppRoutes.LOGIN, { replace: true }); 
  };

  return (
    <>
      {getRefreshToken && me !== null ? (
        <header>
          <div className="header-box">
            <Link to={AppRoutes.HOME} className="logo" onClick={onCleanUtils}>
              HOME
            </Link>
            <div className="userGreeting">Welcome, {me.name.toUpperCase()}!</div>
            <Link to={AppRoutes.LOGIN} onClick={onLogout} className="button">
              Logout
            </Link>
            {me.role === "admin" && (
              <Link to={AppRoutes.ADMIN}>
                <button className="admin-button">Admin Panel</button>
              </Link>
            )}
          </div>
        </header>
      ) : (
        ""
      )}
    </>
  );

};

export { Header };
