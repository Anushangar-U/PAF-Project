import React, { useEffect, useMemo, useState } from 'react';
import { FaMicrochip, FaFutbol, FaCouch, FaFlask, FaMapMarkerAlt } from 'react-icons/fa';
import { RiOrganizationChart } from 'react-icons/ri';
import { MdArrowForward } from 'react-icons/md';
import ResourceService from '../services/ResourceService';
import './ResourceHub.css';

const CATEGORY_CONFIG = {
  electronics: {
    title: 'Electronics & Gadgets',
    icon: <FaMicrochip />,
    headerColor: '#f0f5fa',
  },
  sports: {
    title: 'Sports Equipment',
    icon: <FaFutbol />,
    headerColor: '#e8f5e9',
  },
  furniture: {
    title: 'Furniture & Fixtures',
    icon: <FaCouch />,
    headerColor: '#fff3e0',
  },
  lab: {
    title: 'Lab Equipment',
    icon: <FaFlask />,
    headerColor: '#f3e5f5',
  },
  other: {
    title: 'Other Resources',
    icon: <FaMicrochip />,
    headerColor: '#edf2f7',
  },
};

const CATEGORY_ORDER = ['electronics', 'sports', 'furniture', 'lab', 'other'];

const resolveCategoryKey = (type) => {
  const normalized = (type || '').toLowerCase();
  if (normalized.includes('sport')) return 'sports';
  if (normalized.includes('furn')) return 'furniture';
  if (normalized.includes('lab')) return 'lab';
  if (normalized.includes('elect') || normalized.includes('gadget') || normalized.includes('device')) {
    return 'electronics';
  }
  if (normalized) return 'other';
  return 'other';
};

const ResourceHub = () => {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    ResourceService.getAllResources()
      .then((response) => {
        if (isMounted) {
          setResources(Array.isArray(response.data) ? response.data : []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setResources([]);
          setIsLoading(false);
          setErrorMessage('Unable to load resources from the server.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const resourceCategories = useMemo(() => {
    const grouped = new Map();

    resources.forEach((resource) => {
      const key = resolveCategoryKey(resource.type);
      const config = CATEGORY_CONFIG[key] || CATEGORY_CONFIG.other;

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          title: config.title,
          icon: config.icon,
          headerColor: config.headerColor,
          items: [],
        });
      }

      const total = Number.isFinite(Number(resource.capacity)) ? Number(resource.capacity) : 0;
      grouped.get(key).items.push({
        name: resource.name || 'Unnamed Resource',
        location: resource.location || 'Unknown location',
        total,
        left: total,
      });
    });

    return CATEGORY_ORDER
      .filter((key) => grouped.has(key))
      .map((key) => grouped.get(key));
  }, [resources]);

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
        {isLoading && (
          <div className="resource-log-preview">
            <h3>Loading resources...</h3>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="resource-log-preview">
            <h3>{errorMessage}</h3>
          </div>
        )}

        {!isLoading && !errorMessage && resourceCategories.length === 0 && (
          <div className="resource-log-preview">
            <h3>No resources found yet.</h3>
          </div>
        )}

        {!isLoading && !errorMessage && resourceCategories.map((category) => (
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
                <div className="resource-item-row" key={`${category.id}-${idx}`}>
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