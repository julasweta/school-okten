// OrderTable.tsx
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { urls } from "../../constants/urls";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { AppRoutes } from "../../routing/AppRoutes";

const Pagin: React.FC = () => {
  const dispatch = useAppDispatch();
  const { itemsFound, activePage, searchValue, nameSearchRow, sort } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const limit = 15;
  const pageCount = Math.ceil(itemsFound / limit);
  const buttonsToShow = 10; //  скільки кнопок  навколо поточної сторінки.


  const generateButtons = () => {
    const buttons = [];
    const startPage = Math.max(1, activePage - Math.floor(buttonsToShow / 2));
    const endPage = Math.min(pageCount, startPage + buttonsToShow - 1);

    if (startPage > 1) {
      const onEllipsisBefore = () => {
        dispatch(ordersActions.setActivePage(activePage - 10));
      };

      buttons.push(
        <button
          key="ellipsis-before"
          className="button"
          disabled={false}
          onClick={onEllipsisBefore}
        >
          ...
        </button>,
      );
    }

  


    for (let i = startPage; i <= endPage; i++) {
      const queryParams = new URLSearchParams({
        page: i.toString(),
        limit: '15',
        nameSearchRow: searchValue && searchValue !== 'select' ? nameSearchRow : '',
        search: searchValue && searchValue !== 'select' ? searchValue : '',
        order: sort,
      });

      buttons.push(
        <Link
          to={`${AppRoutes.ORDERS}?${queryParams.toString()}`}
          key={i}
        >
          <button className={activePage === i ? "button active-btn" : "button"}>
            {i}
          </button>
        </Link>,
      );
    }

    if (endPage < pageCount) {
      const onEllipsisAfter = () => {
        dispatch(ordersActions.setActivePage(activePage + 10));
      };

      buttons.push(
        <button
          key="ellipsis-after"
          className="button"
          disabled={false}
          onClick={onEllipsisAfter}
        >
          ...
        </button>,
      );
    }

    return buttons;
  };

  const onHead = () => {
    if (activePage > 2) {
      dispatch(ordersActions.setActivePage(activePage - 1));
    }
  };

  const onBack = () => {
    if (activePage < pageCount) {
      dispatch(ordersActions.setActivePage(activePage + 1));
    }
  };

  return (
    <div>
      <Link
        to={`${urls.orders.base}?page=${activePage > 1 ? activePage - 1 : 1}${searchValue ? `&search=${searchValue}` : ""}${nameSearchRow ? `&nameSearchRow=${nameSearchRow}` : ""}`}
      >
        <button onClick={onHead} className="button">
          {" "}
          forward{" "}
        </button>
      </Link>

      {generateButtons()}

      <Link
        to={`${urls.orders.base}?page=${activePage < pageCount ? activePage + 1 : pageCount}${searchValue ? `&search=${searchValue}` : ""}${nameSearchRow ? `&nameSearchRow=${nameSearchRow}` : ""}`}
      >
        <button onClick={onBack} className="button">
          {" "}
          back{" "}
        </button>
      </Link>
    </div>
  );
};

export { Pagin };
