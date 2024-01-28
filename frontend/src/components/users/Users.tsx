import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../redux/store";
import { PaginUsers } from "../pagination/PaginUsers";
import { UserInfo } from "./UserInfo";
import { useLocation } from "react-router-dom";
import { usersActions } from "../../redux/slices";

const Users: React.FC = () => {

  const dispatch = useAppDispatch();
  const { users, usersFound, activePageUsers } = useAppSelector((state: RootState) => state.users);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchPage = searchParams.get("page");
  const searchLimit = searchParams.get("limit");
  const pageCount = Math.ceil(usersFound / +searchLimit);

  const [usersOnPage, setUsersOnPage] = useState([]);

  useEffect(() => {
    const start = +searchLimit * (+searchPage > 0 ? +searchPage - 1 : 0);
    const end = +searchLimit * (+searchPage < pageCount ? +searchPage : pageCount) - 1;
    const res =users &&  users.filter((item, index) => (index >= start && index <= end))
    setUsersOnPage(res);
  }, [searchLimit, searchPage, pageCount, users, usersFound]);

  useEffect(() => {
    dispatch(usersActions.setActivePageUsers(searchPage))
  }, [searchPage, dispatch]);

  return (
    <div className="user-box">
      <h2>Users</h2>
      {usersOnPage && usersOnPage.map((item, index) => (
        <UserInfo user={item} key={index} />
      ))}
      <PaginUsers />
    </div>
  );
};

export { Users };
