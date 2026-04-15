import React, { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import TicketService from '../services/TicketService';

/* ════════════════════════════════════
   TicketList – browseable, filterable ticket grid
   props:
     onSelect(ticket)   – navigate to detail
     onRefreshTrigger   – counter that re-triggers fetch
════════════════════════════════════ */

/* Seed demo tickets so the app works without a backend */
const DEMO_TICKETS = [
  {
    id: 1, title: 'AC not working in Lab 4',
    description: 'The air conditioning unit in Engineering Lab 4 has been non-functional since Monday.',
    location: 'Engineering Lab 4', category: 'HVAC', priority: 'HIGH', status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reportedBy: { name: 'Ali Hassan', role: 'USER' }, comments: [], attachmentUrls: [],
  },
  {
    id: 2, title: 'Projector bulb burnt out',
    description: 'The projector in Auditorium B has a blown bulb, making it unusable for lectures.',
    location: 'Auditorium B', category: 'IT_EQUIPMENT', priority: 'MEDIUM', status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    reportedBy: { name: 'Sara Malik', role: 'USER' }, comments: [], attachmentUrls: [],
    assignedTechnician: 'Imran Tech',
  },
  {
    id: 3, title: 'Water leak near canteen sink',
    description: 'A slow leak under the kitchen sink has caused water to pool on the floor.',
    location: 'Main Canteen', category: 'PLUMBING', priority: 'HIGH', status: 'RESOLVED',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    reportedBy: { name: 'Bilal Ahmed', role: 'USER' }, comments: [], attachmentUrls: [],
    assignedTechnician: 'Usman Plumber', resolutionNotes: 'Washer replaced, pipe re-sealed.',
  },
  {
    id: 4, title: 'Broken door lock – Room 201',
    description: 'The electronic lock on Room 201 is malfunctioning and fails to unlock with valid cards.',
    location: 'Room 201', category: 'STRUCTURAL', priority: 'MEDIUM', status: 'OPEN',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    reportedBy: { name: 'Hira Baig', role: 'USER' }, comments: [], attachmentUrls: [],
  },
  {
    id: 5, title: 'Power socket sparking in Library',
    description: 'A wall socket near reading table 5 in the Central Library sparked when a laptop was plugged in.',
    location: 'Central Library', category: 'ELECTRICAL', priority: 'HIGH', status: 'CLOSED',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    reportedBy: { name: 'Farhan Qureshi', role: 'USER' }, comments: [], attachmentUrls: [],
    resolutionNotes: 'Socket replaced by maintenance. Area declared safe.',
  },
];

const STATUS_OPTIONS   = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
const PRIORITY_OPTIONS = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];
const CATEGORY_OPTIONS = ['ALL', 'ELECTRICAL', 'PLUMBING', 'IT_EQUIPMENT', 'HVAC', 'STRUCTURAL', 'SAFETY', 'OTHER'];

function TicketList({ onSelect, onRefreshTrigger }) {
  const [tickets, setTickets] = useState(DEMO_TICKETS);
  const [loading, setLoading] = useState(false);

  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [category, setCategory] = useState('ALL');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await TicketService.getAllTickets();
        if (res.data && res.data.length > 0) setTickets(res.data);
      } catch {
        // Use demo data when backend is offline
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [onRefreshTrigger]);

  /* Filter logic */
  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q);
    const matchStatus   = status   === 'ALL' || t.status   === status;
    const matchPriority = priority === 'ALL' || t.priority === priority;
    const matchCategory = category === 'ALL' || t.category === category;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  /* Stats */
  const countBy = (key, val) => tickets.filter(t => t[key] === val).length;

  const stats = [
    { label: 'Total',       value: tickets.length,              icon: '🎫', bg: '#eff6ff', color: '#3b82f6' },
    { label: 'Open',        value: countBy('status','OPEN'),    icon: '🔵', bg: '#eff6ff', color: '#3b82f6' },
    { label: 'In Progress', value: countBy('status','IN_PROGRESS'), icon: '🟡', bg: '#fffbeb', color: '#f59e0b' },
    { label: 'Resolved',    value: countBy('status','RESOLVED'), icon: '🟢', bg: '#ecfdf5', color: '#10b981' },
    { label: 'High Priority',value: countBy('priority','HIGH'), icon: '🔴', bg: '#fef2f2', color: '#ef4444' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="stats-row">
        {stats.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <h3 style={{ color: s.color }}>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search tickets…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={status}   onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace('_',' ')}</option>)}
        </select>
        <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p === 'ALL' ? 'All Priorities' : p}</option>)}
        </select>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c.replace('_',' ')}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎫</div>
          <h3>No tickets found</h3>
          <p>Try adjusting your filters or create a new ticket to get started.</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {filtered.map(t => (
            <TicketCard key={t.id} ticket={t} onClick={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
