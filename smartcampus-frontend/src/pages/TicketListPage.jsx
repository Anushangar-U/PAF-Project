import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TicketCard from '../components/tickets/TicketCard';
import ticketService from '../services/TicketService';
import { DEMO_TICKETS } from '../utils/constants';
import './TicketListPage.css';

const STATUS_OPTIONS   = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIORITY_OPTIONS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
const CATEGORY_OPTIONS = [
  'ALL', 'ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT',
  'HVAC', 'STRUCTURAL', 'SAFETY', 'OTHER',
];

/**
 * TicketListPage
 * Props:
 *   onSelect(ticket)     – navigate to detail view
 *   refreshKey           – changing this triggers a re-fetch
 */
function TicketListPage({ onSelect, refreshKey }) {
  const [tickets,  setTickets]  = useState(DEMO_TICKETS);
  const [loading,  setLoading]  = useState(false);
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [category, setCategory] = useState('ALL');

  /* ── Fetch from backend ── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await ticketService.getAllTickets();
        if (res.data?.length > 0) setTickets(res.data);
      } catch {
        /* keep demo data */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  /* ── Filter ── */
  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase();
    return (
      (!q ||
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q)) &&
      (status   === 'ALL' || t.status   === status) &&
      (priority === 'ALL' || t.priority === priority) &&
      (category === 'ALL' || t.category === category)
    );
  });

  /* ── Stats ── */
  const count = (key, val) => tickets.filter((t) => t[key] === val).length;
  const stats = [
    { label: 'Total',        value: tickets.length,              icon: '🎫', bg: '#eff6ff', color: '#3b82f6' },
    { label: 'Open',         value: count('status','OPEN'),      icon: '🔵', bg: '#eff6ff', color: '#3b82f6' },
    { label: 'In Progress',  value: count('status','IN_PROGRESS'), icon: '🟡', bg: '#fffbeb', color: '#f59e0b' },
    { label: 'Resolved',     value: count('status','RESOLVED'),  icon: '🟢', bg: '#ecfdf5', color: '#10b981' },
    { label: 'High Priority',value: count('priority','HIGH'),    icon: '🔴', bg: '#fef2f2', color: '#ef4444' },
  ];

  return (
    <Layout>
      <div className="ticket-list-page">
      {/* ── Stats row ── */}
      <div className="ticket-list-stats-row">
        {stats.map((s) => (
          <div className="ticket-list-stat-card" key={s.label}>
            <div className="ticket-list-stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className="ticket-list-stat-info">
              <h3 style={{ color: s.color }}>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter bar ── */}
      <div className="ticket-list-filter-bar">
        <div className="ticket-list-search-box">
          <span>🔍</span>
          <input
            id="ticket-search"
            type="text"
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          id="filter-status"
          className="ticket-list-filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All Statuses' : s.replace('_', ' ')}
            </option>
          ))}
        </select>
        <select
          id="filter-priority"
          className="ticket-list-filter-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p === 'ALL' ? 'All Priorities' : p}
            </option>
          ))}
        </select>
        <select
          id="filter-category"
          className="ticket-list-filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'All Categories' : c.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* ── Ticket list ── */}
      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="ticket-list-empty-state">
          <div className="ticket-list-empty-icon">🎫</div>
          <h3>No tickets found</h3>
          <p>Try adjusting your filters or create a new ticket to get started.</p>
        </div>
      ) : (
        <div className="ticket-list-grid">
          {filtered.map((t) => (
            <TicketCard key={t.id} ticket={t} onClick={onSelect} />
          ))}
        </div>
      )}
      </div>
    </Layout>
  );
}

export default TicketListPage;
