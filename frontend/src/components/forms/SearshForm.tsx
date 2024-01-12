import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks/hooks";
import { ordersActions } from "../../redux/slices/OrderSlices";
import { columns } from "../../constants/list.table";
import { useState } from "react";
import { Course, CourseFormat, CourseType, StatusWork } from "../../interfaces";



const SearchForm: React.FC = () => {
  const { register, handleSubmit, reset, getValues } = useForm();
  const dispatch = useAppDispatch();
  const [lastInputValues, setLastInputValues] = useState<{ [key: string]: string }>({});



  const onSearchButton = (column: string) => {
    const watchValue = getValues(column) || '';
    const encodedValue = encodeURIComponent(watchValue.trim());
    dispatch(ordersActions.setSearchValue(encodedValue));
    dispatch(ordersActions.setSearchNameRow(column));
    // setLastInputValues((prevValues) => ({ ...prevValues, [column]: watchValue }));

  };


  const onClean = () => {
   dispatch(ordersActions.setSearchValue(''));
setLastInputValues({});
  };



  const renderSearchButton = () => {
    return columns.map((column, index) => (
      <div key={index} className="search-box">
        {getInputElement(column)}
        <button type="submit" onClick={() => onSearchButton(column)} className="button search-button">
          {column}
        </button>
      </div>
    ));

    function getInputElement(column: string) {
      if (column === 'course' || column === 'course_format' || column === 'course_type' || column === 'status') {
        return (
          <>
            {/*  <label htmlFor={column}>{column}</label> */}
            <select
              {...register(column)}
              id={column}
              className="search-input"
              value={lastInputValues[column] || ''}
              onChange={(e) => setLastInputValues((prevValues) => ({ ...prevValues, [column]: e.target.value }))}
            >
              <option value="">Select...</option>
              {Object.values(getEnumType(column)).map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          
          </>
        );
      } else {
        return (
          <>
            {/*  <label htmlFor={column}>{column}</label> */}
            <input
              type="text"
              placeholder="search"
              {...register(column)}
              id={column}
              className="search-input"
              value={lastInputValues[column] || ''}
              onChange={(e) => setLastInputValues((prevValues) => ({ ...prevValues, [column]: e.target.value }))}
            />
          </>
        );
      }
    }

    function getEnumType(column: string): Record<string, string> {
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
    }
  };



  return (
    <div>
      <form onSubmit={handleSubmit(onClean)} className="search-form">
        {renderSearchButton()}
        <div className="search-box"><button className="button clean-button" onClick={() => onClean()}>Clean</button></div>
      </form>
    </div>
  );
};

export { SearchForm };









