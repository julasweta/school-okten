import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from './../routing/AppRoutes';

const Error404 = () => {
  const navigate = useNavigate();


  const handleButtonClick = () => {
    navigate(AppRoutes.ORDERS);
  };

  const currentUrl = window.location.href;
  console.log(currentUrl); // Повний URL браузера, наприклад, "http://example.com/page?name=John&age=25"


  return (
    <div>
      <h2>This page Not Found</h2>
      <button onClick={handleButtonClick}>Navigate</button>
    </div>
  );
};

export default Error404;