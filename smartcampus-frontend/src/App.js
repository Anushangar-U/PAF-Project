import React, { useMemo, useState } from 'react';
import './App.css';
import ResourceList from './components/ResourceList';
import Overview from './components/Overview';
import TicketListPage from './pages/TicketListPage';
import TicketDetailsPage from './pages/TicketDetailsPage';
import CreateTicketPage from './pages/CreateTicketPage';
import { useAuth } from './context/AuthContext';

const NAV_ITEMS = [
  {
    id: 'facilities',
    label: 'Facilities Catalogue',
    subtitle: 'Browse spaces and assets',
    icon: '🏢',
  },
  {
    id: 'tickets',
    label: 'Resource Management',
    subtitle: 'Track service requests',
    icon: '🧰',
  },
  {
    id: 'overview',
    label: 'Overview',
    subtitle: 'Campus intelligence',
    icon: '📈',
  },
];

const PAGE_META = {
  facilities: {
    title: 'Facilities Catalogue',
    caption: 'Browse smart campus buildings, labs, and shared spaces.',
  },
  tickets: {
    title: 'Resource Management',
    caption: 'Create, triage, and resolve infrastructure incidents.',
  },
  overview: {
    title: 'Operational Overview',
    caption: 'Monitor service health, utilization, and ticket pressure.',
  },
};

function App() {
  const { currentUser, switchUser, DEMO_USERS } = useAuth();

  const [activePage, setActivePage] = useState('facilities');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [ticketRefreshKey, setTicketRefreshKey] = useState(0);
  const [facilityCount, setFacilityCount] = useState(0);

  const handlePageChange = (nextPage) => {
    setActivePage(nextPage);
    setSelectedTicket(null);
    setShowCreateTicket(false);
  };

  const pageMeta = PAGE_META[activePage];

  const roleBadge = useMemo(
    () => (currentUser?.role ? currentUser.role.replace('_', ' ') : 'USER'),
    [currentUser]
  );

  const renderMainContent = () => {
    if (activePage === 'facilities') {
      return <ResourceList onCountChange={setFacilityCount} />;
    }

    if (activePage === 'overview') {
      return <Overview />;
    }

    if (selectedTicket) {
      return (
        <TicketDetailsPage
          ticket={selectedTicket}
          onBack={(deleted = false) => {
            setSelectedTicket(null);
            if (deleted) {
              setTicketRefreshKey((k) => k + 1);
            }
          }}
        />
      );
    }

    return (
      <TicketListPage
        onSelect={setSelectedTicket}
        refreshKey={ticketRefreshKey}
      />
    );
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">⌘</div>
          <div>
            <h1>CampusSmart</h1>
            <p>facility + resource core</p>
          </div>
        </div>

        <nav className="side-nav" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handlePageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.subtitle}</small>
              </span>
            </button>
          ))}
        </nav>

        <div className="side-footer">smart campus v1.0</div>
      </aside>

      <main className="main-view">
        <header className="topbar">
          <div>
            <h2>{pageMeta.title}</h2>
            <p>{pageMeta.caption}</p>
          </div>

          <div className="topbar-actions">
            {activePage === 'tickets' && !selectedTicket && (
              <button
                id="open-create-ticket-btn"
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCreateTicket(true)}
              >
                + New Incident
              </button>
            )}

            <div className="role-switcher">
              <label htmlFor="user-switch">User</label>
              <select
                id="user-switch"
                value={currentUser?.id ?? ''}
                onChange={(e) => switchUser(e.target.value)}
              >
                {DEMO_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
              <span className="role-badge">{roleBadge}</span>
            </div>

            <div className="counter-pill">
              <span>🏫</span>
              <strong>{facilityCount}</strong>
              <small>facilities</small>
            </div>
          </div>
        </header>

        <section className="view-panel">{renderMainContent()}</section>
      </main>

      {showCreateTicket && (
        <CreateTicketPage
          onClose={() => setShowCreateTicket(false)}
          onCreated={() => {
            setShowCreateTicket(false);
            setActivePage('tickets');
            setSelectedTicket(null);
            setTicketRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}

export default App;
