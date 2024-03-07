import { useEffect } from "react";
import { UseFormReturn, useForm } from "react-hook-form";

import { searchColumns } from "../../constants";
import useCleanrUtils from "../../constants/cleanUtils";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Course, CourseFormat, CourseType, StatusWork } from "../../interfaces";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { RootState } from "../../redux/store";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation } from "react-router-dom";

const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { groups, isChecked, updateOrderTriger } = useAppSelector(
    (state: RootState) => state.orders,
  );
  const { me } = useAppSelector((state: RootState) => state.auth);
  const { onCleanUtils } = useCleanrUtils();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailParam = searchParams.get("email");
  const ageParam = searchParams.get("age");
  const surnameParam = searchParams.get("surname");
  const nameParam = searchParams.get("name");
  const phoneParam = searchParams.get("phone");
  const courseParam = searchParams.get("course");
  const course_typeParam = searchParams.get("course_type");
  const course_formatParam = searchParams.get("course_format");
  const groupNameParam = searchParams.get("groupName");
  const statusParam = searchParams.get("status");
  const userIdParam = searchParams.get("userId");

  const schema = yup.object().shape({
    name: yup.string(),
    surname: yup.string(),
    email: yup.string(),
    phone: yup.string(),
    age: yup.mixed().nullable().notRequired(),
    course: yup.string(),
    course_format: yup.string(),
    course_type: yup.string(),
    status: yup.string(),
    groupName: yup.string(),
    isMe: yup.string(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  }: UseFormReturn<any> = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    criteriaMode: "all",
  });

  let updateValues: any = getValues();

  useEffect(() => {
    setValue("email", emailParam);
    setValue("age", ageParam);
    setValue("name", nameParam);
    setValue("surname", surnameParam);
    setValue("phone", phoneParam);
    setValue("course", courseParam);
    setValue("course_type", course_typeParam);
    setValue("course_format", course_formatParam);
    setValue("status", statusParam);
    setValue("groupName", groupNameParam);
    setValue("userId", userIdParam);
    if (userIdParam) {
      dispatch(ordersActions.setIsChecked("on"));
    }
  }, [
    emailParam,
    ageParam,
    nameParam,
    surnameParam,
    phoneParam,
    courseParam,
    course_typeParam,
    course_formatParam,
    statusParam,
    groupNameParam,
    userIdParam,
    setValue,
    dispatch,
  ]);

  useEffect(() => {
    let updateValues: any = getValues();
    let res = {};
    Object.entries(updateValues).forEach(([key, item]: [string, any]) => {
      if (item !== null && item !== "") {
        res = { ...res, [key]: item };
      }
    });
    dispatch(ordersActions.setSearchQuery({ ...res }));
  }, [updateOrderTriger, getValues, dispatch]);

  const onSearchButton = async (column: string) => {};

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const onMeCheckboxChange = () => {
    const newIsChecked = isChecked === "on" ? "off" : "on";
    dispatch(ordersActions.setIsChecked(newIsChecked));
    if (newIsChecked === "off") {
      setValue("userId", "select");
      dispatch(ordersActions.setUpdateOrderTriger());
    } else {
      if (me && me._id) {
        setValue("userId", me._id);
        dispatch(ordersActions.setUpdateOrderTriger());
      }
    }
  };

  const onClean = () => {
    searchColumns.map((column: string) => {
      setValue(column, "");
    });
    setValue("userId", "");
    onCleanUtils();
    clearErrors();
  };

  const renderSearchButton = () => {
    return searchColumns.map((column, index) => (
      <div key={index} className="search-box">
        {getInputElement(column)}
        {[
          "course",
          "course_format",
          "course_type",
          "status",
          "groupName",
        ].includes(column) && (
          <button
            type="submit"
            onClick={() => onSearchButton(column)}
            className="button search-button"
          >
            {column}
          </button>
        )}
      </div>
    ));
  };

  const getInputElement = (column: string) => {
    const isDropdown = [
      "course",
      "course_format",
      "course_type",
      "status",
    ].includes(column);
    const isGroup = ["groupName"].includes(column);

    return (
      <>
        {isDropdown ? (
          <select
            {...register(column)}
            id={column}
            className="search-input"
            value={updateValues[column] || ""}
            onChange={(e) => {
              setValue(column, e.target.value);
              dispatch(ordersActions.setActivePage(1));
              dispatch(ordersActions.setUpdateOrderTriger());
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  clearErrors(otherColumn);
                }
              });
            }}
          >
            <option value="select">Select...</option>
            {Object.values(getEnumType(column)).map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        ) : isGroup ? (
          <select
            {...register(column)}
            id={column}
            className="search-input"
            value={updateValues[column] || ""}
            onChange={(e) => {
              setValue(column, e.target.value);
              dispatch(ordersActions.setActivePage(1));
              dispatch(ordersActions.setUpdateOrderTriger());
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  clearErrors(otherColumn);
                }
              });
            }}
          >
            <option value="select">Select...</option>
            {groups.map((group, index) => (
              <option key={index} value={group.title}>
                {group.title}
              </option>
            ))}
          </select>
        ) : (
          column !== "isMe" && (
            <input
              type="text"
              placeholder={column}
              {...register(column)}
              id={column}
              className="search-input"
              value={updateValues[column] || ""} // Використовуйте updateValues[column]
              onChange={(e) => {
                setValue(column, e.target.value, { shouldValidate: true });
                dispatch(ordersActions.setActivePage(1));
                searchColumns.forEach((otherColumn) => {
                  if (otherColumn !== column) {
                    clearErrors(otherColumn);
                  }
                });
                const beforeValue = getValues(column);
                setTimeout(() => {
                  const afterValue = getValues(column);
                  if (
                    Object.keys(errors).length < 1 &&
                    beforeValue !== afterValue
                  ) {
                    dispatch(ordersActions.setUpdateOrderTriger());
                  }
                }, 1500);
              }}
              onBlur={() => {
                if (Object.keys(errors).length < 1) {
                  dispatch(ordersActions.setUpdateOrderTriger());
                }
              }}
            />
          )
        )}
      </>
    );
  };

  const getEnumType = (column: string): Record<string, string> => {
    switch (column) {
      case "course":
        return Course;
      case "course_format":
        return CourseFormat;
      case "course_type":
        return CourseType;
      case "status":
        return StatusWork;
      default:
        return {};
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="search-form">
        {renderSearchButton()}
        <div className="check-box">
          <input
            type="checkbox"
            {...register("isMe")}
            checked={isChecked === "on"}
            onChange={() => onMeCheckboxChange()}
          />
          <label htmlFor="isMe" className="me-label">
            Me
          </label>
        </div>
      </form>

      <div>
        {Object.values(errors).map((error: any, index) => (
          <div key={index} className="red">
            {error.message}
          </div>
        ))}
      </div>

      <div className="search-box">
        <button className="button clean-button" onClick={() => onClean()}>
          Clean
        </button>
      </div>
    </div>
  );
};

export { SearchForm };
