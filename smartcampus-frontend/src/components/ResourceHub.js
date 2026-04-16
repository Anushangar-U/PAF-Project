import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { 
  FaMicrochip, 
  FaChalkboardTeacher, 
  FaDoorOpen, 
  FaTools, 
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCalendarCheck
} from 'react-icons/fa';
import { RiOrganizationChart } from 'react-icons/ri';
import ResourceService from '../services/ResourceService';
import AddResourceForm from './AddResourceForm';
import { useAuth } from '../hooks/useAuth';
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
  const { isAdmin, isLoading: authLoading } = useAuth();
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const fetchResources = useCallback(async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (facultyId) {
        response = await ResourceService.getResourcesByFacultyId(facultyId);
      } else {
        response = await ResourceService.getAllResources();
      }
      
      let fetchedResources = Array.isArray(response.data) ? response.data : [];
      setResources(fetchedResources);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching resources:', error);
      setErrorMessage('Unable to load resources. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, [facultyId]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Handle requesting ANY resource (not just equipment)
  const handleRequestResource = (resource) => {
    const resourceTypeLabel = resource.type || 'Resource';
    alert(`📋 Booking Request Submitted\n\nResource: ${resource.name}\nType: ${resourceTypeLabel}\nLocation: ${resource.location}\nCapacity: ${resource.capacity > 0 ? resource.capacity : 'N/A'}\n\nYour booking request has been sent for approval. You will be notified once it's processed.`);
  };

  // Handle edit resource (Admin only)
  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowAddForm(true);
  };

  // Handle delete resource (Admin only)
  const handleDeleteResource = async (resourceId, resourceName) => {
    if (window.confirm(`Are you sure you want to delete "${resourceName}"? This action cannot be undone.`)) {
      try {
        await ResourceService.deleteResource(resourceId);
        alert(`"${resourceName}" has been deleted successfully.`);
        fetchResources();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete resource. Please try again.');
      }
    }
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

  const handleFormSuccess = () => {
    fetchResources();
    setShowAddForm(false);
    setEditingResource(null);
  };

  return (
    <div className="resource-hub-container">
      {/* Admin Toolbar */}
      {!authLoading && isAdmin && (
        <div className="admin-toolbar">
          <button 
            className={`btn-admin-toggle ${showAddForm ? 'active' : ''}`}
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm) setEditingResource(null);
            }}
          >
            {showAddForm ? (
              <><FaTimes /> Close Form</>
            ) : (
              <><FaPlus /> Add New Resource</>
            )}
          </button>
        </div>
      )}

      {/* Add/Edit Resource Form - Admin Only */}
      {!authLoading && isAdmin && showAddForm && (
        <AddResourceForm 
          onResourceAdded={handleFormSuccess}
          facultyId={facultyId}
          facultyName={facultyName}
        />
      )}

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
          <h3>No resources found {facultyName ? `for ${facultyName}` : ''}</h3>
          <p>Resources added by administrators will appear here.</p>
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
                        <span className="capacity-value">{item.capacity > 0 ? item.capacity : '—'}</span>
                        <span className="capacity-label">Capacity</span>
                      </div>
                      
                      {/* ADMIN ACTIONS */}
                      {!authLoading && isAdmin && (
                        <div className="admin-actions">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditResource(item)}
                            title="Edit Resource"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteResource(item.id, item.name)}
                            title="Delete Resource"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                      
                      {/* USER ACTIONS - Request button for ALL active resources */}
                      {!authLoading && !isAdmin && item.status === 'ACTIVE' && (
                        <button 
                          className="btn-request-resource"
                          onClick={() => handleRequestResource(item)}
                          title="Request this resource"
                        >
                          <FaCalendarCheck /> Request
                        </button>
                      )}
                      
                      {/* Unavailable button for OUT_OF_SERVICE resources */}
                      {!authLoading && !isAdmin && item.status !== 'ACTIVE' && (
                        <button 
                          className="btn-request-resource disabled"
                          disabled
                          title="This resource is currently unavailable"
                        >
                          <FaExclamationTriangle /> Unavailable
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
        <h3><RiOrganizationChart /> Recent Activity</h3>
        <p className="log-placeholder">Your recent requests and bookings will appear here.</p>
      </div>
    </div>
  );
};

export default ResourceHub;