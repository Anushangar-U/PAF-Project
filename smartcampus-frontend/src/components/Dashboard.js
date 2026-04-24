import React, { useState } from 'react';
import { 
  FaChartLine, FaDraftingCompass, FaBookOpen, FaGraduationCap,
  FaUsers, FaSearch, FaArrowLeft, FaEnvelope, FaPhone,
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
    studentsByYear: { 'Year 1': 420, 'Year 2': 380, 'Year 3': 310, 'Year 4': 130 },
    studentsByProgram: { 'Computer Science': 450, 'Information Technology': 380, 'Data Science': 250, 'Software Engineering': 160 },
    staffList: [
      { name: 'Prof. Sarah Johnson', role: 'Dean', department: 'Administration', email: 'sarah.johnson@campusmart.edu', office: 'Block B, Room 201', phone: '+94 11 234 5601' },
      { name: 'Prof. Michael Chen', role: 'Professor', department: 'Computer Science', email: 'michael.chen@campusmart.edu', office: 'Block B, Room 305', phone: '+94 11 234 5602' },
      { name: 'Dr. Emily Watson', role: 'Senior Lecturer', department: 'Information Technology', email: 'emily.watson@campusmart.edu', office: 'Block B, Room 310', phone: '+94 11 234 5603' },
      { name: 'Prof. David Kim', role: 'Professor', department: 'Data Science', email: 'david.kim@campusmart.edu', office: 'Block B, Room 315', phone: '+94 11 234 5604' },
      { name: 'Dr. Lisa Brown', role: 'Lecturer', department: 'Software Engineering', email: 'lisa.brown@campusmart.edu', office: 'Block B, Room 320', phone: '+94 11 234 5605' },
      { name: 'Dr. James Wilson', role: 'Senior Lecturer', department: 'Cyber Security', email: 'james.wilson@campusmart.edu', office: 'Block B, Room 325', phone: '+94 11 234 5606' },
      { name: 'Prof. Maria Garcia', role: 'Professor', department: 'Computer Science', email: 'maria.garcia@campusmart.edu', office: 'Block B, Room 330', phone: '+94 11 234 5607' },
      { name: 'Dr. Robert Taylor', role: 'Lecturer', department: 'Data Science', email: 'robert.taylor@campusmart.edu', office: 'Block B, Room 335', phone: '+94 11 234 5608' },
      { name: 'Ms. Jennifer Lee', role: 'Lab Manager', department: 'Computer Science', email: 'jennifer.lee@campusmart.edu', office: 'Block B, Lab 1', phone: '+94 11 234 5609' },
      { name: 'Mr. Thomas Anderson', role: 'IT Coordinator', department: 'Administration', email: 'thomas.anderson@campusmart.edu', office: 'Block B, Room 205', phone: '+94 11 234 5610' }
    ],
    staffByDepartment: {
      'Administration': { dean: 1, coordinators: 2, total: 3 },
      'Computer Science': { professors: 3, lecturers: 5, assistants: 4, total: 12 },
      'Information Technology': { professors: 2, lecturers: 4, assistants: 3, total: 9 },
      'Data Science': { professors: 2, lecturers: 3, assistants: 2, total: 7 },
      'Software Engineering': { professors: 1, lecturers: 3, assistants: 2, total: 6 },
      'Cyber Security': { professors: 1, lecturers: 2, assistants: 2, total: 5 }
    }
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
    studentsByYear: { 'Year 1': 620, 'Year 2': 550, 'Year 3': 480, 'Year 4': 200 },
    studentsByProgram: { 'Civil Engineering': 450, 'Mechanical Engineering': 420, 'Electrical Engineering': 380, 'Chemical Engineering': 350, 'Biomedical Engineering': 250 },
    staffList: [
      { name: 'Prof. Michael Chen', role: 'Dean', department: 'Administration', email: 'michael.chen@campusmart.edu', office: 'Block C, Room 101', phone: '+94 11 234 5701' },
      { name: 'Prof. Robert Taylor', role: 'Professor', department: 'Civil Engineering', email: 'robert.taylor@campusmart.edu', office: 'Block C, Room 205', phone: '+94 11 234 5702' },
      { name: 'Dr. Sarah Williams', role: 'Senior Lecturer', department: 'Mechanical Engineering', email: 'sarah.williams@campusmart.edu', office: 'Block C, Room 210', phone: '+94 11 234 5703' },
      { name: 'Prof. James Brown', role: 'Professor', department: 'Electrical Engineering', email: 'james.brown@campusmart.edu', office: 'Block C, Room 215', phone: '+94 11 234 5704' },
      { name: 'Dr. Lisa Davis', role: 'Lecturer', department: 'Chemical Engineering', email: 'lisa.davis@campusmart.edu', office: 'Block C, Room 220', phone: '+94 11 234 5705' },
      { name: 'Prof. David Wilson', role: 'Professor', department: 'Biomedical Engineering', email: 'david.wilson@campusmart.edu', office: 'Block C, Room 225', phone: '+94 11 234 5706' },
      { name: 'Dr. Maria Rodriguez', role: 'Senior Lecturer', department: 'Civil Engineering', email: 'maria.rodriguez@campusmart.edu', office: 'Block C, Room 230', phone: '+94 11 234 5707' },
      { name: 'Mr. John Smith', role: 'Lab Manager', department: 'Mechanical Engineering', email: 'john.smith@campusmart.edu', office: 'Block C, Workshop', phone: '+94 11 234 5708' }
    ],
    staffByDepartment: {
      'Administration': { dean: 1, coordinators: 3, total: 4 },
      'Civil Engineering': { professors: 4, lecturers: 6, assistants: 4, total: 14 },
      'Mechanical Engineering': { professors: 3, lecturers: 5, assistants: 3, total: 11 },
      'Electrical Engineering': { professors: 3, lecturers: 5, assistants: 3, total: 11 },
      'Chemical Engineering': { professors: 2, lecturers: 4, assistants: 2, total: 8 },
      'Biomedical Engineering': { professors: 2, lecturers: 3, assistants: 2, total: 7 }
    }
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
    studentsByYear: { 'Year 1': 700, 'Year 2': 600, 'Year 3': 500, 'Year 4': 300 },
    studentsByProgram: { 'Marketing': 550, 'Finance': 520, 'Management': 480, 'Entrepreneurship': 350, 'International Business': 200 },
    staffList: [
      { name: 'Prof. David Williams', role: 'Dean', department: 'Administration', email: 'david.williams@campusmart.edu', office: 'Block A, Room 301', phone: '+94 11 234 5801' },
      { name: 'Prof. Susan Miller', role: 'Professor', department: 'Marketing', email: 'susan.miller@campusmart.edu', office: 'Block A, Room 305', phone: '+94 11 234 5802' },
      { name: 'Dr. Richard Johnson', role: 'Senior Lecturer', department: 'Finance', email: 'richard.johnson@campusmart.edu', office: 'Block A, Room 310', phone: '+94 11 234 5803' },
      { name: 'Prof. Patricia Lee', role: 'Professor', department: 'Management', email: 'patricia.lee@campusmart.edu', office: 'Block A, Room 315', phone: '+94 11 234 5804' },
      { name: 'Dr. Thomas Brown', role: 'Lecturer', department: 'Entrepreneurship', email: 'thomas.brown@campusmart.edu', office: 'Block A, Room 320', phone: '+94 11 234 5805' },
      { name: 'Prof. Jennifer Garcia', role: 'Professor', department: 'International Business', email: 'jennifer.garcia@campusmart.edu', office: 'Block A, Room 325', phone: '+94 11 234 5806' }
    ],
    staffByDepartment: {
      'Administration': { dean: 1, coordinators: 2, total: 3 },
      'Marketing': { professors: 2, lecturers: 4, assistants: 3, total: 9 },
      'Finance': { professors: 2, lecturers: 4, assistants: 2, total: 8 },
      'Management': { professors: 2, lecturers: 3, assistants: 2, total: 7 },
      'Entrepreneurship': { professors: 1, lecturers: 2, assistants: 2, total: 5 },
      'International Business': { professors: 1, lecturers: 2, assistants: 1, total: 4 }
    }
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
    studentsByYear: { 'Year 1': 250, 'Year 2': 230, 'Year 3': 210, 'Year 4': 200 },
    studentsByProgram: { 'Architecture': 350, 'Urban Planning': 200, 'Landscape Design': 180, 'Interior Design': 160 },
    staffList: [
      { name: 'Prof. Lisa Martinez', role: 'Dean', department: 'Administration', email: 'lisa.martinez@campusmart.edu', office: 'Block D, Room 101', phone: '+94 11 234 5901' },
      { name: 'Prof. Carlos Rodriguez', role: 'Professor', department: 'Architecture', email: 'carlos.rodriguez@campusmart.edu', office: 'Block D, Room 205', phone: '+94 11 234 5902' },
      { name: 'Dr. Anna Kim', role: 'Senior Lecturer', department: 'Urban Planning', email: 'anna.kim@campusmart.edu', office: 'Block D, Room 210', phone: '+94 11 234 5903' },
      { name: 'Prof. Mark Wilson', role: 'Professor', department: 'Landscape Design', email: 'mark.wilson@campusmart.edu', office: 'Block D, Room 215', phone: '+94 11 234 5904' },
      { name: 'Ms. Sarah Chen', role: 'Studio Manager', department: 'Architecture', email: 'sarah.chen@campusmart.edu', office: 'Block D, Studio 1', phone: '+94 11 234 5905' }
    ],
    staffByDepartment: {
      'Administration': { dean: 1, coordinators: 1, total: 2 },
      'Architecture': { professors: 2, lecturers: 4, assistants: 3, total: 9 },
      'Urban Planning': { professors: 1, lecturers: 2, assistants: 2, total: 5 },
      'Landscape Design': { professors: 1, lecturers: 2, assistants: 1, total: 4 },
      'Interior Design': { professors: 1, lecturers: 2, assistants: 1, total: 4 },
      'Construction Management': { professors: 1, lecturers: 1, assistants: 1, total: 3 }
    }
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
    studentsByYear: { 'Year 1': 520, 'Year 2': 480, 'Year 3': 560 },
    studentsByProgram: { 'Psychology': 450, 'Sociology': 380, 'Political Science': 370, 'International Relations': 360 },
    staffList: [
      { name: 'Prof. Emma Thompson', role: 'Dean', department: 'Administration', email: 'emma.thompson@campusmart.edu', office: 'Block A, Room 201', phone: '+94 11 234 6001' },
      { name: 'Prof. Daniel White', role: 'Professor', department: 'Psychology', email: 'daniel.white@campusmart.edu', office: 'Block A, Room 305', phone: '+94 11 234 6002' },
      { name: 'Dr. Olivia Black', role: 'Senior Lecturer', department: 'Sociology', email: 'olivia.black@campusmart.edu', office: 'Block A, Room 310', phone: '+94 11 234 6003' },
      { name: 'Prof. William Green', role: 'Professor', department: 'Political Science', email: 'william.green@campusmart.edu', office: 'Block A, Room 315', phone: '+94 11 234 6004' },
      { name: 'Dr. Sophia Brown', role: 'Lecturer', department: 'International Relations', email: 'sophia.brown@campusmart.edu', office: 'Block A, Room 320', phone: '+94 11 234 6005' },
      { name: 'Prof. James Taylor', role: 'Professor', department: 'Economics', email: 'james.taylor@campusmart.edu', office: 'Block A, Room 325', phone: '+94 11 234 6006' }
    ],
    staffByDepartment: {
      'Administration': { dean: 1, coordinators: 2, total: 3 },
      'Psychology': { professors: 3, lecturers: 5, assistants: 4, total: 12 },
      'Sociology': { professors: 2, lecturers: 4, assistants: 3, total: 9 },
      'Political Science': { professors: 2, lecturers: 3, assistants: 2, total: 7 },
      'International Relations': { professors: 2, lecturers: 3, assistants: 2, total: 7 },
      'Economics': { professors: 2, lecturers: 3, assistants: 2, total: 7 }
    }
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
    studentsByYear: { 'Masters': 550, 'PhD': 280, 'Postdoc': 60 },
    studentsByProgram: { 'MPhil': 350, 'PhD': 280, 'Postdoc': 60, 'Professional Doctorate': 200 },
    staffList: [
      { name: 'Prof. Robert Anderson', role: 'Dean', department: 'Administration', email: 'robert.anderson@campusmart.edu', office: 'Block E, Room 401', phone: '+94 11 234 6101' },
      { name: 'Prof. Elizabeth Taylor', role: 'Professor', department: 'Research Centers', email: 'elizabeth.taylor@campusmart.edu', office: 'Block E, Room 405', phone: '+94 11 234 6102' },
      { name: 'Dr. Christopher Lee', role: 'Research Coordinator', department: 'PhD Programs', email: 'christopher.lee@campusmart.edu', office: 'Block E, Room 410', phone: '+94 11 234 6103' },
      { name: 'Prof. Margaret Wilson', role: 'Professor', department: 'Masters Programs', email: 'margaret.wilson@campusmart.edu', office: 'Block E, Room 415', phone: '+94 11 234 6104' },
      { name: 'Dr. Andrew Brown', role: 'Postdoc Coordinator', department: 'Postdoctoral Fellowships', email: 'andrew.brown@campusmart.edu', office: 'Block E, Room 420', phone: '+94 11 234 6105' }
    ],
    staffByDepartment: {
      'Administration': { dean: 1, coordinators: 2, total: 3 },
      'PhD Programs': { professors: 3, coordinators: 4, total: 7 },
      'Masters Programs': { professors: 2, coordinators: 3, total: 5 },
      'Research Centers': { directors: 4, researchers: 8, total: 12 },
      'Postdoctoral Fellowships': { coordinators: 2, fellows: 10, total: 12 },
      'International Collaborations': { directors: 2, coordinators: 3, total: 5 }
    }
  },
];

