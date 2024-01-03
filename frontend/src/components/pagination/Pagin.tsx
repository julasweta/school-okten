// OrderTable.tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { urls } from "../../constants/urls";
import { ordersActions } from "../../redux/slices/OrderSlices";

const Pagin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { itemsFound, activePage } = useAppSelector((state: RootState) => state.orders);


  const generateButtons = () => {
    const buttons = [];
    for (let i = 1; i <= Math.floor(itemsFound / 25); i++) {
      buttons.push(<Link to={`${urls.orders.base}?page=${i}`} key={i}><button className={activePage === i? 'button active-btn':'button'} >{i}</button></Link>);

    }
    return buttons;
  };

  const onHead = () => {
    if (activePage > 1) {
      dispatch(ordersActions.setActivePage(activePage - 1))
    }
    else {
      dispatch(ordersActions.setActivePage(1))
    }
  }

  const onBack = () => {
    if (activePage < Math.floor(itemsFound / 25)) {
      dispatch(ordersActions.setActivePage(activePage + 1))
    }
    else {
      dispatch(ordersActions.setActivePage(activePage))
    }
  }

console.log(activePage);

  return (
    <div>
      <Link to={`${urls.orders.base}?page=${activePage > 1 ?( activePage - 1):1}`}><button onClick={onHead}> forward </button></Link>
      {generateButtons()}
      <Link to={`${urls.orders.base}?page=${activePage < Math.floor(itemsFound / 25) ? (activePage + 1) : Math.floor(itemsFound / 25)}`}><button onClick={onBack}> back </button></Link>

    </div>
  );
};

export { Pagin };
