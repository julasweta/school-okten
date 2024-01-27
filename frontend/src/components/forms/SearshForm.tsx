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
  const { groups, isChecked, updateOrderTriger, searchValue, nameSearchRow } =
    useAppSelector((state: RootState) => state.orders);
  const { me } = useAppSelector((state: RootState) => state.auth);
  const { onCleanUtils } = useCleanrUtils();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchParam = searchParams.get("search");
  const nameSearchRowParam = searchParams.get("nameSearchRow");


  const schema = yup.object().shape({
    name: yup.string(),
    surname: yup.string(),
    email: yup.string(),
    phone: yup.string(),
    age: yup.string(),

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
    watch,
    clearErrors,
    formState: { errors }
  }: UseFormReturn<any> = useForm({
    resolver: yupResolver(schema),
    shouldUnregister: true,
    criteriaMode: "all",
  });

  let { isMe, ...updateValues }: any = getValues();

  useEffect(() => {
    Object.entries(updateValues).forEach(([key, item]) => {
      if (item) {
        dispatch(ordersActions.setIsChecked("off"));
        dispatch(ordersActions.setSearchValue(item && item !== 'select' ? item : searchParam));
        dispatch(ordersActions.setSearchNameRow(item && item !== 'select' ? key : nameSearchRowParam));
      }
    });

  }, [updateOrderTriger, searchValue, nameSearchRow, dispatch]);

  //при натисканні на button до кожної пошукової кнопки
  const onSearchButton = async (column: string) => {
    dispatch(ordersActions.setSearchValue(updateValues[column]));
    dispatch(ordersActions.setSearchNameRow(column));
  };

  const onSubmit = (data: any) => { console.log(data); };

  const onMeCheckboxChange = () => {
    dispatch(ordersActions.setUpdateOrderTriger());
    dispatch(ordersActions.setIsChecked(isChecked === "on" ? "off" : "on"));
    searchColumns.forEach((column) => {
      if (column !== "isMe") {
        setValue("isMe", "");
      }
    });
    if (isChecked === "off") {
      if (me && me._id) {
        searchColumns.forEach((column) => {
          if (column !== "isMe") {
            clearErrors()
            setValue(column, "");
          }
        });
        dispatch(ordersActions.setSearchValue(me._id));
        dispatch(ordersActions.setSearchNameRow("userId"));
      }
    } else {
      dispatch(ordersActions.setSearchValue(""));
      dispatch(ordersActions.setSearchNameRow(""));
    }
  };

  const onClean = () => {
    onCleanUtils();
    clearErrors();
    if (isChecked === "on") {
      dispatch(ordersActions.setIsChecked("off"));
    }
    searchColumns.map((column: string) => {
      setValue(column, "");
    });
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
            value={watch(column) || ""}
            onChange={(e) => {
              setValue(column, e.target.value);
              const selectedValue = e.target.value;
              if (selectedValue == 'select') {
                onClean();
              }
              dispatch(ordersActions.setUpdateOrderTriger());
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  clearErrors(otherColumn);
                  setValue(otherColumn, "");
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
            value={watch(column) || ""}
            onChange={(e) => {
              setValue(column, e.target.value);
              const selectedValue = e.target.value;
              if (selectedValue == 'select') {
                onClean();
              }
              dispatch(ordersActions.setUpdateOrderTriger());
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  clearErrors(otherColumn);
                  setValue(otherColumn, "");
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
        ) : (column !== 'isMe' &&
          <input
            type="text"
            placeholder={column}
            {...register(column)}
            id={column}
            className="search-input"
              value={updateValues[column] || ""}
            onChange={(e) => {
              setValue(column, e.target.value, { shouldValidate: true });

              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, '', { shouldValidate: true });
                  clearErrors(otherColumn);
                }
              });
              const beforeValue = getValues(column);
              setTimeout(() => {
                const afterValue = getValues(column);
                if ((Object.keys(errors).length < 1) && beforeValue !== afterValue) {
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
          <div key={index} className="red">{error.message}</div>
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
