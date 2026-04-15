package com.smartcampus.backend.entity;

/**
 * TicketStatus – lifecycle states of a Ticket.
 * Valid transitions (enforced in TicketService):
 *   OPEN → IN_PROGRESS | REJECTED
 *   IN_PROGRESS → RESOLVED | OPEN
 *   RESOLVED → CLOSED | IN_PROGRESS
 *   CLOSED → (terminal)
 *   REJECTED → (terminal)
 */
public enum TicketStatus {
    OPEN,
    IN_PROGRESS,
    RESOLVED,
    CLOSED,
    REJECTED
}
