import React from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ selected, onChange, className = "" }: any) => {
  const years = range(1900, new Date().getFullYear() + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const defaultClassName =
    "w-[27em] cursor-pointer rounded-lg border-[1px] px-2 py-[14px] text-sm font-medium placeholder-black focus:outline-none dark:bg-inherit dark:text-white dark:placeholder:text-white";
  const combinedClassName = `${defaultClassName} ${className}`.trim();

  return (
    <div className="date-picker-container mt-3">
      <div className="relative flex w-full items-center justify-between">
        <DatePicker
          id="date-picker"
          selected={selected}
          onChange={onChange}
          dateFormat="yyyy/MM/dd"
          placeholderText="YYYY/MM/DD"
          popperPlacement="bottom-end"
          popperClassName="date-picker-popper"
          showPopperArrow={false}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={120}
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-2 py-2">
              <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
              >
                {"<"}
              </button>
              <select
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={months[date.getMonth()]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
              >
                {">"}
              </button>
            </div>
          )}
          customInput={
            <input
              placeholder="DD/MM/YYYY"
              value={selected ? selected.toLocaleDateString("en-GB") : ""}
              required
              className={combinedClassName}
            />
          }
        />
        {!selected && (
          <div className="flex items-center justify-end">
            <FaCalendarAlt className="absolute ml-auto mr-[1em] cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};

function range(start: number, end: number, step: number): number[] {
  return Array.from(
    { length: (end - start) / step + 1 },
    (_, i) => start + i * step
  );
}

export default CustomDatePicker;
