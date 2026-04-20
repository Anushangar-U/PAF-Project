package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    // Remove sequenceGeneratorService - no longer needed!

    public Resource saveResource(Resource resource) {
        // MongoDB will auto-generate ID - no need to set it
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(String id) {  // Change Long to String
        return resourceRepository.findById(id);
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }
    
    public List<Resource> getResourcesByFacultyId(String facultyId) {
        return resourceRepository.findByFacultyId(facultyId);
    }
    
    public List<Resource> getResourcesByFacultyName(String facultyName) {
        return resourceRepository.findByFacultyName(facultyName);
    }

    public void deleteResource(String id) {  // Change Long to String
        resourceRepository.deleteById(id);
    }
}