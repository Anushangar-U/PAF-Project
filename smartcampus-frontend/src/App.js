import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  FaUniversity, 
  FaSignOutAlt, 
  FaHome, 
  FaCalendarCheck,
  FaUserShield,
  FaArrowLeft
} from 'react-icons/fa';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import AdminBookings from './components/Bookings/AdminBookings/AdminBookings';
import MyBookings from './components/Bookings/MyBookings/MyBookings';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './hooks/useAuth';
import './App.css';

const NAV = '#0b1628';

// ============================================ //
// FACULTIES PAGE WITH HERO SECTION             //
// ============================================ //
const FacultiesPage = () => {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Same style as About/Contact */}
        <div className="py-20" style={{ background: NAV }}>
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
              Explore Our Faculties
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Browse through our six academic faculties, discover resources, and book what you need for your academic success.
            </p>
            
            {!isLoggedIn && (
              <div className="pt-4">
                <button
                  onClick={() => {
                    localStorage.setItem('user', JSON.stringify({ name: 'Student', email: 'student@campus.edu', role: 'USER' }));
                    localStorage.setItem('token', 'mock-user-token');
                    window.location.reload();
                  }}
                  className="inline-block bg-white px-8 py-3.5 rounded text-base font-bold hover:bg-slate-100 transition-colors shadow-[0_4px_0_0_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1"
                  style={{ color: NAV }}
                >
                  Sign In to Book Resources
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar - Same style as About/Contact */}
        <div className="bg-slate-100 py-12 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: '6', label: 'Faculties' },
                { value: '42+', label: 'Resources' },
                { value: '24/7', label: 'Booking' },
                { value: '1.2k+', label: 'Students' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-black mb-1" style={{ color: NAV }}>{value}</div>
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-8">
            <Dashboard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ============================================ //
// MY BOOKINGS PAGE WITH HERO SECTION           //
// ============================================ //
const MyBookingsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="py-20" style={{ background: NAV }}>
          <div className="max-w-4xl mx-auto px-8 text-center space-y-6">
            <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              Your Reservations
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
              My Bookings
            </h1>
            <p className="text-lg font-medium max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              View and manage your resource bookings. Track pending approvals and upcoming reservations.
            </p>
          </div>
        </div>

        {/* MyBookings Content */}
        <div className="bg-slate-50 py-8">
          <div className="max-w-7xl mx-auto px-8">
            <MyBookings />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// ============================================ //
// ADMIN OVERVIEW COMPONENT                     //
// ============================================ //
const AdminOverview = ({ setAdminSection }) => {
  return (
    <div className="admin-overview">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📚</div>
          <div className="admin-stat-value">42</div>
          <div className="admin-stat-label">Total Resources</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">📋</div>
          <div className="admin-stat-value">8</div>
          <div className="admin-stat-label">Pending Bookings</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>
          <div className="admin-stat-value">24</div>
          <div className="admin-stat-label">Approved</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon">👥</div>
          <div className="admin-stat-value">156</div>
          <div className="admin-stat-label">Total Users</div>
        </div>
      </div>

      <div className="admin-action-cards">
        <div className="admin-action-card" onClick={() => setAdminSection('faculties')}>
          <div className="action-card-icon">🏛️</div>
          <h3>Faculties Management</h3>
          <p>View and manage all resources grouped by faculty. Edit, delete, or add new resources.</p>
          <span className="action-link">Manage Faculties →</span>
        </div>
        
        <div className="admin-action-card" onClick={() => setAdminSection('bookings')}>
          <div className="action-card-icon">📅</div>
          <h3>Booking Requests</h3>
          <p>Review, approve, or reject pending booking requests from students and staff.</p>
          <span className="action-link">View Requests →</span>
        </div>
      </div>
    </div>
  );
};

// ============================================ //
// FACULTIES MANAGEMENT COMPONENT               //
// ============================================ //
const FacultiesManagement = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaculty, setExpandedFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [newResource, setNewResource] = useState({
    name: '',
    type: 'Lab',
    capacity: 0,
    location: '',
    availabilityWindows: 'Mon-Fri 8AM-6PM',
    status: 'ACTIVE',
    facultyId: 'FOC',
    facultyName: 'Faculty of Computing'
  });

  const facultyOptions = [
    { id: 'FOC', name: 'Faculty of Computing' },
    { id: 'FOE', name: 'Faculty of Engineering' },
    { id: 'FOB', name: 'Faculty of Business' },
    { id: 'FOA', name: 'Faculty of Architecture' },
    { id: 'FHSS', name: 'Faculty of Human Studies' },
    { id: 'GSR', name: 'Graduate Studies & Research' }
  ];

  const resourceTypes = ['Lab', 'Lecture Hall', 'Meeting Room', 'Equipment'];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:9091/api/resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId, resourceName) => {
    if (window.confirm(`Delete "${resourceName}"? This cannot be undone.`)) {
      try {
        await axios.delete(`http://localhost:9091/api/resources/${resourceId}`);
        alert('Resource deleted successfully');
        fetchResources();
      } catch (error) {
        alert('Failed to delete resource');
      }
    }
  };

  const handleStatusToggle = async (resource) => {
    const newStatus = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
    try {
      await axios.put(`http://localhost:9091/api/resources/${resource.id}`, {
        ...resource,
        status: newStatus
      });
      fetchResources();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:9091/api/resources', newResource);
      alert('Resource added successfully!');
      setShowAddModal(false);
      setNewResource({
        name: '',
        type: 'Lab',
        capacity: 0,
        location: '',
        availabilityWindows: 'Mon-Fri 8AM-6PM',
        status: 'ACTIVE',
        facultyId: 'FOC',
        facultyName: 'Faculty of Computing'
      });
      fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      alert('Failed to add resource');
    }
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowEditModal(true);
  };

  const handleUpdateResource = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9091/api/resources/${editingResource.id}`, editingResource);
      alert('Resource updated successfully!');
      setShowEditModal(false);
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error updating resource:', error);
      alert('Failed to update resource');
    }
  };

  const resourcesByFaculty = resources.reduce((acc, resource) => {
    const faculty = resource.facultyName || 'Unassigned';
    if (!acc[faculty]) {
      acc[faculty] = [];
    }
    acc[faculty].push(resource);
    return acc;
  }, {});

  const sortedFaculties = Object.entries(resourcesByFaculty).sort((a, b) => 
    a[0].localeCompare(b[0])
  );

  const filteredFaculties = sortedFaculties.filter(([faculty, facultyResources]) => {
    if (!searchTerm) return true;
    return faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
           facultyResources.some(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  if (loading) {
    return (
      <div className="faculties-loading">
        <div className="loading-spinner"></div>
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="faculties-management">
      <div className="faculties-header">
        <div className="faculties-header-top">
          <div>
            <h2>Faculties Management</h2>
            <p>View and manage all resources across all faculties</p>
          </div>
          <button 
            className="btn-add-resource"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Resource
          </button>
        </div>
        
        <div className="faculties-search">
          <input
            type="text"
            placeholder="Search by faculty or resource name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Resource</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddResource} className="resource-form">
              <div className="form-group">
                <label>Resource Name *</label>
                <input
                  type="text"
                  value={newResource.name}
                  onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                  required
                  placeholder="e.g., Computer Lab 101"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({...newResource, type: e.target.value})}
                    required
                  >
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={newResource.capacity}
                    onChange={(e) => setNewResource({...newResource, capacity: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={newResource.location}
                  onChange={(e) => setNewResource({...newResource, location: e.target.value})}
                  required
                  placeholder="e.g., Block B, Floor 1"
                />
              </div>
              
              <div className="form-group">
                <label>Availability Windows</label>
                <input
                  type="text"
                  value={newResource.availabilityWindows}
                  onChange={(e) => setNewResource({...newResource, availabilityWindows: e.target.value})}
                  placeholder="e.g., Mon-Fri 8AM-6PM"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={newResource.status}
                    onChange={(e) => setNewResource({...newResource, status: e.target.value})}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Faculty *</label>
                  <select
                    value={newResource.facultyId}
                    onChange={(e) => {
                      const selectedFaculty = facultyOptions.find(f => f.id === e.target.value);
                      setNewResource({
                        ...newResource, 
                        facultyId: e.target.value,
                        facultyName: selectedFaculty?.name || ''
                      });
                    }}
                    required
                  >
                    {facultyOptions.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resource Modal */}
      {showEditModal && editingResource && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Resource</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdateResource} className="resource-form">
              <div className="form-group">
                <label>Resource Name *</label>
                <input
                  type="text"
                  value={editingResource.name}
                  onChange={(e) => setEditingResource({...editingResource, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={editingResource.type}
                    onChange={(e) => setEditingResource({...editingResource, type: e.target.value})}
                    required
                  >
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={editingResource.capacity}
                    onChange={(e) => setEditingResource({...editingResource, capacity: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={editingResource.location}
                  onChange={(e) => setEditingResource({...editingResource, location: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Availability Windows</label>
                <input
                  type="text"
                  value={editingResource.availabilityWindows}
                  onChange={(e) => setEditingResource({...editingResource, availabilityWindows: e.target.value})}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={editingResource.status}
                    onChange={(e) => setEditingResource({...editingResource, status: e.target.value})}
                    required
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Faculty *</label>
                  <select
                    value={editingResource.facultyId}
                    onChange={(e) => {
                      const selectedFaculty = facultyOptions.find(f => f.id === e.target.value);
                      setEditingResource({
                        ...editingResource, 
                        facultyId: e.target.value,
                        facultyName: selectedFaculty?.name || ''
                      });
                    }}
                    required
                  >
                    {facultyOptions.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="faculties-list">
        {filteredFaculties.length === 0 ? (
          <div className="no-results">No faculties or resources found.</div>
        ) : (
          filteredFaculties.map(([faculty, facultyResources]) => (
            <div key={faculty} className="faculty-group">
              <div 
                className="faculty-group-header"
                onClick={() => setExpandedFaculty(expandedFaculty === faculty ? null : faculty)}
              >
                <div className="faculty-group-title">
                  <span className="faculty-icon">🏛️</span>
                  <h3>{faculty}</h3>
                  <span className="resource-count">{facultyResources.length} resources</span>
                </div>
                <span className={`expand-icon ${expandedFaculty === faculty ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>

              {expandedFaculty === faculty && (
                <div className="faculty-resources">
                  <table className="resources-table">
                    <thead>
                      <tr>
                        <th>Resource Name</th>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facultyResources.map(resource => (
                        <tr key={resource.id}>
                          <td><strong>{resource.name}</strong></td>
                          <td>{resource.type}</td>
                          <td>{resource.capacity > 0 ? resource.capacity : '—'}</td>
                          <td>{resource.location}</td>
                          <td>
                            <span className={`status-badge-small ${resource.status?.toLowerCase()}`}>
                              {resource.status}
                            </span>
                          </td>
                          <td>
                            <div className="resource-actions">
                              <button 
                                className="action-btn edit-btn"
                                onClick={() => handleEditResource(resource)}
                                title="Edit Resource"
                              >
                                ✏️
                              </button>
                              <button 
                                className="action-btn toggle-btn"
                                onClick={() => handleStatusToggle(resource)}
                                title={resource.status === 'ACTIVE' ? 'Set Out of Service' : 'Set Active'}
                              >
                                {resource.status === 'ACTIVE' ? '🔴' : '🟢'}
                              </button>
                              <button 
                                className="action-btn delete-btn"
                                onClick={() => handleDeleteResource(resource.id, resource.name)}
                                title="Delete Resource"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================ //
// ADMIN PANEL COMPONENT                        //
// ============================================ //
const AdminPanel = () => {
  const { user } = useAuth();
  const [adminSection, setAdminSection] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('dev_isAdmin');
    window.location.href = '/';
  };

  return (
    <div className="admin-full-page">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-right">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name || 'Administrator'}</span>
            <span className="admin-badge">Admin</span>
          </div>
          <button className="logout-btn-header" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      <div className="admin-page-tabs">
        <button 
          className={`admin-page-tab ${adminSection === 'dashboard' ? 'active' : ''}`}
          onClick={() => setAdminSection('dashboard')}
        >
          <FaHome /> Overview
        </button>
        <button 
          className={`admin-page-tab ${adminSection === 'faculties' ? 'active' : ''}`}
          onClick={() => setAdminSection('faculties')}
        >
          <FaUniversity /> Faculties Management
        </button>
        <button 
          className={`admin-page-tab ${adminSection === 'bookings' ? 'active' : ''}`}
          onClick={() => setAdminSection('bookings')}
        >
          <FaCalendarCheck /> Booking Requests
        </button>
      </div>

      <div className="admin-page-content">
        {adminSection === 'dashboard' && (
          <AdminOverview setAdminSection={setAdminSection} />
        )}

        {adminSection === 'faculties' && (
          <FacultiesManagement />
        )}

        {adminSection === 'bookings' && (
          <div className="admin-bookings-container">
            <AdminBookings />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================ //
// MAIN APP COMPONENT                           //
// ============================================ //
function App() {
  const { isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Smart Campus...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* FACULTIES PAGE - WITH HERO SECTION */}
        <Route path="/faculties" element={<FacultiesPage />} />
        
        {/* MY BOOKINGS PAGE - WITH HERO SECTION */}
        <Route path="/mybookings" element={<MyBookingsPage />} />
        
        {/* ADMIN ROUTE */}
        <Route path="/admin" element={
          isAdmin ? <AdminPanel /> : <Navigate to="/" replace />
        } />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;