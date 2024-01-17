import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { useState } from "react";
import { Course, CourseFormat, CourseType, StatusWork } from "../../interfaces";
import { searchColumns } from "../../constants/list.table";
import { RootState } from "../../redux/store";



const SearchForm: React.FC = () => {
  const { register, handleSubmit, getValues } = useForm();
  const dispatch = useAppDispatch();
  const [lastInputValues, setLastInputValues] = useState<{ [key: string]: string }>({});
  const { groups, isChecked } = useAppSelector((state: RootState) => state.orders);
  const { me } = useAppSelector((state: RootState) => state.auth);

  const values = Object.values(lastInputValues);
  const lastValue = values[values.length - 1];



  const onSearchButton = (column: string) => {
    setLastInputValues({});
    const watchValue = getValues(column);
    setLastInputValues((prevValues) => ({ ...prevValues, [column]: watchValue }));
    dispatch(ordersActions.setSearchValue(lastValue));
    dispatch(ordersActions.setSearchNameRow(column));
  };

  const onSubmit = () => { };

  const onMeCheckboxChange = () => {
    dispatch(ordersActions.setIsChecked())
    if (!isChecked) {
      //console.log('me id', me._id);
      dispatch(ordersActions.setSearchValue(me && me._id));
      dispatch(ordersActions.setSearchNameRow('userId'));
    } else {
      // Якщо галочка знята
      dispatch(ordersActions.setSearchValue(''));
      dispatch(ordersActions.setSearchNameRow(''));
    }
  };

  const onClean = () => {
    dispatch(ordersActions.setSearchValue(''));
    setLastInputValues({});
  };

  const renderSearchButton = () => {
    return searchColumns.map((column, index) => (
      <div key={index} className="search-box">
        {getInputElement(column)}
        <button type="submit" onClick={() => onSearchButton(column)} className="button search-button">
          {column}
        </button>
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
            value={lastValue === lastInputValues[column] ? lastValue : ''}
            onChange={(e) => setLastInputValues((prevValues) => ({ ...prevValues, [column]: e.target.value }))}
          >
            <option value="">Select...</option>
            {Object.values(getEnumType(column)).map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </select>
        ) : (
          isGroup ? (
            <select
              {...register(column)}
              id={column}
              className="search-input"
              value={lastValue === lastInputValues[column] ? lastValue : ''}
              onChange={(e) => setLastInputValues((prevValues) => ({ ...prevValues, [column]: e.target.value }))}
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
              placeholder="search"
              {...register(column)}
              id={column}
              className="search-input"
              value={lastValue === lastInputValues[column] ? lastValue : ''}
              onChange={(e) => setLastInputValues((prevValues) => ({ ...prevValues, [column]: e.target.value }))}
            />
          )
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
          <input
            type="checkbox"
            {...register('isMe')}
            checked={isChecked}
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

export { SearchForm };










