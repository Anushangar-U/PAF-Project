import React from 'react';
import { FaMicrochip, FaFutbol, FaCouch, FaFlask, FaMapMarkerAlt } from 'react-icons/fa';
import { RiOrganizationChart } from 'react-icons/ri';
import { MdArrowForward } from 'react-icons/md';
import './ResourceHub.css';

const resourceCategories = [
  {
    id: 'electronics',
    title: 'Electronics & Gadgets',
    icon: <FaMicrochip />,
    headerColor: '#f0f5fa',
    items: [
      { name: 'Laptop Dell XPS', location: 'IT Hub', total: 28, left: 20 },
      { name: 'Projector Epson', location: 'Media Center', total: 14, left: 9 },
      { name: 'VR Headset', location: 'Innovation Lab', total: 12, left: 8 },
      { name: 'Wireless Mic Kit', location: 'Auditorium', total: 18, left: 11 },
    ]
  },
  {
    id: 'sports',
    title: 'Sports Equipment',
    icon: <FaFutbol />,
    headerColor: '#e8f5e9',
    items: [
      { name: 'Basketball', location: 'Gym', total: 30, left: 20 },
      { name: 'Tennis Racket', location: 'Tennis Court', total: 18, left: 13 },
      { name: 'Yoga Mat', location: 'Wellness Center', total: 40, left: 25 },
      { name: 'Cricket Set', location: 'Sports Complex', total: 8, left: 6 },
    ]
  },
  {
    id: 'furniture',
    title: 'Furniture & Fixtures',
    icon: <FaCouch />,
    headerColor: '#fff3e0',
    items: [
      { name: 'Whiteboard Mobile', location: 'Classrooms', total: 35, left: 23 },
      { name: 'Study Table', location: 'Library', total: 80, left: 52 },
      { name: 'Ergonomic Chair', location: 'CS Dept', total: 110, left: 68 },
    ]
  },
  {
    id: 'lab',
    title: 'Lab Equipment',
    icon: <FaFlask />,
    headerColor: '#f3e5f5',
    items: [
      { name: '3D Printer', location: 'MakerSpace', total: 8, left: 5 },
      { name: 'Oscilloscope', location: 'Electronics Lab', total: 15, left: 9 },
      { name: 'Microscope Set', location: 'Bio Lab', total: 25, left: 17 },
    ]
  },
];

const ResourceHub = () => {
  return (
    <div className="resource-hub-container">
      <header className="top-bar">
        <div className="page-header-info">
          <div className="page-title">
            <RiOrganizationChart className="page-title-icon" />
            <h1>Resource Hub</h1>
          </div>
          <p className="page-subtitle">Categorized equipment & allocation tracking</p>
        </div>
      </header>

      <div className="resource-grid">
        {resourceCategories.map((category) => (
          <div className="resource-category-card" key={category.id}>
            <div 
              className="category-header" 
              style={{ backgroundColor: category.headerColor }}
            >
              <div className="category-icon" style={{ color: '#2d3748' }}>{category.icon}</div>
              <h3>{category.title}</h3>
            </div>
            
            <div className="category-items-list">
              {category.items.map((item, idx) => (
                <div className="resource-item-row" key={idx}>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <span className="item-location">
                      <FaMapMarkerAlt className="pin-icon" /> {item.location} | Total: {item.total}
                    </span>
                  </div>
                  <div className="item-action">
                    <span className="item-left-count"><strong>{item.left}</strong> left</span>
                    <button className="btn-allocate-small">
                      <MdArrowForward /> Allocate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="resource-log-preview">
        <h3><RiOrganizationChart /> Resource Allocation Log</h3>
      </div>
    </div>
  );
};

export default ResourceHub;