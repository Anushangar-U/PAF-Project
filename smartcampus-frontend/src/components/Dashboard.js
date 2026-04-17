import React, { useState } from 'react';
import { 
  FaUniversity, FaChartLine, FaDraftingCompass, FaBookOpen, FaGraduationCap,
  FaChalkboardTeacher, FaUsers, FaUserTie, FaMicrochip, FaMicroscope, FaCogs
} from 'react-icons/fa';
import { MdOutlineComputer, MdArrowForward } from 'react-icons/md';
import { BsGearFill, BsCpuFill } from 'react-icons/bs';
import { RiOrganizationChart } from 'react-icons/ri';
import ResourceHub from './ResourceHub';
import MyBookings from './MyBookings';
import './Dashboard.css';

// Mock data structured similarly to the user's dashboard image
const facultiesData = [
  {
    id: 'FOC',
    title: 'Faculty of Computing',
    icon: <MdOutlineComputer className="card-icon" style={{ color: '#2b6cb0' }} />,
    themeColor: '#38a169',
    dean: 'Prof. Anusha Perera',
    students: 1850,
    staff: 120,
    departments: 'Computer Science • Software Engineering • Data Science • Cyber Security • IT',
    keyResources: ['Laptop Labs', 'AI Servers', 'VR Headsets', 'Smart Classrooms'],
    resourceIcon: <FaMicrochip />
  },
  {
    id: 'FOE',
    title: 'Faculty of Engineering',
    icon: <BsCpuFill className="card-icon" style={{ color: '#2b6cb0' }} />,
    themeColor: '#2b6cb0',
    dean: 'Dr. Nimal Rajapakse',
    students: 2100,
    staff: 145,
    departments: 'Civil Engineering • Mechanical Eng • Electrical Eng • Robotics • Mechatronics',
    keyResources: ['3D Printers', 'Workshop Tools', 'CAD Workstations', 'Oscilloscopes'],
    resourceIcon: <FaCogs />
  },
  {
    id: 'FOB',
    title: 'Faculty of Business',
    icon: <FaChartLine className="card-icon" style={{ color: '#2b6cb0' }} />,
    themeColor: '#dd6b20',
    dean: 'Prof. Dilini Fernando',
    students: 1750,
    staff: 95,
    departments: 'Finance • Marketing • HRM • Business Analytics • International Business',
    keyResources: ['Case Study Rooms', 'Trading Simulators', 'Projectors', 'Collaboration Hubs'],
    resourceIcon: <FaChalkboardTeacher />
  },
  {
    id: 'FOA',
    title: 'Faculty of Architecture',
    icon: <FaDraftingCompass className="card-icon" style={{ color: '#2b6cb0' }} />,
    themeColor: '#805ad5',
    dean: 'Archt. Sanjaya Wickrama',
    students: 950,
    staff: 78,
    departments: 'Architecture • Landscape • Urban Design • Quantity Surveying',
    keyResources: ['Drafting Studios', 'Model Making Lab', 'Plotters', 'Design Suites'],
    resourceIcon: <FaDraftingCompass />
  },
  {
    id: 'FHSS',
    title: 'Faculty of Humanities & Social Sciences',
    icon: <FaBookOpen className="card-icon" style={{ color: '#2b6cb0' }} />,
    themeColor: '#97266d',
    dean: 'Prof. Kamalini Weerakoon',
    students: 1200,
    staff: 110,
    departments: 'Languages • History • Sociology • Media Studies',
    keyResources: ['Language Labs', 'Recording Studios', 'Audio Editing Room', 'Archive Library'],
    resourceIcon: <FaBookOpen />
  },
  {
    id: 'GSR',
    title: 'Graduate Studies & Research',
    icon: <FaGraduationCap className="card-icon" style={{ color: '#2b6cb0' }} />,
    themeColor: '#2f855a',
    dean: 'Prof. Mahinda Seneviratne',
    students: 680,
    staff: 65,
    departments: 'Ph.D. Programs • MPhil • Specialized Master’s',
    keyResources: ['Research Cubicles', 'High-Perf Computing', 'Lab Incubators', 'Conferencing'],
    resourceIcon: <FaMicroscope />
  },
];

const Dashboard = ({ renderContent }) => {
  const [activeTab, setActiveTab] = useState('faculties');

  return (
    <div className="dashboard-layout">
      {/* Sidebar Layout */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaUniversity className="logo-icon" />
          <div className="brand-text">
            <h2>CampusSmart</h2>
            <p>faculties + resources</p>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          <div 
            className={`menu-item ${activeTab === 'faculties' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculties')}
          >
            <FaChalkboardTeacher /> Faculties
          </div>
          <div 
            className={`menu-item ${activeTab === 'resource-hub' ? 'active' : ''}`}
            onClick={() => setActiveTab('resource-hub')}
          >
            <RiOrganizationChart /> Resource Hub
          </div>
          <div 
            className={`menu-item ${activeTab === 'my-bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-bookings')}
          >
            <FaBookOpen /> My Bookings
          </div>
          <div className="menu-item small" style={{ marginTop: 'auto', opacity: 0.5 }}>
            <BsGearFill /> smart allocation
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* If the current view is just the Faculties Dashboard or Resource Hub */}
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
                    <span><FaUsers /> 8530 Students</span>
                  </div>
                </header>

                {/* Grid display of faculties */}
                <div className="faculties-grid">
                  {facultiesData.map((faculty) => (
                    <div className="faculty-card" key={faculty.id} style={{ '--theme-color': faculty.themeColor }}>
                      
                      <div className="card-header">
                        {faculty.icon}
                        <div className="card-title-group">
                          <h3>{faculty.title}</h3>
                          <p>{faculty.id}</p>
                        </div>
                      </div>

                      <div className="dean-info">
                        <FaUserTie /> Dean: {faculty.dean}
                      </div>

                      <div className="stats-row">
                        <div className="stat-item"><FaUsers /> {faculty.students} students</div>
                        <div className="stat-item"><FaChalkboardTeacher /> {faculty.staff} staff</div>
                      </div>

                      <div className="departments">
                        <strong><RiOrganizationChart /> Departments:</strong>
                        {faculty.departments}
                      </div>

                      <div className="resources-section">
                        <strong><BsGearFill /> Key Resources:</strong>
                        <div className="resource-tags">
                          {faculty.keyResources.map((res, i) => (
                            <div className="resource-tag" key={i}>
                              <span>📌</span> {res}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card-actions">
                        <button className="btn-allocate">
                          <MdArrowForward /> Allocate Resource to {faculty.id}
                        </button>
                        <button className="btn-stats">Quick Stats</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'resource-hub' && (
              <ResourceHub />
            )}

            {activeTab === 'my-bookings' && (
              <MyBookings />
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