import React, { useEffect, useMemo, useState } from 'react';
import ResourceService from '../services/ResourceService';

const DEMO_RESOURCES = [
  {
    id: 1,
    name: 'Central Library',
    type: 'LIBRARY',
    capacity: 450,
    location: 'Library Wing, Floor 1',
    status: 'AVAILABLE',
    availabilityWindows: '07:00-21:00',
  },
  {
    id: 2,
    name: 'Engineering Lab 4',
    type: 'LABORATORY',
    capacity: 35,
    location: 'Building A, Floor 4',
    status: 'AVAILABLE',
    availabilityWindows: '09:00-17:00',
  },
  {
    id: 3,
    name: 'Student Innovation Hub',
    type: 'COLLABORATION',
    capacity: 80,
    location: 'Block C, Ground Floor',
    status: 'LIMITED',
    availabilityWindows: '08:00-20:00',
  },
  {
    id: 4,
    name: 'Sports Complex',
    type: 'SPORTS',
    capacity: 1000,
    location: 'West Campus',
    status: 'AVAILABLE',
    availabilityWindows: '06:00-20:00',
  },
  {
    id: 5,
    name: 'Auditorium',
    type: 'AUDITORIUM',
    capacity: 500,
    location: 'Main Building',
    status: 'MAINTENANCE',
    availabilityWindows: '08:00-18:00',
  },
];

const TYPE_ICON = {
  LIBRARY: '📚',
  LABORATORY: '🧪',
  LAB: '🧪',
  AUDITORIUM: '🎤',
  CAFETERIA: '🍽️',
  CLASSROOM: '🏫',
  SPORTS: '🏟️',
  MEDICAL: '🩺',
  COLLABORATION: '💡',
};

const STATUS_META = {
  AVAILABLE: { label: 'Available', className: 'ok', icon: '●' },
  LIMITED: { label: 'Limited', className: 'warn', icon: '▲' },
  MAINTENANCE: { label: 'Maintenance', className: 'critical', icon: '■' },
};

function ResourceList({ onCountChange }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await ResourceService.getAllResources();
        if (response.data?.length > 0) {
          setResources(response.data);
        } else {
          setResources(DEMO_RESOURCES);
        }
      } catch {
        setResources(DEMO_RESOURCES);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    onCountChange?.(resources.length);
  }, [resources, onCountChange]);

  const types = useMemo(
    () => ['ALL', ...new Set(resources.map((r) => (r.type ?? '').toUpperCase()).filter(Boolean))],
    [resources]
  );

  const filteredResources = useMemo(() => {
    const q = query.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesText =
        !q ||
        resource.name?.toLowerCase().includes(q) ||
        resource.location?.toLowerCase().includes(q) ||
        resource.type?.toLowerCase().includes(q);
      const matchesType = type === 'ALL' || resource.type?.toUpperCase() === type;
      return matchesText && matchesType;
    });
  }, [resources, query, type]);

  const statusCount = useMemo(
    () => ({
      available: resources.filter((r) => r.status === 'AVAILABLE').length,
      limited: resources.filter((r) => r.status === 'LIMITED').length,
      maintenance: resources.filter((r) => r.status === 'MAINTENANCE').length,
    }),
    [resources]
  );

  if (loading) {
    return <div className="spinner" />;
  }

  return (
    <div className="facilities-layout">
      <div className="facilities-toolbar">
        <div className="search-box">
          <span>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, type, or location"
          />
        </div>
        <select className="filter-select" value={type} onChange={(e) => setType(e.target.value)}>
          {types.map((option) => (
            <option key={option} value={option}>
              {option === 'ALL' ? 'All Types' : option.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="stat-inline-row">
        <div className="mini-stat">
          <small>available</small>
          <strong>{statusCount.available}</strong>
        </div>
        <div className="mini-stat">
          <small>limited</small>
          <strong>{statusCount.limited}</strong>
        </div>
        <div className="mini-stat">
          <small>maintenance</small>
          <strong>{statusCount.maintenance}</strong>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <h3>No facilities matched your filters</h3>
          <p>Try changing your search keywords or selecting another type.</p>
        </div>
      ) : (
        <div className="facility-grid">
          {filteredResources.map((resource) => {
            const typeKey = resource.type?.toUpperCase();
            const status = STATUS_META[resource.status] ?? {
              label: resource.status ?? 'Unknown',
              className: 'warn',
              icon: '●',
            };

            return (
              <article className="facility-card" key={resource.id}>
                <div className="facility-hero">
                  <span>{TYPE_ICON[typeKey] ?? '🏢'}</span>
                </div>

                <div className="facility-body">
                  <h3>{resource.name}</h3>
                  <div className="facility-meta-row">
                    <span>🏷️ {resource.type?.replace('_', ' ') ?? 'General'}</span>
                    <span>👥 cap. {resource.capacity > 0 ? resource.capacity : 'N/A'}</span>
                  </div>
                  <div className="facility-meta-row">
                    <span>📍 {resource.location ?? 'No location'}</span>
                    <span>🕒 {resource.availabilityWindows ?? 'N/A'}</span>
                  </div>
                  <div className={`facility-status ${status.className}`}>
                    {status.icon} {status.label}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ResourceList;
