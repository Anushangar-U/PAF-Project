import React, { useState } from 'react';
import { 
  FaUniversity, FaChartLine, FaDraftingCompass, FaBookOpen, FaGraduationCap,
  FaChalkboardTeacher, FaUsers, FaSearch, FaArrowLeft, FaEnvelope, FaPhone,
  FaGlobe, FaCalendarAlt, FaClock, FaUserTie, FaMapMarkerAlt, FaUserFriends,
  FaEye, FaInfoCircle, FaBuilding, FaFlask, FaLaptop, FaMicroscope,
  FaCertificate
} from 'react-icons/fa';
import { MdOutlineComputer } from 'react-icons/md';
import { BsCpuFill } from 'react-icons/bs';
import { RiOrganizationChart } from 'react-icons/ri';
import ResourceHub from './ResourceHub';
import './Dashboard.css';

// Import images of faculties
import FoeImg from '../images/FOE.jpg';
import FocImg from '../images/FOC.jpg';
import FoaImg from '../images/FOA.jpg';
import FobImg from '../images/FOB.jpg';
import FhssImg from '../images/FHSS.jpg';
import GsrImg from '../images/GSR.jpg';

// Import images for resource hub button
import FoeRImg from '../images/engineeringEquipments.jpg';
import FocRImg from '../images/computerResourcce.jpg';
import FoaRImg from '../images/architectResource.jpg';
import FobRImg from '../images/businessResource.jpg';
import FhssRImg from '../images/humanitiesResources.jpg';
import GsrRImg from '../images/GsrResources.jpg';