// Student List Modal
const StudentListModal = ({ faculty, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal-large" onClick={(e) => e.stopPropagation()} style={{ '--theme-color': faculty.themeColor }}>
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="popup-header">
          <FaUsers className="popup-icon" />
          <h2>Students - {faculty.title}</h2>
        </div>
        <div className="popup-content">
          <div className="stats-summary">
            <div className="total-stat">
              <span className="total-number">{faculty.students}</span>
              <span className="total-label">Total Students</span>
            </div>
          </div>
          
          <div className="student-section">
            <h4>Students by Year</h4>
            <div className="stats-bars">
              {Object.entries(faculty.studentsByYear).map(([year, count]) => (
                <div key={year} className="stat-bar">
                  <div className="stat-bar-label">{year}</div>
                  <div className="stat-bar-track">
                    <div 
                      className="stat-bar-fill" 
                      style={{ width: `${(count / faculty.students) * 100}%`, backgroundColor: faculty.themeColor }}
                    ></div>
                  </div>
                  <div className="stat-bar-value">{count}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="student-section">
            <h4>Students by Program</h4>
            <div className="program-list">
              {Object.entries(faculty.studentsByProgram).map(([program, count]) => (
                <div key={program} className="program-item">
                  <span className="program-name">{program}</span>
                  <span className="program-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Staff List Modal
const StaffListModal = ({ faculty, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-modal-large" onClick={(e) => e.stopPropagation()} style={{ '--theme-color': faculty.themeColor }}>
        <button className="popup-close" onClick={onClose}>×</button>
        <div className="popup-header">
          <FaUserFriends className="popup-icon" />
          <h2>Staff - {faculty.title}</h2>
        </div>
        <div className="popup-content">
          <div className="stats-summary">
            <div className="total-stat">
              <span className="total-number">{faculty.staff}</span>
              <span className="total-label">Total Staff</span>
            </div>
          </div>
          
          <div className="staff-section">
            <h4>Staff by Department</h4>
            <div className="staff-department-grid">
              {Object.entries(faculty.staffByDepartment).map(([dept, data]) => (
                <div key={dept} className="department-stats-card">
                  <h5>{dept}</h5>
                  <div className="role-stats">
                    {data.dean !== undefined && <span>👨‍💼 Dean: {data.dean}</span>}
                    {data.professors !== undefined && <span>👨‍🏫 Professors: {data.professors}</span>}
                    {data.lecturers !== undefined && <span>📚 Lecturers: {data.lecturers}</span>}
                    {data.assistants !== undefined && <span>👨‍🔬 Assistants: {data.assistants}</span>}
                    {data.coordinators !== undefined && <span>📋 Coordinators: {data.coordinators}</span>}
                    {data.researchers !== undefined && <span>🔬 Researchers: {data.researchers}</span>}
                    {data.directors !== undefined && <span>🎯 Directors: {data.directors}</span>}
                    {data.fellows !== undefined && <span>🎓 Fellows: {data.fellows}</span>}
                    <span className="total-count">Total: {data.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="staff-section">
            <h4>Staff Members List</h4>
            <div className="staff-list">
              {faculty.staffList.map((staff, index) => (
                <div key={index} className="staff-card">
                  <div className="staff-info">
                    <strong>{staff.name}</strong>
                    <span className="staff-role" style={{ backgroundColor: `${faculty.themeColor}20`, color: faculty.themeColor }}>{staff.role}</span>
                    <span className="staff-dept">{staff.department}</span>
                  </div>
                  <div className="staff-contact">
                    <span>📧 {staff.email}</span>
                    <span>📍 {staff.office}</span>
                    <span>📞 {staff.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="info-sidebar-nav" style={{ '--theme-color': themeColor, backgroundColor: themeColor }}>
      <h3 style={{ color: themeColor === '#dd6b20' ? '#dd6b20' : '#fff' }}>Explore Faculty</h3>
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
          <h3 style={{ color: faculty.themeColor }}>About {faculty.title}</h3>
          <div className="about-content">
            <p>{faculty.description}</p>
            <div className="about-stats">
              <div className="about-stat" style={{ backgroundColor: faculty.themeColorLight }}>
                <FaCalendarAlt style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Established</strong>
                  <p>{faculty.established}</p>
                </div>
              </div>
              <div className="about-stat" style={{ backgroundColor: faculty.themeColorLight }}>
                <FaClock style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Office Hours</strong>
                  <p>{faculty.officeHours}</p>
                </div>
              </div>
              <div className="about-stat" style={{ backgroundColor: faculty.themeColorLight }}>
                <FaUsers style={{ color: faculty.themeColor }} />
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
          <h3 style={{ color: faculty.themeColor }}>Departments</h3>
          <div className="departments-grid">
            {faculty.departments.map((dept, index) => (
              <div key={index} className="department-card" style={{ backgroundColor: faculty.themeColorLight }}>
                <FaBuilding className="dept-icon" style={{ color: faculty.themeColor }} />
                <span>{dept}</span>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'degrees':
      return (
        <div className="content-section">
          <h3 style={{ color: faculty.themeColor }}>Degree Programs</h3>
          <div className="degrees-list">
            {faculty.degreePrograms.map((program, index) => (
              <div key={index} className="degree-card" style={{ backgroundColor: faculty.themeColorLight }}>
                <div className="degree-icon" style={{ color: faculty.themeColor }}>
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
          <h3 style={{ color: faculty.themeColor }}>Research Areas</h3>
          <div className="research-grid">
            {faculty.researchAreas.map((area, index) => (
              <div key={index} className="research-tag" style={{ backgroundColor: faculty.themeColorLight }}>
                <FaMicroscope className="research-icon" style={{ color: faculty.themeColor }} />
                <span>{area}</span>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'facilities':
      return (
        <div className="content-section">
          <h3 style={{ color: faculty.themeColor }}>Facilities</h3>
          <div className="facilities-grid">
            {faculty.facilities.map((facility, index) => (
              <div key={index} className="facility-card" style={{ backgroundColor: faculty.themeColorLight }}>
                <FaLaptop className="facility-icon" style={{ color: faculty.themeColor }} />
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
          <p className="modal-subtitle">Browse and request resources for {faculty.title}</p>
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
  const [showStudentList, setShowStudentList] = useState(false);
  const [showStaffList, setShowStaffList] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const handleViewStudents = () => {
    setShowStudentList(true);
  };

  const handleViewStaff = () => {
    setShowStaffList(true);
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
          <SidebarNav 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            themeColor={faculty.themeColor}
          />

          <div className="info-main-area">
            <div className="info-image">
              <img src={faculty.image} alt={faculty.title} />
            </div>

            <MainContent faculty={faculty} activeSection={activeSection} />

            <div className="quick-stats-section">
              <h3 style={{ color: faculty.themeColor }}>Quick Stats</h3>
              <div className="stats-grid">
                <div className="stat-card-horizontal" style={{ backgroundColor: faculty.themeColorLight }}>
                  <div className="stat-icon" style={{ color: faculty.themeColor }}>
                    <FaUsers />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">{faculty.students}</div>
                    <div className="stat-label">Current Students</div>
                  </div>
                  <button className="view-btn" style={{ borderColor: faculty.themeColor, color: faculty.themeColor }} onClick={handleViewStudents}>
                    <FaEye /> View
                  </button>
                </div>
                <div className="stat-card-horizontal" style={{ backgroundColor: faculty.themeColorLight }}>
                  <div className="stat-icon" style={{ color: faculty.themeColor }}>
                    <FaUserFriends />
                  </div>
                  <div className="stat-details">
                    <div className="stat-number">{faculty.staff}</div>
                    <div className="stat-label">Staff Members</div>
                  </div>
                  <button className="view-btn" style={{ borderColor: faculty.themeColor, color: faculty.themeColor }} onClick={handleViewStaff}>
                    <FaEye /> View
                  </button>
                </div>
              </div>
            </div>

            <div className="resource-hub-button-container">
              <button 
                className="resource-hub-image-btn"
                onClick={() => setShowResourceHub(true)}
              >
                <img src={faculty.resourceButtonImage} alt="Resource Hub" />
                <div className="btn-overlay" style={{ background: `linear-gradient(135deg, ${faculty.themeColor}cc, ${faculty.themeColor}99)` }}>
                  <RiOrganizationChart className="btn-icon" />
                  <span>Access Resource Hub</span>
                </div>
              </button>
            </div>
          </div>

          <div className="info-sidebar">
            <div className="info-card">
              <h3 style={{ color: faculty.themeColor }}>Contact Information</h3>
              <div className="info-detail">
                <FaUserTie className="detail-icon" style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Dean</strong>
                  <p>{faculty.dean}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaEnvelope className="detail-icon" style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Email</strong>
                  <p>{faculty.email}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaPhone className="detail-icon" style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Phone</strong>
                  <p>{faculty.phone}</p>
                </div>
              </div>
              <div className="info-detail">
                <FaGlobe className="detail-icon" style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Website</strong>
                  <p>{faculty.website}</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3 style={{ color: faculty.themeColor }}>Location</h3>
              <div className="info-detail">
                <FaMapMarkerAlt className="detail-icon" style={{ color: faculty.themeColor }} />
                <div>
                  <strong>Campus Location</strong>
                  <p>{faculty.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStudentList && (
        <StudentListModal faculty={faculty} onClose={() => setShowStudentList(false)} />
      )}
      {showStaffList && (
        <StaffListModal faculty={faculty} onClose={() => setShowStaffList(false)} />
      )}
      {showResourceHub && (
        <ResourceHubModal faculty={faculty} onClose={() => setShowResourceHub(false)} />
      )}
    </>
  );
};

const Dashboard = ({ renderContent }) => {
  const activeTab = 'faculties';
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
        <main className="main-content">
          <FacultyInfoPage faculty={selectedFaculty} onBack={handleBack} />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main className="main-content">
        {!renderContent ? (
          <>
            {activeTab === 'faculties' && (
              <>
                {/* Search Bar - Clean, no header */}
                <div className="search-bar-wrapper">
                  <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by faculty name or code (e.g., FOC, Engineering)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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