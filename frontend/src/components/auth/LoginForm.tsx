import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { IAuth } from "../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";
import { RootState } from '../../redux/store';

const LoginForm: React.FC = () => {
  const { register, reset, handleSubmit } = useForm<IAuth>();
  const { errors } = useAppSelector((state) => state.auth);
  const { activePage } = useAppSelector((state: RootState) => state.orders);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getRefreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (getRefreshToken) {
      activePage ?
        navigate(`/orders?page=${activePage}`) : navigate(`/orders?page=1`);
    }
  }, [getRefreshToken, navigate, activePage]);

  const login: SubmitHandler<IAuth> = async (user) => {
    try {
      const response = await dispatch(authActions.login({ user }));
      const requestStatus = response.meta.requestStatus;

      if (requestStatus === "fulfilled") {
        reset();
        activePage ?
          navigate(`/orders?page=${activePage}`): navigate(`/orders?page=1`);
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
