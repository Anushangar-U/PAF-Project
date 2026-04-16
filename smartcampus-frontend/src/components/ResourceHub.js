import React, { useEffect, useMemo, useState } from 'react';
import { 
  FaMicrochip, 
  FaChalkboardTeacher, 
  FaDoorOpen, 
  FaTools, 
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList
} from 'react-icons/fa';
import { RiOrganizationChart } from 'react-icons/ri';
import { MdArrowForward } from 'react-icons/md';  // ← ADD THIS IMPORT
import ResourceService from '../services/ResourceService';
import './ResourceHub.css';

const CATEGORY_CONFIG = {
  'Lecture Hall': {
    title: 'Lecture Halls',
    icon: <FaChalkboardTeacher />,
    headerColor: '#ebf8ff',
    borderColor: '#3182ce'
  },
  'Lab': {
    title: 'Laboratories',
    icon: <FaMicrochip />,
    headerColor: '#f0fff4',
    borderColor: '#38a169'
  },
  'Meeting Room': {
    title: 'Meeting Rooms',
    icon: <FaDoorOpen />,
    headerColor: '#fffaf0',
    borderColor: '#dd6b20'
  },
  'Equipment': {
    title: 'Equipment',
    icon: <FaTools />,
    headerColor: '#faf5ff',
    borderColor: '#805ad5'
  },
  'Other': {
    title: 'Other Resources',
    icon: <RiOrganizationChart />,
    headerColor: '#f7fafc',
    borderColor: '#a0aec0'
  }
};

const ResourceHub = ({ facultyId, facultyName }) => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    let isMounted = true;

    const fetchResources = async () => {
      try {
        setIsLoading(true);
        let response;
        
        if (facultyId) {
          response = await ResourceService.getResourcesByFacultyId(facultyId);
        } else {
          response = await ResourceService.getAllResources();
        }
        
        if (isMounted) {
          let fetchedResources = Array.isArray(response.data) ? response.data : [];
          setResources(fetchedResources);
          setErrorMessage('');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching resources:', error);
          setErrorMessage('Unable to load resources. Please ensure the backend is running.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchResources();
    return () => { isMounted = false; };
  }, [facultyId]);

  // Handle request resource (for equipment only)
  const handleRequestResource = (resource) => {
    alert(`Request sent for: ${resource.name}\nType: ${resource.type}\nLocation: ${resource.location}\n\nYour request has been submitted to the faculty administrator.`);
  };

  const resourceCategories = useMemo(() => {
    const grouped = new Map();

    resources.forEach((resource) => {
      const type = resource.type || 'Other';
      const config = CATEGORY_CONFIG[type] || CATEGORY_CONFIG['Other'];

      if (!grouped.has(type)) {
        grouped.set(type, {
          type: type,
          title: config.title,
          icon: config.icon,
          headerColor: config.headerColor,
          borderColor: config.borderColor,
          items: [],
        });
      }

      grouped.get(type).items.push({
        id: resource.id,
        name: resource.name || 'Unnamed Resource',
        location: resource.location || 'Unknown location',
        capacity: resource.capacity || 0,
        availabilityWindows: resource.availabilityWindows || 'Not specified',
        status: resource.status || 'UNKNOWN',
        type: resource.type || 'Other',
      });
    });

    return Array.from(grouped.values());
  }, [resources]);

  const resourceTypes = useMemo(() => {
    const types = ['All', ...new Set(resources.map(r => r.type).filter(Boolean))];
    return types;
  }, [resources]);

  const filteredCategories = useMemo(() => {
    if (selectedType === 'All') return resourceCategories;
    return resourceCategories.filter(cat => cat.type === selectedType);
  }, [resourceCategories, selectedType]);

  const stats = useMemo(() => {
    const total = resources.length;
    const active = resources.filter(r => r.status === 'ACTIVE').length;
    const outOfService = resources.filter(r => r.status === 'OUT_OF_SERVICE').length;
    return { total, active, outOfService };
  }, [resources]);

  return (
    <div className="resource-hub-container">
      <header className="top-bar">
        <div className="page-header-info">
          <div className="page-title">
            <RiOrganizationChart className="page-title-icon" />
            <h1>Resource Hub</h1>
          </div>
          {facultyName && (
            <p className="page-subtitle">
              Showing resources for <strong>{facultyName}</strong>
            </p>
          )}
          <p className="page-subtitle">Browse and request campus resources</p>
        </div>
        
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Resources</span>
          </div>
          <div className="stat-card active">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card out-of-service">
            <span className="stat-value">{stats.outOfService}</span>
            <span className="stat-label">Out of Service</span>
          </div>
        </div>
      </header>

      {resources.length > 0 && (
        <div className="filter-bar">
          <label htmlFor="type-filter">Filter by Type:</label>
          <select 
            id="type-filter"
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-filter"
          >
            {resourceTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <span className="filter-count">
            Showing {filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} resources
          </span>
        </div>
      )}

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading resources...</p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="error-container">
          <FaExclamationTriangle className="error-icon" />
          <p>{errorMessage}</p>
        </div>
      )}

      {!isLoading && !errorMessage && resources.length === 0 && (
        <div className="empty-container">
          <RiOrganizationChart className="empty-icon" />
          <h3>No resources found for {facultyName || 'this faculty'}</h3>
          <p>Resources added by administrators for this faculty will appear here.</p>
        </div>
      )}

      {!isLoading && !errorMessage && resources.length > 0 && (
        <div className="resource-grid">
          {filteredCategories.map((category) => (
            <div 
              className="resource-category-card" 
              key={category.type}
              style={{ borderTop: `4px solid ${category.borderColor}` }}
            >
              <div
                className="category-header"
                style={{ backgroundColor: category.headerColor }}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-title-group">
                  <h3>{category.title}</h3>
                  <span className="category-count">{category.items.length} items</span>
                </div>
              </div>

              <div className="category-items-list">
                {category.items.map((item) => (
                  <div className="resource-item-row" key={item.id}>
                    <div className="item-info">
                      <div className="item-name-row">
                        <h4>{item.name}</h4>
                        <span className={`status-badge ${item.status?.toLowerCase()}`}>
                          {item.status === 'ACTIVE' ? (
                            <><FaCheckCircle /> Active</>
                          ) : item.status === 'OUT_OF_SERVICE' ? (
                            <><FaExclamationTriangle /> Out of Service</>
                          ) : (
                            item.status
                          )}
                        </span>
                      </div>
                      <span className="item-location">
                        <FaMapMarkerAlt className="pin-icon" /> {item.location}
                      </span>
                      <span className="item-availability">
                        🕐 {item.availabilityWindows}
                      </span>
                    </div>
                    <div className="item-action">
                      <div className="item-capacity">
                        <span className="capacity-value">{item.capacity}</span>
                        <span className="capacity-label">Capacity</span>
                      </div>
                      {/* Show Request button only for Equipment type */}
                      {item.type === 'Equipment' && item.status === 'ACTIVE' && (
                        <button 
                          className="btn-request-resource"
                          onClick={() => handleRequestResource(item)}
                        >
                          <FaClipboardList /> Request
                        </button>
                      )}
                      {item.type === 'Equipment' && item.status !== 'ACTIVE' && (
                        <button 
                          className="btn-request-resource disabled"
                          disabled
                        >
                          <FaClipboardList /> Unavailable
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="resource-log-preview">
        <h3><RiOrganizationChart /> Recent Requests</h3>
        <p className="log-placeholder">Request history will appear here when requests are made.</p>
      </div>
    </div>
  );
};

export default ResourceHub;