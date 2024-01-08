import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { authActions } from "../../redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { IReg } from "../../interfaces/IRegister";

const RegisterForm = () => {
  const { register, handleSubmit } = useForm<IReg>();
  const { errors } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registerUser: SubmitHandler<IReg> = async (user) => {
    const {
      meta: { requestStatus },
    } = await dispatch(authActions.register({ user }));
    if (requestStatus === "fulfilled") {
      navigate("/orders");
    }
  };

  return (
    <div>
      RegiserForm
      <form onSubmit={handleSubmit(registerUser)}>
        <input type="text" placeholder={"email"} {...register("email")} />
        <input type="text" placeholder={"name"} {...register("login")} />
        <input type="text" placeholder={"surName"} {...register("surName")} />
        <input type="text" placeholder={"role"} {...register("role")} />
        <button>register</button>
        <p></p>
        {errors?.response.data.username ===
        "user model with this username already exists." ? (
          <p> Імя вже зареєстровано</p>
        ) : (
          ""
        )}
        {errors?.response.data.password ? (
          <p>{errors.response.data.password}</p>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export { RegisterForm };
