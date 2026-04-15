import React, { useState, useEffect } from 'react';
import TicketService from '../services/TicketService';
import ResourceService from '../services/ResourceService';

const Overview = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    totalResources: 0,
    availableResources: 0,
    criticalTickets: 0,
    warningTickets: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const ticketsRes = await TicketService.getAllTickets();
        const resourcesRes = await ResourceService.getAllResources();

        const tickets = ticketsRes.data || [];
        const resources = resourcesRes.data || [];

        setStats({
          totalTickets: tickets.length,
          openTickets: tickets.filter(t => t.status === 'OPEN').length,
          inProgressTickets: tickets.filter(t => t.status === 'IN_PROGRESS').length,
          resolvedTickets: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
          totalResources: resources.length,
          availableResources: resources.filter(r => r.status === 'AVAILABLE').length,
          criticalTickets: tickets.filter(t => t.slaStatus === 'CRITICAL').length,
          warningTickets: tickets.filter(t => t.slaStatus === 'WARNING').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon, label, value, bgColor, textColor }) => (
    <div style={{
      padding: '20px',
      background: bgColor,
      borderRadius: '8px',
      textAlign: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ color: textColor, margin: '0 0 5px 0', fontSize: '24px', fontWeight: 'bold' }}>
        {value}
      </h3>
      <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{label}</p>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>📊 Campus Overview Dashboard</h2>
      {loading ? (
        <div className="spinner" />
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}>
            <StatCard
              icon="🎫"
              label="Total Tickets"
              value={stats.totalTickets}
              bgColor="#eff6ff"
              textColor="#3b82f6"
            />
            <StatCard
              icon="🔵"
              label="Open Tickets"
              value={stats.openTickets}
              bgColor="#eff6ff"
              textColor="#3b82f6"
            />
            <StatCard
              icon="🟡"
              label="In Progress"
              value={stats.inProgressTickets}
              bgColor="#fffbeb"
              textColor="#f59e0b"
            />
            <StatCard
              icon="🟢"
              label="Resolved/Closed"
              value={stats.resolvedTickets}
              bgColor="#ecfdf5"
              textColor="#10b981"
            />
            <StatCard
              icon="🏛️"
              label="Total Resources"
              value={stats.totalResources}
              bgColor="#f3e8ff"
              textColor="#8b5cf6"
            />
            <StatCard
              icon="🟢"
              label="Available Resources"
              value={stats.availableResources}
              bgColor="#ecfdf5"
              textColor="#10b981"
            />
            <StatCard
              icon="🔴"
              label="Critical Tickets"
              value={stats.criticalTickets}
              bgColor="#fef2f2"
              textColor="#ef4444"
            />
            <StatCard
              icon="🟡"
              label="Warning Tickets"
              value={stats.warningTickets}
              bgColor="#fffbeb"
              textColor="#f59e0b"
            />
          </div>

          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <h3>📈 System Status</h3>
            <p style={{ marginBottom: '10px' }}>
              <strong>Resource Utilization:</strong>{' '}
              {stats.totalResources > 0
                ? `${Math.round((stats.availableResources / stats.totalResources) * 100)}% Available`
                : 'No data'}
            </p>
            <p style={{ marginBottom: '10px' }}>
              <strong>Ticket Resolution Rate:</strong>{' '}
              {stats.totalTickets > 0
                ? `${Math.round((stats.resolvedTickets / stats.totalTickets) * 100)}% Resolved`
                : 'No data'}
            </p>
            <p style={{ marginBottom: '10px' }}>
              <strong>Active Workload:</strong>{' '}
              {stats.openTickets + stats.inProgressTickets} tickets pending action
            </p>
            <p style={{ marginBottom: '10px' }}>
              <strong>🔴 Critical SLA:</strong>{' '}
              {stats.criticalTickets > 0
                ? `${stats.criticalTickets} ticket(s) overdue`
                : 'None'}
            </p>
            <p>
              <strong>🟡 Warning SLA:</strong>{' '}
              {stats.warningTickets > 0
                ? `${stats.warningTickets} ticket(s) approaching deadline`
                : 'None'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;
