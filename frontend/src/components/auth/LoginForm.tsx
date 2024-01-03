import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { IAuth } from "../../interfaces";
import { SubmitHandler, useForm } from "react-hook-form";

const LoginForm: React.FC = () => {
  const { register, reset, handleSubmit } = useForm<IAuth>();
  const { errors } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login: SubmitHandler<IAuth> = async (user) => {
    try {
      const response = await dispatch(authActions.login({ user }));
      const requestStatus = response.meta.requestStatus;

      if (requestStatus === "fulfilled") {
        reset();
        navigate("/orders");
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const errorMessage = errors?.response?.data?.detail;

  return (
    <div>
      LoginForm
      <form onSubmit={handleSubmit(login)}>
        <input type="text" placeholder={"username"} {...register("email")} />
        <input type="text" placeholder={"password"} {...register("password")} />
        <button className="button">login</button>
        {/* Render error message only if it exists */}
        {errorMessage && <span>{errorMessage}</span>}
      </form>
    </div>
  );
};

export { LoginForm };
