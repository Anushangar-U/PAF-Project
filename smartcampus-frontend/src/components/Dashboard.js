import React, { useState } from 'react';
import { 
  FaUniversity, FaChartLine, FaDraftingCompass, FaBookOpen, FaGraduationCap,
  FaChalkboardTeacher, FaUsers, FaSearch, FaArrowLeft, FaEnvelope, FaPhone,
  FaGlobe, FaCalendarAlt, FaClock, FaUserTie, FaMapMarkerAlt, FaUserFriends
} from 'react-icons/fa';
import { MdOutlineComputer } from 'react-icons/md';
import { BsCpuFill } from 'react-icons/bs';
import { RiOrganizationChart } from 'react-icons/ri';
import './Dashboard.css';

// Import images of faculties
import FoeImg from '../images/FOE.jpg';
import FocImg from '../images/FOC.jpg';
import FoaImg from '../images/FOA.jpg';
import FobImg from '../images/FOB.jpg';
import FhssImg from '../images/FHSS.jpg';
import GsrImg from '../images/GSR.jpg';

// Default fallback image for resource hub (use one of your existing images)
// If you don't have these specific images, use the faculty images as fallback
const getResourceImage = (facultyId) => {
  // Return the faculty image as fallback if specific resource images don't exist
  switch(facultyId) {
    case 'FOA':
      return FoaImg;
    case 'FOB':
      return FobImg;
    case 'FOC':
      return FocImg;
    case 'FOE':
      return FoeImg;
    case 'FHSS':
      return FhssImg;
    case 'GSR':
      return GsrImg;
    default:
      return FocImg;
  }
};

const facultiesData = [
  {
    id: 'FOC',
    title: 'Faculty of Computing',
    icon: <MdOutlineComputer className="card-icon" style={{ color: '#38a169' }} />,
    image: FocImg,
    themeColor: '#38a169',
    location: 'Block B, 2nd Floor',
    dean: 'Prof. Sarah Johnson',
    email: 'foc@campusmart.edu',
    phone: '+94 11 234 5678',
    website: 'computing.campusmart.edu',
    established: 2005,
    students: 1240,
    staff: 85,
    departments: ['Computer Science', 'Information Technology', 'Data Science', 'Software Engineering'],
    description: 'The Faculty of Computing offers cutting-edge programs in computer science, IT, and emerging technologies. Our state-of-the-art labs and experienced faculty prepare students for careers in the digital economy.',
    officeHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    resources: {
      lectureHalls: 8,
      computerLabs: 12,
      pcs: 450,
      libraryBooks: 18000,
      researchCenters: 4,
      studentLounges: 2,
      conferenceRooms: 5
    }
  },
  {
    id: 'FOE',
    title: 'Faculty of Engineering',
    icon: <BsCpuFill className="card-icon" style={{ color: '#2b6cb0' }} />,
    image: FoeImg,
    themeColor: '#2b6cb0',
    location: 'Block C, 1st Floor',
    dean: 'Prof. Michael Chen',
    email: 'foe@campusmart.edu',
    phone: '+94 11 234 5679',
    website: 'engineering.campusmart.edu',
    established: 2000,
    students: 1850,
    staff: 120,
    departments: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering'],
    description: 'The Faculty of Engineering provides world-class education in various engineering disciplines. Students gain hands-on experience through modern laboratories and industry partnerships.',
    officeHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
    resources: {
      lectureHalls: 15,
      computerLabs: 10,
      pcs: 380,
      libraryBooks: 25000,
      researchCenters: 8,
      studentLounges: 3,
      conferenceRooms: 7
    }
  },
  {
    id: 'FOB',
    title: 'Faculty of Business',
    icon: <FaChartLine className="card-icon" style={{ color: '#dd6b20' }} />,
    image: FobImg,
    themeColor: '#dd6b20',
    location: 'Block A, 3rd Floor',
    dean: 'Prof. David Williams',
    email: 'fob@campusmart.edu',
    phone: '+94 11 234 5680',
    website: 'business.campusmart.edu',
    established: 1998,
    students: 2100,
    staff: 95,
    departments: ['Marketing', 'Finance', 'Management', 'Entrepreneurship'],
    description: 'The Faculty of Business develops future business leaders through innovative programs, case studies, and real-world projects. Our graduates are sought after by top companies.',
    officeHours: 'Mon-Fri: 8:30 AM - 5:30 PM',
    resources: {
      lectureHalls: 10,
      computerLabs: 6,
      pcs: 200,
      libraryBooks: 15000,
      researchCenters: 3,
      studentLounges: 2,
      conferenceRooms: 6
    }
  },
  {
    id: 'FOA',
    title: 'Faculty of Architecture',
    icon: <FaDraftingCompass className="card-icon" style={{ color: '#805ad5' }} />,
    image: FoaImg,
    themeColor: '#805ad5',
    location: 'Block D, 1st Floor',
    dean: 'Prof. Lisa Martinez',
    email: 'foa@campusmart.edu',
    phone: '+94 11 234 5681',
    website: 'architecture.campusmart.edu',
    established: 2010,
    students: 890,
    staff: 45,
    departments: ['Architecture', 'Urban Planning', 'Landscape Design'],
    description: 'The Faculty of Architecture combines creative design with technical excellence. Students work in modern studios and participate in design competitions.',
    officeHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    resources: {
      lectureHalls: 6,
      computerLabs: 5,
      pcs: 150,
      libraryBooks: 8000,
      researchCenters: 2,
      studentLounges: 1,
      conferenceRooms: 3
    }
  },
  {
    id: 'FHSS',
    title: 'Faculty of Human Studies',
    icon: <FaBookOpen className="card-icon" style={{ color: '#97266d' }} />,
    image: FhssImg,
    themeColor: '#97266d',
    location: 'Block A, 2nd Floor',
    dean: 'Prof. Emma Thompson',
    email: 'fhss@campusmart.edu',
    phone: '+94 11 234 5682',
    website: 'humanstudies.campusmart.edu',
    established: 2003,
    students: 1560,
    staff: 110,
    departments: ['Psychology', 'Sociology', 'Political Science', 'International Relations'],
    description: 'The Faculty of Human Studies explores human behavior, societies, and cultures. Our interdisciplinary approach prepares students for diverse careers.',
    officeHours: 'Mon-Fri: 8:30 AM - 5:00 PM',
    resources: {
      lectureHalls: 12,
      computerLabs: 4,
      pcs: 120,
      libraryBooks: 20000,
      researchCenters: 3,
      studentLounges: 2,
      conferenceRooms: 4
    }
  },
  {
    id: 'GSR',
    title: 'Graduate Studies & Research',
    icon: <FaGraduationCap className="card-icon" style={{ color: '#2f855a' }} />,
    image: GsrImg,
    themeColor: '#2f855a',
    location: 'Block E, 4th Floor',
    dean: 'Prof. Robert Anderson',
    email: 'gsr@campusmart.edu',
    phone: '+94 11 234 5683',
    website: 'research.campusmart.edu',
    established: 2012,
    students: 890,
    staff: 60,
    departments: ['PhD Programs', 'Masters Programs', 'Research Centers', 'Postdoctoral Fellowships'],
    description: 'Graduate Studies & Research oversees all postgraduate programs and research activities. We support innovation and advanced scholarship across disciplines.',
    officeHours: 'Mon-Fri: 9:00 AM - 7:00 PM',
    resources: {
      lectureHalls: 5,
      computerLabs: 8,
      pcs: 280,
      libraryBooks: 35000,
      researchCenters: 12,
      studentLounges: 2,
      conferenceRooms: 8
    }
  },
];

