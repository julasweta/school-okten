import { useForm, FormProvider } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { useEffect } from "react";
import { Course, CourseFormat, CourseType, StatusWork } from "../../interfaces";
import { searchColumns } from "../../constants/list.table";
import { RootState } from "../../redux/store";
import useCleanrUtils from "../../constants/cleanUtils";


const SearchForm: React.FC = () => {
  const { register, handleSubmit, getValues, setValue, watch } = useForm({ shouldUnregister: true, });
  const dispatch = useAppDispatch();
  const { groups, isChecked, updateOrderTriger, searchValue, nameSearchRow } = useAppSelector((state: RootState) => state.orders);
  const { me } = useAppSelector((state: RootState) => state.auth);
  const { onCleanUtils } = useCleanrUtils();
  let {isMe, ...updateValues} = getValues();



  useEffect(() => {

    Object.entries(updateValues).forEach(([key, item]) => {
      if (item) {
        dispatch(ordersActions.setIsChecked('off'));
        dispatch(ordersActions.setSearchValue(item));
        dispatch(ordersActions.setSearchNameRow(key));
        dispatch(ordersActions.setActivePage(1));
      }
    });

  }, [updateOrderTriger, updateValues, searchValue, nameSearchRow,  dispatch]);



  const onSearchButton = async (column: string) => {
    dispatch(ordersActions.setSearchValue(updateValues[column]));
    dispatch(ordersActions.setSearchNameRow(column));
  };

  const onSubmit = () => { };

  const onMeCheckboxChange =() => {
   dispatch(ordersActions.setUpdateOrderTriger());
    dispatch(ordersActions.setIsChecked(isChecked === 'on' ? 'off' : 'on'));
    searchColumns.forEach((column) => {
      if (column !== 'isMe') {
        setValue(column, '');
      }
    });
    if (isChecked === 'off') {
      if (me && me._id) {
        dispatch(ordersActions.setSearchValue(me._id));
        dispatch(ordersActions.setSearchNameRow('userId'));
      }
    } else {
      dispatch(ordersActions.setSearchValue(''));
      dispatch(ordersActions.setSearchNameRow(''));
    }
  };


  const onClean = () => {
    onCleanUtils();
    if (isChecked === 'on') {
      dispatch(ordersActions.setIsChecked('off'));
    }
    searchColumns.forEach((column) => {
      setValue(column, '');
    });
  };



  const renderSearchButton = () => {
    return searchColumns.map((column, index) => (
      <div key={index} className="search-box">
        {getInputElement(column)}
        {(['course', 'course_format', 'course_type', 'status', 'groupName'].includes(column) && (
          <button type="submit" onClick={() => onSearchButton(column)} className="button search-button">
            {column}
          </button>
        ))}
      </div>
    ));
  };


  const getInputElement = (column: string) => {
    const isDropdown = ['course', 'course_format', 'course_type', 'status'].includes(column);
    const isGroup = ['groupName'].includes(column);

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
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, "");
                }
              });
            }}
          >
            <option value="">Select...</option>
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
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, "");
                }
              });
            }}
          >
            <option value="">Select...</option>
            {groups.map((group, index) => (
              <option key={index} value={group.title}>
                {group.title}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder={column}
            {...register(column)}
            id={column}
            className="search-input"
                value={updateValues[column] || ""}
            onChange={(e) => {
              setValue(column, e.target.value);
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, "");
                }
              });
              dispatch(ordersActions.setUpdateOrderTriger())
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
            {...register('isMe')}
            checked={isChecked === 'on'}
            onChange={() => onMeCheckboxChange()}
          />
          <label htmlFor="isMe" className="me-label">
            Me
          </label>
        </div>
      </form>
      <div className="search-box">
        <button className="button clean-button" onClick={() => onClean()}>
          Clean
        </button>
      </div>
    </div>
  );
};


const SearchFormWrapper: React.FC = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <SearchForm />
    </FormProvider>
  );
};

export { SearchFormWrapper as SearchForm };













