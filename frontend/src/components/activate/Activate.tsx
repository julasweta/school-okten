import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/hooks';
import { authService } from '../../services/authService';
import { ToastContainer, toast } from 'react-toastify';
import { AppRoutes } from '../../routing/AppRoutes';

interface FormData {
  password: string;
  token: string;
}

const Activate: React.FC = () => {
  const { register, handleSubmit, formState } = useForm<FormData>();
  const location = useLocation();
  const navigate = useNavigate();

  // Отримати токен з браузерного рядка
  const urlParams = new URLSearchParams(location.search);
  const tokenFromURL = urlParams.get('token') || '';

  const onSubmit = async (data: FormData) => {
    try {
      await authService.activateUser(data.password, tokenFromURL);
      navigate(AppRoutes.LOGIN);
    } catch (error) {
      toast.error('Error activating user:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder='password'
          {...register('password', { required: 'Password is required' })}
        />
        {formState.errors.password && <p>{formState.errors.password.message}</p>}
        <button type="submit">Submit</button>
      </div>
      <ToastContainer/>

    </form>
  );
};

export { Activate };
