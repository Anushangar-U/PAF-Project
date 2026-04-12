import axios from 'axios';

const API_URL = 'http://localhost:9090/api/bookings';

// Create booking
export const createBooking = async (bookingData) => {
  return axios.post(API_URL, bookingData);
};

// Get all bookings
export const getAllBookings = async () => {
  return axios.get(API_URL);
};

// Get bookings by user ID
export const getBookingsByUserId = async (userId) => {
  return axios.get(`${API_URL}/user/${userId}`);
};

// Approve booking
export const approveBooking = async (id) => {
  return axios.put(`${API_URL}/${id}/approve`);
};

// Reject booking
export const rejectBooking = async (id, reason) => {
  return axios.put(`${API_URL}/${id}/reject`, { reason });
};

// Cancel booking
export const cancelBooking = async (id) => {
  return axios.patch(`${API_URL}/${id}/cancel`);
};