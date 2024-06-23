import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Import icons from Lucide React
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const CalendarApp = ({ onClose }) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const [events, setEvents] = useState([
    {
      start: moment().toDate(),
      end: moment().add(1, 'hours').toDate(),
      title: 'Sample Event',
    },
  ]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event name');
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  const handleSelectEvent = (event) => {
    window.alert(event.title);
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDate(moment(date).subtract(1, view).toDate())}
            className="p-1 rounded hover:bg-gray-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setDate(moment(date).add(1, view).toDate())}
            className="p-1 rounded hover:bg-gray-200"
          >
            <ChevronRight size={20} />
          </button>
          <h2 className="text-xl font-semibold">
            {moment(date).format('MMMM YYYY')}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={view} 
            onChange={(e) => setView(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="day">Day</option>
          </select>
          <button 
            onClick={() => setDate(new Date())} 
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Today
          </button>
          <button className="p-1 rounded hover:bg-gray-200">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-grow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default CalendarApp;