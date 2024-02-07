import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "../components/header/Header";
import "./../App.css";
import { useAppSelector } from "../hooks/hooks";
import { AppRoutes } from "../routing/AppRoutes";

const MainLayout: FC = () => {
  const { me } = useAppSelector((state) => state.auth);
  const getRefreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (me && (!me || !getRefreshToken)) {
      navigate(AppRoutes.LOGIN);
    }
  }, [me, getRefreshToken, navigate]);

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export { MainLayout };
