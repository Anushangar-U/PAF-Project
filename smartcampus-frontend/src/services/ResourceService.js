import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/resources';

class ResourceService {
    
    // 1. GET all resources
    getAllResources() {
        return axios.get(API_BASE_URL);
    }

    // 2. GET resources filtered by type (e.g., 'lab')
    getResourcesByType(type) {
        return axios.get(`${API_BASE_URL}?type=${type}`);
    }
    
    // 3. NEW: GET resources by faculty ID (e.g., 'FOC', 'FOE')
    getResourcesByFacultyId(facultyId) {
        return axios.get(`${API_BASE_URL}/faculty/${facultyId}`);
    }
    
    // 4. NEW: GET resources by faculty name (e.g., 'Faculty of Computing')
    getResourcesByFacultyName(facultyName) {
        return axios.get(`${API_BASE_URL}/faculty/name/${encodeURIComponent(facultyName)}`);
    }
    
    // 5. NEW: GET resources with multiple filters (faculty, type, etc.)
    filterResources(filters) {
        const params = new URLSearchParams();
        if (filters.facultyId) params.append('facultyId', filters.facultyId);
        if (filters.facultyName) params.append('facultyName', filters.facultyName);
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        
        const queryString = params.toString();
        const url = queryString ? `${API_BASE_URL}/filter?${queryString}` : API_BASE_URL;
        return axios.get(url);
    }

    // 6. POST a new resource
    createResource(resourceData) {
        return axios.post(API_BASE_URL, resourceData);
    }

    // 7. PUT update an existing resource
    updateResource(id, resourceData) {
        return axios.put(`${API_BASE_URL}/${id}`, resourceData);
    }

    // 8. DELETE a resource
    deleteResource(id) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
}

// Export a single instance of this service so we can use it anywhere
const resourceServiceInstance = new ResourceService();
export default resourceServiceInstance;