const facultiesData = [
  {
    id: 'FOC',
    title: 'Faculty of Computing',
    icon: <MdOutlineComputer className="card-icon" style={{ color: '#38a169' }} />,
    image: FocImg,
    resourceButtonImage: FocRImg,
    themeColor: '#38a169',
    themeColorLight: '#e6fffa',
    location: 'Block B, 2nd Floor',
    dean: 'Prof. Sarah Johnson',
    email: 'foc@campusmart.edu',
    phone: '+94 11 234 5678',
    website: 'computing.campusmart.edu',
    established: 2005,
    students: 1240,
    staff: 85,
    departments: ['Computer Science', 'Information Technology', 'Data Science', 'Software Engineering', 'Cyber Security'],
    degreePrograms: [
      { name: 'B.Sc. Computer Science', duration: '4 Years', credits: 120 },
      { name: 'B.Sc. Information Technology', duration: '4 Years', credits: 120 },
      { name: 'M.Sc. Data Science', duration: '2 Years', credits: 60 },
      { name: 'M.Sc. Cyber Security', duration: '2 Years', credits: 60 },
      { name: 'PhD in Computing', duration: '3-5 Years', credits: 'Research Based' }
    ],
    researchAreas: ['Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Blockchain', 'IoT', 'Cyber Security'],
    facilities: ['AI Research Lab', 'Data Science Center', 'Software Development Lab', 'Networking Lab', 'Cloud Computing Lab'],
    description: 'The Faculty of Computing offers cutting-edge programs in computer science, IT, and emerging technologies. Our state-of-the-art labs and experienced faculty prepare students for careers in the digital economy.',
    officeHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
  },
  {
    id: 'FOE',
    title: 'Faculty of Engineering',
    icon: <BsCpuFill className="card-icon" style={{ color: '#2b6cb0' }} />,
    image: FoeImg,
    resourceButtonImage: FoeRImg,
    themeColor: '#2b6cb0',
    themeColorLight: '#ebf8ff',
    location: 'Block C, 1st Floor',
    dean: 'Prof. Michael Chen',
    email: 'foe@campusmart.edu',
    phone: '+94 11 234 5679',
    website: 'engineering.campusmart.edu',
    established: 2000,
    students: 1850,
    staff: 120,
    departments: ['Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Chemical Engineering', 'Biomedical Engineering'],
    degreePrograms: [
      { name: 'B.Sc. Civil Engineering', duration: '4 Years', credits: 130 },
      { name: 'B.Sc. Mechanical Engineering', duration: '4 Years', credits: 130 },
      { name: 'B.Sc. Electrical Engineering', duration: '4 Years', credits: 130 },
      { name: 'M.Eng. Structural Engineering', duration: '2 Years', credits: 65 },
      { name: 'PhD in Engineering', duration: '3-5 Years', credits: 'Research Based' }
    ],
    researchAreas: ['Renewable Energy', 'Robotics', 'Structural Design', 'Materials Science', 'Environmental Engineering'],
    facilities: ['Robotics Lab', 'Materials Testing Lab', 'CAD/CAM Center', 'Electrical Workshop', 'Hydraulics Lab'],
    description: 'The Faculty of Engineering provides world-class education in various engineering disciplines. Students gain hands-on experience through modern laboratories and industry partnerships.',
    officeHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
  },
  {
    id: 'FOB',
    title: 'Faculty of Business',
    icon: <FaChartLine className="card-icon" style={{ color: '#dd6b20' }} />,
    image: FobImg,
    resourceButtonImage: FobRImg,
    themeColor: '#dd6b20',
    themeColorLight: '#fffaf0',
    location: 'Block A, 3rd Floor',
    dean: 'Prof. David Williams',
    email: 'fob@campusmart.edu',
    phone: '+94 11 234 5680',
    website: 'business.campusmart.edu',
    established: 1998,
    students: 2100,
    staff: 95,
    departments: ['Marketing', 'Finance', 'Management', 'Entrepreneurship', 'International Business'],
    degreePrograms: [
      { name: 'BBA - Marketing', duration: '4 Years', credits: 120 },
      { name: 'BBA - Finance', duration: '4 Years', credits: 120 },
      { name: 'MBA', duration: '2 Years', credits: 60 },
      { name: 'Executive MBA', duration: '18 Months', credits: 55 },
      { name: 'PhD in Management', duration: '3-5 Years', credits: 'Research Based' }
    ],
    researchAreas: ['Digital Marketing', 'Financial Analytics', 'Supply Chain', 'Organizational Behavior', 'Business Strategy'],
    facilities: ['Trading Floor', 'Business Simulation Lab', 'Entrepreneurship Center', 'Case Study Library', 'Board Room'],
    description: 'The Faculty of Business develops future business leaders through innovative programs, case studies, and real-world projects. Our graduates are sought after by top companies.',
    officeHours: 'Mon-Fri: 8:30 AM - 5:30 PM',
  },
  {
    id: 'FOA',
    title: 'Faculty of Architecture',
    icon: <FaDraftingCompass className="card-icon" style={{ color: '#805ad5' }} />,
    image: FoaImg,
    resourceButtonImage: FoaRImg,
    themeColor: '#805ad5',
    themeColorLight: '#faf5ff',
    location: 'Block D, 1st Floor',
    dean: 'Prof. Lisa Martinez',
    email: 'foa@campusmart.edu',
    phone: '+94 11 234 5681',
    website: 'architecture.campusmart.edu',
    established: 2010,
    students: 890,
    staff: 45,
    departments: ['Architecture', 'Urban Planning', 'Landscape Design', 'Interior Design', 'Construction Management'],
    degreePrograms: [
      { name: 'B.Arch Architecture', duration: '5 Years', credits: 160 },
      { name: 'B.Sc. Urban Planning', duration: '4 Years', credits: 120 },
      { name: 'M.Arch Sustainable Design', duration: '2 Years', credits: 65 },
      { name: 'M.Sc. Landscape Architecture', duration: '2 Years', credits: 60 }
    ],
    researchAreas: ['Sustainable Architecture', 'Smart Cities', 'Heritage Conservation', 'Urban Design', 'Building Information Modeling'],
    facilities: ['Design Studios', 'Model Making Workshop', 'Digital Fabrication Lab', 'Architecture Library', 'Exhibition Hall'],
    description: 'The Faculty of Architecture combines creative design with technical excellence. Students work in modern studios and participate in design competitions.',
    officeHours: 'Mon-Fri: 9:00 AM - 6:00 PM',
  },
  {
    id: 'FHSS',
    title: 'Faculty of Human Studies',
    icon: <FaBookOpen className="card-icon" style={{ color: '#97266d' }} />,
    image: FhssImg,
    resourceButtonImage: FhssRImg,
    themeColor: '#97266d',
    themeColorLight: '#fff5f5',
    location: 'Block A, 2nd Floor',
    dean: 'Prof. Emma Thompson',
    email: 'fhss@campusmart.edu',
    phone: '+94 11 234 5682',
    website: 'humanstudies.campusmart.edu',
    established: 2003,
    students: 1560,
    staff: 110,
    departments: ['Psychology', 'Sociology', 'Political Science', 'International Relations', 'Economics'],
    degreePrograms: [
      { name: 'B.A. Psychology', duration: '3 Years', credits: 90 },
      { name: 'B.A. Sociology', duration: '3 Years', credits: 90 },
      { name: 'B.A. Political Science', duration: '3 Years', credits: 90 },
      { name: 'M.A. International Relations', duration: '2 Years', credits: 60 },
      { name: 'PhD in Social Sciences', duration: '3-5 Years', credits: 'Research Based' }
    ],
    researchAreas: ['Behavioral Psychology', 'Social Justice', 'Global Politics', 'Cultural Studies', 'Economic Development'],
    facilities: ['Psychology Lab', 'Social Research Center', 'Debate Hall', 'Language Lab', 'International Affairs Forum'],
    description: 'The Faculty of Human Studies explores human behavior, societies, and cultures. Our interdisciplinary approach prepares students for diverse careers.',
    officeHours: 'Mon-Fri: 8:30 AM - 5:00 PM',
  },
  {
    id: 'GSR',
    title: 'Graduate Studies & Research',
    icon: <FaGraduationCap className="card-icon" style={{ color: '#2f855a' }} />,
    image: GsrImg,
    resourceButtonImage: GsrRImg,
    themeColor: '#2f855a',
    themeColorLight: '#f0fff4',
    location: 'Block E, 4th Floor',
    dean: 'Prof. Robert Anderson',
    email: 'gsr@campusmart.edu',
    phone: '+94 11 234 5683',
    website: 'research.campusmart.edu',
    established: 2012,
    students: 890,
    staff: 60,
    departments: ['PhD Programs', 'Masters Programs', 'Research Centers', 'Postdoctoral Fellowships', 'International Collaborations'],
    degreePrograms: [
      { name: 'Master of Philosophy (MPhil)', duration: '2 Years', credits: 'Research Based' },
      { name: 'Doctor of Philosophy (PhD)', duration: '3-5 Years', credits: 'Research Based' },
      { name: 'Postdoctoral Fellowship', duration: '1-2 Years', credits: 'Research' },
      { name: 'Professional Doctorate', duration: '3-4 Years', credits: 'Research Based' }
    ],
    researchAreas: ['Interdisciplinary Research', 'Innovation Studies', 'Research Ethics', 'Scientific Writing', 'Grant Management'],
    facilities: ['Research Centers', 'Conference Halls', 'Publication Support Office', 'Ethics Committee Office', 'Collaboration Hub'],
    description: 'Graduate Studies & Research oversees all postgraduate programs and research activities. We support innovation and advanced scholarship across disciplines.',
    officeHours: 'Mon-Fri: 9:00 AM - 7:00 PM',
  },
];

