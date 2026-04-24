import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const BASE = `${API_BASE_URL}/tickets`;

/**
 * ticketService.js
 * All REST calls that target the /api/tickets endpoint.
 */

/** GET  /api/tickets */
export const getAllTickets = () => axios.get(BASE);

/** GET  /api/tickets/{id} */
export const getTicketById = (id) => axios.get(`${BASE}/${id}`);

/**
 * POST /api/tickets
 * Sends multipart/form-data to support image attachments.
 * @param {FormData} formData
 */
export const createTicket = (formData) =>
  axios.post(BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * PATCH /api/tickets/{id}/status
 * @param {number} id
 * @param {{ status: string, resolutionNotes?: string, assignedTechnician?: string }} payload
 */
export const updateTicketStatus = (id, payload) =>
  axios.patch(`${BASE}/${id}/status`, payload);

/** DELETE /api/tickets/{id} */
export const deleteTicket = (id) => axios.delete(`${BASE}/${id}`);

/* ── named-export object (optional convenience) ── */
const ticketService = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  deleteTicket,
};

export default ticketService;
