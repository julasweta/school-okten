import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { PaginUsers } from "../pagination/PaginUsers";
import { UserInfo } from "./UserInfo";
import { useLocation } from "react-router-dom";
import { usersActions } from "../../redux/slices";

const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, usersFound, activePageUsers, updateUserTriger  } = useAppSelector(
    (state: RootState) => state.users,
  );
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchPage = searchParams.get("page");
  const searchLimit = searchParams.get("limit");
  const pageCount = Math.ceil(usersFound / +searchLimit);

  useEffect(() => {
    dispatch(usersActions.getAllUsers({page: activePageUsers, limit:3}))
  }, [activePageUsers, dispatch, updateUserTriger]);

  useEffect(() => {
    dispatch(usersActions.setActivePageUsers(searchPage));
  }, [searchPage, dispatch]);


  return (
    <div className="user-box">
      <h2>Users</h2>
      {users &&
        users.map((item, index) => <UserInfo user={item} key={index} />)}
      <PaginUsers />
    </div>
  );
};

export { Users };
