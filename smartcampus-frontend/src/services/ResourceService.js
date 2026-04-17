import axios from 'axios';

// This is the URL where your Spring Boot server is running!
const API_BASE_URL = 'http://localhost:9090/api/resources';

class ResourceService {
    
    // 1. GET all resources
    getAllResources() {
        return axios.get(API_BASE_URL);
    }

    // 6. GET resource by ID
    getResourceById(id) {
        return axios.get(`${API_BASE_URL}/${id}`);
    }

    // 2. GET resources filtered by type (e.g., 'lab')
    getResourcesByType(type) {
        return axios.get(`${API_BASE_URL}?type=${type}`);
    }

    // 3. POST a new resource
    createResource(resourceData) {
        return axios.post(API_BASE_URL, resourceData);
    }

    // 4. PUT update an existing resource
    updateResource(id, resourceData) {
        return axios.put(`${API_BASE_URL}/${id}`, resourceData);
    }

    // 5. DELETE a resource
    deleteResource(id) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
}

// Export a single instance of this service so we can use it anywhere
const resourceServiceInstance = new ResourceService();
export default resourceServiceInstance;