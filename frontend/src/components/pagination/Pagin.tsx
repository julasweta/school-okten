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
  const { itemsFound, activePage, searchQuery, sort, nameSortRow, limit } =
    useAppSelector((state: RootState) => state.orders);

  const pageCount = Math.ceil(itemsFound / limit);
  const buttonsToShow = 10; // скільки кнопок навколо поточної сторінки.


  const buttons: any = [];
  const startPage = Math.max(1, activePage - Math.floor(buttonsToShow / 2));
  const endPage = Math.min(pageCount, startPage + buttonsToShow - 1);

  const generateButtons = () => {

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
        limit: limit.toString(),
        order: sort,
        ...(nameSortRow && { nameSortRow }),
        ...(searchQuery.surname && { surname: searchQuery.surname }),
        ...(searchQuery.email && { email: searchQuery.email }),
        ...(searchQuery.age && { age: searchQuery.age }),
        ...(searchQuery.name && { name: searchQuery.name }),
        ...(searchQuery.phone && { phone: searchQuery.phone }),
        ...(searchQuery.course && { course: searchQuery.course }),
        ...(searchQuery.course_format && { course_format: searchQuery.course_format }),
        ...(searchQuery.course_type && { course_type: searchQuery.course_type }),
        ...(searchQuery.status && { status: searchQuery.status }),
        ...(searchQuery.groupName && { groupName: searchQuery.groupName }),
        ...(searchQuery.userId && { userId: searchQuery.userId }),
      });

      buttons.push(
        <Link to={`${AppRoutes.ORDERS}?${queryParams}`} key={i}>
          <button onClick={() => dispatch(ordersActions.setActivePage(i))}
          className={activePage === i ? "button active-btn" : "button"}>
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
        to={`${urls.orders.base}?page=${activePage > 1 ? activePage - 1 : 1}`}
      >
        <button onClick={onHead} className="button">
          forward
        </button>
      </Link>

      {generateButtons()}

      <Link
        to={`${urls.orders.base}?page=${activePage < pageCount ? activePage + 1 : pageCount}`}
      >
        <button onClick={onBack} className="button">
          back
        </button>
      </Link>
    </div>
  );
};

export { Pagin };

