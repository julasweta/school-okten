import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { usersActions } from "../../redux/slices/UserSlices";
import { IUser } from "../../interfaces";

interface UserNameProps {
  id: string; // або використайте тип, який вам підходить
}

const UserName: React.FC<UserNameProps> = ({ id }) => {
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(usersActions.getUserById(id))
        .then((resultAction) => {
          // Перевірте, чи успішно викликано getUserById
          if (usersActions.getUserById.fulfilled.match(resultAction)) {
            const user: IUser = resultAction.payload;
            setName(user.name);
          }
        })
        .catch((error) => {
          // Обробка помилок, якщо потрібно
          console.error("Error fetching user:", error);
        });
    } else {
      setName('');
   }
  }, [dispatch, id]);

  return (
    <>
     {name}
    </>
  );
};

export { UserName };
