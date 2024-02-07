// OrderTable.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../routing/AppRoutes";
import { usersActions } from "../../redux/slices";

const PaginUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { usersFound, activePageUsers } = useAppSelector(
    (state: RootState) => state.users,
  );
  const limit = 3;
  const pageCount = Math.ceil(usersFound / limit);
  const buttonsToShow = 4; //  скільки кнопок  навколо поточної сторінки.

  const generateButtons = () => {
    const buttons = [];
    const startPage = Math.max(
      1,
      +activePageUsers - Math.floor(buttonsToShow / 2),
    );
    const endPage = Math.min(pageCount, startPage + buttonsToShow - 1);

    if (startPage > 1) {
      const onEllipsisBefore = () => {
        dispatch(usersActions.setActivePageUsers(+activePageUsers - 3));
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
      buttons.push(
        <Link
          to={`${AppRoutes.ADMIN}?page=${i}&limit=${limit}`}
          key={i}
          onClick={() => dispatch(usersActions.setActivePageUsers(i))}
        >
          <button
            className={
              activePageUsers && +activePageUsers === i
                ? "button active-btn"
                : "button"
            }
          >
            {i}
          </button>
        </Link>,
      );
    }

    if (endPage < pageCount) {
      const onEllipsisAfter = () => {
        dispatch(usersActions.setActivePageUsers(+activePageUsers + 3));
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
    if (activePageUsers > 2) {
      dispatch(usersActions.setActivePageUsers(+activePageUsers - 1));
    }
  };

  const onBack = () => {
    if (activePageUsers < pageCount) {
      dispatch(usersActions.setActivePageUsers(+activePageUsers + 1));
    }
  };

  return (
    <div>
      <Link
        to={`${AppRoutes.ADMIN}?page=${+activePageUsers > 1 ? +activePageUsers - 1 : 1}&limit=${limit}`}
      >
        <button onClick={onHead} className="button">
          {" "}
          Forward{" "}
        </button>
      </Link>

      {generateButtons()}

      <Link
        to={`${AppRoutes.ADMIN}?page=${+activePageUsers < pageCount ? +activePageUsers + 1 : pageCount}&limit=${limit}`}
      >
        <button onClick={onBack} className="button">
          {" "}
          back{" "}
        </button>
      </Link>
    </div>
  );
};

export { PaginUsers };
