import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import TicketService from '../services/TicketService';
import { useAuth } from '../context/AuthContext';

const MyTickets = ({ onSelect, onRefreshTrigger }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMyTickets = async () => {
      setLoading(true);
      try {
        const res = await TicketService.getAllTickets();
        if (res.data && res.data.length > 0) {
          // Filter tickets: USER sees their reported tickets, TECHNICIAN sees assigned tickets
          const filtered = res.data.filter(t => {
            if (currentUser.role === 'TECHNICIAN') {
              return t.assignedTechnician === currentUser.name;
            } else if (currentUser.role === 'USER') {
              return t.reportedBy && t.reportedBy.name === currentUser.name;
            } else if (currentUser.role === 'ADMIN') {
              return true; // Admin sees all
            }
            return false;
          });
          setTickets(filtered);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTickets();
  }, [onRefreshTrigger, currentUser]);

  return (
    <div>
      {loading ? (
        <div className="spinner" />
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎫</div>
          <h3>No tickets found</h3>
          <p>
            {currentUser.role === 'TECHNICIAN'
              ? 'No tickets assigned to you yet.'
              : currentUser.role === 'USER'
              ? 'No tickets reported by you yet.'
              : 'No tickets available.'}
          </p>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(t => (
            <TicketCard key={t.id} ticket={t} onClick={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
