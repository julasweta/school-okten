import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { IAuth } from "../../interfaces";
import { authActions } from "../../redux/slices/AuthSlice";
import { RootState } from "../../redux/store";
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const LoginForm: React.FC = () => {
  const schema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required(),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuth>({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    criteriaMode: "all",
  });

  const { activePage, searchValue, nameSearchRow } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const { me, error } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const getRefreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (getRefreshToken && me && me) {
      navigate(`/orders`);
    }
  }, [getRefreshToken, navigate, nameSearchRow, activePage, searchValue]);

  const login: SubmitHandler<IAuth> = async (user) => {
    try {
      const response = await dispatch(authActions.login({ user }));
      const requestStatus = response.meta.requestStatus;
      if (requestStatus === "fulfilled") {
        reset();
        navigate(`/orders`);
      }
      if (requestStatus === "rejected") {
        toast.error("Incorrect username or password.");
      }
    } catch (error) {
      console.error("Incorrect username or password.");
    }
  };

  return (
    <div className="login-page">
      <h2>LoginForm</h2>
      <form onSubmit={handleSubmit(login)} className="login-form">
        <input type="text" placeholder="Email" {...register("email")} />
        <span className="red">
          {errors?.email?.message && errors.email.message}
        </span>
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          autoComplete="on"
        />
        <span className="red">
          {errors?.password?.message && errors.password.message}
        </span>
        <button className="button login-btn" type="submit">
          Login
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export { LoginForm };
