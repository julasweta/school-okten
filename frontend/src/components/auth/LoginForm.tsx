import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { IAuth } from "../../interfaces";
import { authActions } from "../../redux/slices/AuthSlice";
import { RootState } from "../../redux/store";

const LoginForm: React.FC = () => {
  const { register, reset, handleSubmit } = useForm<IAuth>();
  const { errors } = useAppSelector((state) => state.auth);
  const { activePage, searchValue, nameSearchRow } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getRefreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (getRefreshToken) {
      activePage
        ? navigate(
            `/orders?page=${activePage}${searchValue ? `&search=${searchValue}` : ""}`,
          )
        : navigate(
            `/orders?page=1${searchValue ? `&search=${searchValue}` : ""}`,
          );
    }
  }, [getRefreshToken, navigate, nameSearchRow, activePage, searchValue]);

  const login: SubmitHandler<IAuth> = async (user) => {
    try {
      const response = await dispatch(authActions.login({ user }));
      const requestStatus = response.meta.requestStatus;

      if (requestStatus === "fulfilled") {
        reset();
        activePage
          ? navigate(
              `/orders?page=${activePage}${searchValue && `&search=${searchValue}`}`,
            )
          : navigate(
              `/orders?page=1${searchValue && `&search=${searchValue}`}${nameSearchRow && `&nameSearchRow=${nameSearchRow}`}`,
            );
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const errorMessage = errors?.response?.data?.detail;

  return (
    <div className="login-page">
      <h2>LoginForm</h2>
      <form onSubmit={handleSubmit(login)} className="login-form">
        <input type="text" placeholder={"username"} {...register("email")} />
        <input type="text" placeholder={"password"} {...register("password")} />
        <button className="button login-btn">login</button>
        {errorMessage && <span>{errorMessage}</span>}
      </form>
    </div>
  );
};

export { LoginForm };
