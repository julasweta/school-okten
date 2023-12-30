import React from "react";
import { FC,  } from "react";
import { Outlet, } from "react-router-dom";
import { Header } from "../components/header/Header";
import Home from "../components/home/Home";

const MainLayout: FC = () => {


  return (
    <>
      <Header />
      <Home />
      <Outlet />
    </>
  );
};

export { MainLayout };