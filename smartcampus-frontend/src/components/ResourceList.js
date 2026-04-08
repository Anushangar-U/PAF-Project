import React, { useState, useEffect } from 'react';
import ResourceService from '../services/ResourceService';
import AddResourceForm from './AddResourceForm';

const ResourceList = () => {
    // State to hold the list of resources returned from the database
    const [resources, setResources] = useState([]);

    // useEffect runs automatically when this page first loads
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = () => {
        // Call the service we wrote yesterday!
        ResourceService.getAllResources()
            .then((response) => {
                setResources(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2 className="text-center">Facilities & Assets Catalogue</h2>
            
            {/* The new form component! Pass fetchResources so the form can trigger a table refresh when a new item is added */}
            <AddResourceForm onResourceAdded={fetchResources} />
            
            <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Capacity</th>
                        <th>Location</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Loop through our resources array and create a table row for each one */}
                    {resources.map(resource => (
                        <tr key={resource.id}>
                            <td>{resource.id}</td>
                            <td>{resource.name}</td>
                            <td>{resource.type}</td>
                            <td>{resource.capacity > 0 ? resource.capacity : 'N/A'}</td>
                            <td>{resource.location}</td>
                            <td>{resource.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResourceList;