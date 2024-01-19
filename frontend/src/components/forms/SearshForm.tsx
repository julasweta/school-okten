import { useForm, FormProvider } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { useEffect } from "react";
import { Course, CourseFormat, CourseType, StatusWork } from "../../interfaces";
import { searchColumns } from "../../constants/list.table";
import { RootState } from "../../redux/store";


const SearchForm: React.FC = () => {
  const { register, handleSubmit, getValues, setValue, watch } = useForm();
  const dispatch = useAppDispatch();
  const { groups, isChecked } = useAppSelector((state: RootState) => state.orders);
  const { me } = useAppSelector((state: RootState) => state.auth);

  const values = getValues();


  useEffect(() => {
    console.log('wtach', values);
    Object.entries(values).forEach(([key, item]) => {
      if (item) {
        dispatch(ordersActions.setSearchValue(item));
        dispatch(ordersActions.setSearchNameRow(key));
      }
    });
  }, [values, dispatch]);

  const onSearchButton = async (column: string) => {
    dispatch(ordersActions.setSearchValue(values[column]));
    dispatch(ordersActions.setSearchNameRow(column));
  };

  const onSubmit = () => { };

  const onMeCheckboxChange = () => {
    console.log(isChecked);
    dispatch(ordersActions.setIsChecked());

    if (!isChecked) {
      dispatch(ordersActions.setSearchValue( me && me._id ));
      dispatch(ordersActions.setSearchNameRow('userId'));
    } else {
      dispatch(ordersActions.setSearchValue(''));
      dispatch(ordersActions.setSearchNameRow(''));
    }
  };


  const onClean = () => {
    dispatch(ordersActions.setSearchValue({}));
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
            value={watch(column)}
            onChange={(e) => {
              setValue(column, e.target.value); // Встановити значення поточного поля
              // Очистити всі інші поля, крім поточного
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, ""); // Встановити значення інших полів на порожнє
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
            value={watch(column)}
            onChange={(e) => {
              setValue(column, e.target.value); // Встановити значення поточного поля
              // Очистити всі інші поля, крім поточного
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, ""); // Встановити значення інших полів на порожнє
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
            value={watch(column)}
            onChange={(e) => {
              setValue(column, e.target.value); // Встановити значення поточного поля
              // Очистити всі інші поля, крім поточного
              searchColumns.forEach((otherColumn) => {
                if (otherColumn !== column) {
                  setValue(otherColumn, ""); // Встановити значення інших полів на порожнє
                }
              });
            }}
          />
        )}
      </>
    );
  };

  const getEnumType = (column: string): Record<string, string> => {
    switch (column) {
      case 'course':
        return Course;
      case 'course_format':
        return CourseFormat;
      case 'course_type':
        return CourseType;
      case 'status':
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
          <input type="checkbox" {...register('isMe')} checked={isChecked} onChange={() => onMeCheckboxChange()} />
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













