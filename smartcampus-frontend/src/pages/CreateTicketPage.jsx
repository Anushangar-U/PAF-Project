import React from 'react';
import Layout from '../components/Layout';
import TicketForm from '../components/tickets/TicketForm';

/**
 * CreateTicketPage
 * Thin wrapper that renders the TicketForm modal.
 * The actual form lives in components/tickets/TicketForm.jsx.
 *
 * Props:
 *   onClose()         – hide this page / close modal
 *   onCreated(ticket) – bubble up newly created ticket
 */
function CreateTicketPage({ onClose, onCreated }) {
  return (
    <Layout>
      <div className="ticket-create-page">
        <TicketForm
          onClose={onClose}
          onCreated={onCreated}
        />
      </div>
    </Layout>
  );
}

export default CreateTicketPage;
