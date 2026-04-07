import React from 'react';
import './App.css';


import ResourceList from './components/ResourceList';
import BookingForm from './components/BookingForm';
import MyBookings from './components/MyBookings';

function App() {
  return (
    <div className="App">
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
