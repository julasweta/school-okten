import { FC, } from "react";
import { Outlet, } from "react-router-dom";
import { Header } from "../components/header/Header";
import './../App.css';

const MainLayout: FC = () => {


  return (
    <div className="main">
      <Header />
      <Outlet />
    </div>
  );
};

export { MainLayout };