package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public Resource saveResource(Resource resource) {
        if (resource.getId() == null) {
            resource.setId(sequenceGeneratorService.generateSequence("resource_sequence"));
        }
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByType(type);
    }
    
    // Add new method to get resources by faculty ID
    public List<Resource> getResourcesByFacultyId(String facultyId) {
        List<Resource> allResources = resourceRepository.findAll();
        return allResources.stream()
                .filter(resource -> facultyId.equals(resource.getFacultyId()))
                .collect(Collectors.toList());
    }
    
    // Add new method to get resources by faculty name
    public List<Resource> getResourcesByFacultyName(String facultyName) {
        List<Resource> allResources = resourceRepository.findAll();
        return allResources.stream()
                .filter(resource -> facultyName.equals(resource.getFacultyName()))
                .collect(Collectors.toList());
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}