// Sidebar Navigation Component
const SidebarNav = ({ activeSection, onSectionChange, themeColor }) => {
  const navItems = [
    { id: 'about', label: 'About', icon: <FaInfoCircle /> },
    { id: 'departments', label: 'Departments', icon: <FaBuilding /> },
    { id: 'degrees', label: 'Degree Programs', icon: <FaGraduationCap /> },
    { id: 'research', label: 'Research Areas', icon: <FaFlask /> },
    { id: 'facilities', label: 'Facilities', icon: <FaLaptop /> },
  ];

  return (
    <div className="info-sidebar-nav" style={{ '--theme-color': themeColor }}>
      <h3>Explore Faculty</h3>
      {navItems.map((item) => (
        <div
          key={item.id}
          className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
          onClick={() => onSectionChange(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// Main Content Area that changes based on selected section
const MainContent = ({ faculty, activeSection }) => {
  switch(activeSection) {
    case 'about':
      return (
        <div className="content-section">
          <h3>About {faculty.title}</h3>
          <div className="about-content">
            <p>{faculty.description}</p>
            <div className="about-stats">
              <div className="about-stat">
                <FaCalendarAlt />
                <div>
                  <strong>Established</strong>
                  <p>{faculty.established}</p>
                </div>
              </div>
              <div className="about-stat">
                <FaClock />
                <div>
                  <strong>Office Hours</strong>
                  <p>{faculty.officeHours}</p>
                </div>
              </div>
              <div className="about-stat">
                <FaUsers />
                <div>
                  <strong>Total Enrollment</strong>
                  <p>{faculty.students} students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'departments':
      return (
        <div className="content-section">
          <h3>Departments</h3>
          <div className="departments-grid">
            {faculty.departments.map((dept, index) => (
              <div key={index} className="department-card">
                <FaBuilding className="dept-icon" />
                <span>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'degrees':
      return (
        <div className="content-section">
          <h3>Degree Programs</h3>
          <div className="degrees-list">
            {faculty.degreePrograms.map((program, index) => (
              <div key={index} className="degree-card">
                <div className="degree-icon">
                  <FaGraduationCap />
                </div>
                <div className="degree-details">
                  <h4>{program.name}</h4>
                  <div className="degree-meta">
                    <span><FaClock /> {program.duration}</span>
                    <span><FaCertificate /> {program.credits} credits</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'research':
      return (
        <div className="content-section">
          <h3>Research Areas</h3>
          <div className="research-grid">
            {faculty.researchAreas.map((area, index) => (
              <div key={index} className="research-tag">
                <FaMicroscope className="research-icon" />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'facilities':
      return (
        <div className="content-section">
          <h3>Facilities</h3>
          <div className="facilities-grid">
            {faculty.facilities.map((facility, index) => (
              <div key={index} className="facility-card">
                <FaLaptop className="facility-icon" />
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

// Resource Hub Modal - Pass faculty info for filtering
const ResourceHubModal = ({ faculty, onClose }) => {
  return (
    <div className="resource-hub-overlay" onClick={onClose}>
      <div className="resource-hub-modal-full" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        <div className="modal-header" style={{ borderBottomColor: faculty.themeColor }}>
          <h2 style={{ color: faculty.themeColor }}>Resource Hub - {faculty.title}</h2>
          <p className="modal-subtitle">Browse and allocate resources for {faculty.title}</p>
        </div>
        <div className="resource-hub-embedded">
          <ResourceHub facultyId={faculty.id} facultyName={faculty.title} />
        </div>
      </div>
    </div>
  );
};

// Faculty Info Page Component
const FacultyInfoPage = ({ faculty, onBack }) => {
  const [showResourceHub, setShowResourceHub] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const handleViewStudents = () => {
    alert(`Viewing ${faculty.students} students in ${faculty.title}`);
  };

  const handleViewStaff = () => {
    alert(`Viewing ${faculty.staff} staff members in ${faculty.title}`);
  };

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

        <div className="faculty-info-layout">
          {/* Sidebar Navigation */}
          <SidebarNav 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            themeColor={faculty.themeColor}
          />

          {/* Main Content Area */}
          <div className="info-main-area">
            <div className="info-image">
              <img src={faculty.image} alt={faculty.title} />
            </div>

            {/* Dynamic Content Section */}
            <MainContent faculty={faculty} activeSection={activeSection} />

            {/* Quick Stats with View buttons */}
            <div className="quick-stats-section">
              <h3>Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-card-horizontal">
                  <div className="stat-icon">
                    <FaUsers />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">{faculty.students}</div>
                    <div className="stat-label">Current Students</div>
                  </div>
                  <button className="view-btn" onClick={handleViewStudents}>
                    <FaEye /> View
                  </button>
                </div>
                <div className="stat-card-horizontal">
                  <div className="stat-icon">
                    <FaUserFriends />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">{faculty.staff}</div>
                    <div className="stat-label">Staff Members</div>
                  </div>
                  <button className="view-btn" onClick={handleViewStaff}>
                    <FaEye /> View
                  </button>
                </div>
              </div>
            </div>

            {/* Resource Hub Button */}
            <div className="resource-hub-button-container">
              <button 
                className="resource-hub-image-btn"
                onClick={() => setShowResourceHub(true)}
              >
                <img src={faculty.resourceButtonImage} alt="Resource Hub" />
                <div className="btn-overlay">
                  <RiOrganizationChart className="btn-icon" />
                  <span>Access Resource Hub</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Sidebar - Contact Info */}
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
              <h3>Location</h3>
              <div className="info-detail">
                <FaMapMarkerAlt className="detail-icon" />
                <div>
                  <strong>Campus Location</strong>
                  <p>{faculty.location}</p>
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
                  </div>
                </header>

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