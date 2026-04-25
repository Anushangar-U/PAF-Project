package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource savedResource = resourceService.saveResource(resource);
        return new ResponseEntity<>(savedResource, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(@RequestParam(required = false) String type) {
        List<Resource> resources;
        if (type != null && !type.isEmpty()) {
            resources = resourceService.getResourcesByType(type);
        } else {
            resources = resourceService.getAllResources();
        }
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Resource>> getResourcesByFacultyId(@PathVariable String facultyId) {
        List<Resource> resources = resourceService.getResourcesByFacultyId(facultyId);
        return ResponseEntity.ok(resources);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resourceDetails) {
        Optional<Resource> existingResource = resourceService.getResourceById(id);
        
        if (existingResource.isPresent()) {
            Resource resourceToUpdate = existingResource.get();
            resourceToUpdate.setName(resourceDetails.getName());
            resourceToUpdate.setType(resourceDetails.getType());
            resourceToUpdate.setCapacity(resourceDetails.getCapacity());
            resourceToUpdate.setLocation(resourceDetails.getLocation());
            resourceToUpdate.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
            resourceToUpdate.setStatus(resourceDetails.getStatus());
            
            Resource updatedResource = resourceService.saveResource(resourceToUpdate);
            return ResponseEntity.ok(updatedResource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        Optional<Resource> existingResource = resourceService.getResourceById(id);
        
        if (existingResource.isPresent()) {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}