import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';

import ResourceList from './components/ResourceList';
import BookingForm from './components/BookingForm';
import MyBookings from './components/Bookings/MyBookings/MyBookings';

function App() {
  return (
    <div className="App">
      {/* We are rendering the new Dashboard matching the mock-up */}
      <Dashboard />
    </div>
  );
}

export default App;