// Resource Hub Modal with faculty-specific data
const ResourceHubModal = ({ faculty, onClose }) => {
  const res = faculty.resources;
  
  return (
    <div className="resource-hub-overlay" onClick={onClose}>
      <div className="resource-hub-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        <h2>Resource Hub - {faculty.title}</h2>
        <div className="resource-hub-content">
          <div className="resource-section">
            <h3>📚 Available Resources</h3>
            <ul>
              <li>🏫 Lecture Halls: {res.lectureHalls} rooms</li>
              <li>💻 Computer Labs: {res.computerLabs} labs ({res.pcs} PCs)</li>
              <li>📖 Library: {res.libraryBooks.toLocaleString()}+ books</li>
              <li>🔬 Research Centers: {res.researchCenters} facilities</li>
              <li>🎓 Student Lounges: {res.studentLounges} areas</li>
              <li>📊 Conference Rooms: {res.conferenceRooms} spaces</li>
            </ul>
          </div>
          <div className="resource-section">
            <h3>⏰ Booking Availability</h3>
            <ul>
              <li>🟢 Today: {Math.floor(Math.random() * 30) + 60}% available</li>
              <li>🟡 Tomorrow: {Math.floor(Math.random() * 20) + 75}% available</li>
              <li>🔴 Peak hours: 2-4 PM (limited)</li>
            </ul>
            <button className="book-now-btn">Book a Resource →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Faculty Info Page Component
const FacultyInfoPage = ({ faculty, onBack }) => {
  const [showResourceHub, setShowResourceHub] = useState(false);

  return (
    <>
      <div className="faculty-info-page">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Back to Faculties
        </button>

        <div className="faculty-info-header" style={{ borderBottomColor: faculty.themeColor }}>
          <div className="faculty-info-icon">
            {faculty.icon}
          </div>
          <div className="faculty-info-title">
            <h1>{faculty.title}</h1>
            <span className="faculty-code-large">{faculty.id}</span>
          </div>
        </div>

        <div className="faculty-info-grid">
          <div className="info-main">
            <div className="info-image">
              <img src={faculty.image} alt={faculty.title} />
            </div>
            
            <div className="info-description">
              <h3>About</h3>
              <p>{faculty.description}</p>
            </div>

            <div className="info-departments">
              <h3>Departments</h3>
              <div className="departments-list">
                {faculty.departments.map((dept, index) => (
                  <span key={index} className="dept-tag">{dept}</span>
                ))}
              </div>
            </div>

            {/* Resource Hub Button with Faculty Image (fallback) */}
            <div className="resource-hub-button-container">
              <button 
                className="resource-hub-image-btn"
                onClick={() => setShowResourceHub(true)}
              >
                <img src={getResourceImage(faculty.id)} alt="Resource Hub" />
                <div className="btn-overlay">
                  <RiOrganizationChart className="btn-icon" />
                  <span>Access Resource Hub</span>
                </div>
              </button>
            </div>
          </div>

          <div className="info-sidebar">
            <div className="info-card">
              <h3>Contact Information</h3>
              <div className="info-detail">
                <FaUserTie className="detail-icon" />
                <div>
                  <strong>Dean</strong>
                  <p>{faculty.dean}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaEnvelope className="detail-icon" />
                <div>
                  <strong>Email</strong>
                  <p>{faculty.email}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaPhone className="detail-icon" />
                <div>
                  <strong>Phone</strong>
                  <p>{faculty.phone}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaGlobe className="detail-icon" />
                <div>
                  <strong>Website</strong>
                  <p>{faculty.website}</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Location & Hours</h3>
              <div className="info-detail">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <strong>Location</strong>
                  <p>{faculty.location}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaClock className="detail-icon" />
                <div>
                  <strong>Office Hours</strong>
                  <p>{faculty.officeHours}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaCalendarAlt className="detail-icon" />
                <div>
                  <strong>Established</strong>
                  <p>{faculty.established}</p>
                </div>
              </div>
            </div>

            <div className="info-card stats-card">
              <h3>Quick Stats</h3>
              <div className="stat-item-large">
                <FaUsers />
                <div>
                  <strong>{faculty.students}</strong>
                  <p>Current Students</p>
                </div>
              </div>
              <div className="stat-item-large">
                <FaUserFriends />
                <div>
                  <strong>{faculty.staff}</strong>
                  <p>Staff Members</p>
                </div>
              </div>
              <div className="stat-item-large">
                <RiOrganizationChart />
                <div>
                  <strong>{faculty.departments.length}</strong>
                  <p>Departments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Hub Modal */}
      {showResourceHub && (
        <ResourceHubModal faculty={faculty} onClose={() => setShowResourceHub(false)} />
      )}
    </>
  );
};

const Dashboard = ({ renderContent }) => {
  const [activeTab, setActiveTab] = useState('faculties');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const filteredFaculties = facultiesData.filter(faculty =>
    faculty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExplore = (faculty) => {
    setSelectedFaculty(faculty);
  };

  const handleBack = () => {
    setSelectedFaculty(null);
  };

  // Show faculty info page if a faculty is selected
  if (selectedFaculty) {
    return (
      <div className="dashboard-container">
        <nav className="top-navbar">
          <div className="nav-brand">
            <FaUniversity className="nav-logo" />
            <h2>CampusSmart</h2>
          </div>
        </nav>
        <main className="main-content">
          <FacultyInfoPage faculty={selectedFaculty} onBack={handleBack} />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation Bar - Only Faculties Tab Now */}
      <nav className="top-navbar">
        <div className="nav-brand">
          <FaUniversity className="nav-logo" />
          <h2>CampusSmart</h2>
        </div>
        <div className="nav-menu">
          <div 
            className={`nav-item ${activeTab === 'faculties' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculties')}
          >
            <FaChalkboardTeacher />
            <span>Faculties</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {!renderContent ? (
          <>
            {activeTab === 'faculties' && (
              <>
                <header className="top-bar">
                  <div className="page-header-info">
                    <div className="page-title">
                      <FaUniversity className="page-title-icon" />
                      <h1>Academic Faculties</h1>
                    </div>
                    <p className="page-subtitle">Explore departments, resources, and allocate smartly</p>
                  </div>
                  <div className="summary-badge">
                    <span><RiOrganizationChart /> 6 Faculties</span>
                    <span><FaUsers /> 8,530 Students</span>
                  </div>
                </header>

                {/* Search Bar */}
                <div className="search-bar">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by faculty name or code (e.g., FOC, Engineering)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="faculties-grid">
                  {filteredFaculties.map((faculty) => (
                    <div className="faculty-card" key={faculty.id} style={{ '--theme-color': faculty.themeColor }}>
                      <div className="card-header">
                        {faculty.icon}
                        <div className="card-title-group">
                          <h3>{faculty.title}</h3>
                          <span className="faculty-code">{faculty.id}</span>
                        </div>
                      </div>
                      <div className="card-image-wrapper">
                        <img src={faculty.image} alt={faculty.title} className="card-image" />
                      </div>
                      
                      <div className="card-footer">
                        <div className="location">
                          📍 {faculty.location}
                        </div>
                        <button 
                          className="explore-btn"
                          onClick={() => handleExplore(faculty)}
                        >
                          Explore →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredFaculties.length === 0 && (
                  <div className="no-results">No faculties match your search.</div>
                )}
              </>
            )}
          </>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default Dashboard;