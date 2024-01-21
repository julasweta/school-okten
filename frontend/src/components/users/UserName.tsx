import React, { useEffect, useMemo, useState } from "react";

import { useAppDispatch } from "../../hooks/hooks";
import { IUser } from "../../interfaces";
import { usersActions } from "../../redux/slices/UserSlices";

interface UserNameProps {
  id: string;
}

const UserName: React.FC<UserNameProps> = ({ id }) => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();

  const memoizedName = useMemo(() => name, [name]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (id) {
          const resultAction = await dispatch(usersActions.getUserById(id));
          if (usersActions.getUserById.fulfilled.match(resultAction)) {
            const user: IUser = resultAction.payload;
            setName(user.name);
          }
        } else {
          setName("");
        }
      } catch (error) {
        // Обробка помилок, якщо потрібно
        console.error("Error fetching user:", error);
      }
    };

    fetchUserName();
  }, [dispatch, id]);

  return <>{memoizedName}</>;
};

export { UserName };
