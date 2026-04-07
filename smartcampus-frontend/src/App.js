import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';


import ResourceList from './components/ResourceList';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';

function App() {
  return (
    <div className="App">
      {/* We are rendering the new Dashboard matching the mock-up */}
      <Dashboard />
      <h2>Book a Resource</h2>
      <BookingForm />
      <hr style={{margin: '2rem 0'}} />
      <ResourceList />
      <hr style={{margin: '2rem 0'}} />
      <MyBookings />
    </div>
  );
}

export default App;
