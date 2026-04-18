import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/resources';

class ResourceService {
        // Get resource by ID (needed for booking lookups)
        getResourceById(id) {
            return axios.get(`${API_BASE_URL}/${id}`);
        }
    
    getAllResources() {
        return axios.get(API_BASE_URL);
    }

    getResourcesByType(type) {
        return axios.get(`${API_BASE_URL}?type=${type}`);
    }
    
    getResourcesByFacultyId(facultyId) {
        return axios.get(`${API_BASE_URL}/faculty/${facultyId}`);
    }
    
    getResourcesByFacultyName(facultyName) {
        return axios.get(`${API_BASE_URL}/faculty/name/${encodeURIComponent(facultyName)}`);
    }

    createResource(resourceData) {
        // Don't send ID - MongoDB will generate it
        const { id, ...dataWithoutId } = resourceData;
        return axios.post(API_BASE_URL, dataWithoutId);
    }

    updateResource(id, resourceData) {
        return axios.put(`${API_BASE_URL}/${id}`, resourceData);
    }

    deleteResource(id) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
}

const resourceServiceInstance = new ResourceService();
export default resourceServiceInstance;