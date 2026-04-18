import React, { useState } from 'react';
import ResourceService from '../services/ResourceService';
import './AddResourceForm.css';

const AddResourceForm = ({ onResourceAdded, facultyId, facultyName }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'lecture_hall',
        capacity: 0,
        location: '',
        availabilityWindows: '',
        status: 'ACTIVE',
        facultyId: facultyId || '',
        facultyName: facultyName || ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            await ResourceService.createResource(formData);
            alert('Resource added successfully!');
            
            setFormData({
                name: '',
                type: 'lecture_hall',
                capacity: 0,
                location: '',
                availabilityWindows: '',
                status: 'ACTIVE',
                facultyId: facultyId || '',
                facultyName: facultyName || ''
            });
            
            if (onResourceAdded) {
                onResourceAdded();
            }
        } catch (error) {
            console.error("Error creating resource: ", error);
            alert('Failed to add resource. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-resource-form-container">
            <h3>➕ Add New Resource</h3>
            <form onSubmit={handleSubmit} className="add-resource-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Resource Name *</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g., Room 101, Projector X1"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Type *</label>
                        <select name="type" value={formData.type} onChange={handleChange}>
                            <option value="Lecture Hall">Lecture Hall</option>
                            <option value="Lab">Lab</option>
                            <option value="Meeting Room">Meeting Room</option>
                            <option value="Equipment">Equipment</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Capacity</label>
                        <input 
                            type="number" 
                            name="capacity" 
                            value={formData.capacity} 
                            onChange={handleChange} 
                            min="0"
                            placeholder="0 for equipment"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Status *</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="ACTIVE">Active</option>
                            <option value="OUT_OF_SERVICE">Out of Service</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group full-width">
                        <label>Location *</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleChange} 
                            required 
                            placeholder="e.g., Block B, Room 101"
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group full-width">
                        <label>Availability Windows *</label>
                        <input 
                            type="text" 
                            name="availabilityWindows" 
                            value={formData.availabilityWindows} 
                            onChange={handleChange} 
                            placeholder="e.g., Mon-Fri 08:00-18:00"
                            required 
                        />
                    </div>
                </div>

                {facultyName && (
                    <div className="faculty-context-note">
                        📍 Adding resource for: <strong>{facultyName}</strong>
                    </div>
                )}
                
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Resource'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddResourceForm;