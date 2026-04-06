import React, { useState } from 'react';
import ResourceService from '../services/ResourceService';

const AddResourceForm = ({ onResourceAdded }) => {
    // State to hold the form data
    const [formData, setFormData] = useState({
        name: '',
        type: 'lecture_hall', // Default value
        capacity: 0,
        location: '',
        availabilityWindows: '',
        status: 'ACTIVE' // Default value
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        
        // Call the POST service we wrote earlier
        ResourceService.createResource(formData)
            .then((response) => {
                alert('Resource added successfully!');
                
                // Clear the form
                setFormData({
                    name: '',
                    type: 'lecture_hall',
                    capacity: 0,
                    location: '',
                    availabilityWindows: '',
                    status: 'ACTIVE'
                });
                
                // Tell the parent component (ResourceList) to refresh the table
                if (onResourceAdded) {
                    onResourceAdded();
                }
            })
            .catch((error) => {
                console.error("Error creating resource: ", error);
                alert('Failed to add resource. Please check the console.');
            });
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
            <h3>Add New Resource</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name: </label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Type: </label>
                    <select name="type" value={formData.type} onChange={handleChange} style={{ marginLeft: '10px' }}>
                        <option value="lecture_hall">Lecture Hall</option>
                        <option value="lab">Lab</option>
                        <option value="meeting_room">Meeting Room</option>
                        <option value="equipment">Equipment</option>
                    </select>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Capacity: </label>
                    <input 
                        type="number" 
                        name="capacity" 
                        value={formData.capacity} 
                        onChange={handleChange} 
                        min="0"
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Location: </label>
                    <input 
                        type="text" 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Availability Windows: </label>
                    <input 
                        type="text" 
                        name="availabilityWindows" 
                        value={formData.availabilityWindows} 
                        onChange={handleChange} 
                        placeholder="e.g., 08:00-18:00"
                        required 
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                
                <button type="submit" style={{ padding: '5px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Add Resource
                </button>
            </form>
        </div>
    );
};

export default AddResourceForm;