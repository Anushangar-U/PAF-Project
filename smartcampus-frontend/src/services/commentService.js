import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const BASE = `${API_BASE_URL}/comments`;

/**
 * commentService.js
 * All REST calls that target the /api/comments endpoint.
 */

/** GET  /api/comments/ticket/{ticketId} */
export const getCommentsByTicket = (ticketId) =>
  axios.get(`${BASE}/ticket/${ticketId}`);

/**
 * POST /api/comments
 * @param {{ ticketId, authorName, authorRole, content }} payload
 */
export const addComment = (payload) => axios.post(BASE, payload);

/** DELETE /api/comments/{id} */
export const deleteComment = (id) => axios.delete(`${BASE}/${id}`);

/* ── named-export object ── */
const commentService = {
  getCommentsByTicket,
  addComment,
  deleteComment,
};

export default commentService;
