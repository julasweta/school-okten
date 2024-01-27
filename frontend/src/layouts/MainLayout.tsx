import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";
import "./../App.css";
import { useAppSelector } from "../hooks/hooks";

const MainLayout: FC = () => {
  const { me } = useAppSelector((state) => state.auth);
  const getRefreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
  }, [me, getRefreshToken]);


  return (
    <div>
      {(me || getRefreshToken) ? (
          <Header />
      ) : null}

      <Outlet />
    </div>
  );

};

export { MainLayout };
