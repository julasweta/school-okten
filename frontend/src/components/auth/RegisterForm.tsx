import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { IReg } from "../../interfaces/IRegister";
import { authActions } from "../../redux/slices/AuthSlice";
import { RootState } from "../../redux/store";

const RegisterForm = () => {
  const { register, handleSubmit } = useForm<IReg>();
  const { activePage } = useAppSelector((state: RootState) => state.orders);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registerUser: SubmitHandler<IReg> = async (user) => {
    const {
      meta: { requestStatus },
    } = await dispatch(authActions.register({ user }));
    if (requestStatus === "fulfilled") {
      activePage
        ? navigate(`/orders?${activePage}`)
        : navigate(`/orders?page=1`);
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
      </form>
    </div>
  );
};

export { RegisterForm };
