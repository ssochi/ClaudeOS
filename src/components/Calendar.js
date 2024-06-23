// Calendar.js
import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

const CalendarApp = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';

    return (
      <div className="flex justify-between items-center p-4">
        <button onClick={prevMonth}>
          <span className="text-gray-600">‹</span>
        </button>
        <div className="text-lg font-semibold">
          {format(currentMonth, dateFormat)}
        </div>
        <button onClick={nextMonth}>
          <span className="text-gray-600">›</span>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = 'E';
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-gray-500" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        days.push(
          <div
            className={`p-2 text-center cursor-pointer ${!isSameMonth(day, monthStart)
              ? 'text-gray-400'
              : isSameDay(day, selectedDate)
              ? 'bg-blue-500 text-white rounded-full'
              : 'text-gray-800'
              }`}
            key={day}
            onClick={() => onDateClick(cloneDay)}
          >
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="">{rows}</div>;
  };

  const onDateClick = (day) => {
    setSelectedDate(day);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 font-sans">
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow overflow-hidden">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
};

export default CalendarApp;
