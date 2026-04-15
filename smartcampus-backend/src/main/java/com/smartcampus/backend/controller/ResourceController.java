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

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // NEW: Get resources by faculty ID
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Resource>> getResourcesByFacultyId(@PathVariable String facultyId) {
        List<Resource> resources = resourceService.getResourcesByFacultyId(facultyId);
        return ResponseEntity.ok(resources);
    }
    
    // NEW: Get resources by faculty name
    @GetMapping("/faculty/name/{facultyName}")
    public ResponseEntity<List<Resource>> getResourcesByFacultyName(@PathVariable String facultyName) {
        List<Resource> resources = resourceService.getResourcesByFacultyName(facultyName);
        return ResponseEntity.ok(resources);
    }
    
    // NEW: Alternative - filter by faculty using query parameter
    @GetMapping("/filter")
    public ResponseEntity<List<Resource>> filterResources(
            @RequestParam(required = false) String facultyId,
            @RequestParam(required = false) String facultyName) {
        if (facultyId != null && !facultyId.isEmpty()) {
            return ResponseEntity.ok(resourceService.getResourcesByFacultyId(facultyId));
        } else if (facultyName != null && !facultyName.isEmpty()) {
            return ResponseEntity.ok(resourceService.getResourcesByFacultyName(facultyName));
        } else {
            return ResponseEntity.ok(resourceService.getAllResources());
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) Integer minCapacity,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) String status) {
    
        List<Resource> resources = resourceService.getAllResources().stream()
            .filter(r -> type == null || r.getType().equalsIgnoreCase(type))
            .filter(r -> minCapacity == null || r.getCapacity() >= minCapacity)
            .filter(r -> location == null || r.getLocation().toLowerCase().contains(location.toLowerCase()))
            .filter(r -> status == null || r.getStatus().equalsIgnoreCase(status))
            .toList();
        
        return ResponseEntity.ok(resources);
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

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resourceDetails) {
        Optional<Resource> existingResource = resourceService.getResourceById(id);
        
        if (existingResource.isPresent()) {
            Resource resourceToUpdate = existingResource.get();
            resourceToUpdate.setName(resourceDetails.getName());
            resourceToUpdate.setType(resourceDetails.getType());
            resourceToUpdate.setCapacity(resourceDetails.getCapacity());
            resourceToUpdate.setLocation(resourceDetails.getLocation());
            resourceToUpdate.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
            resourceToUpdate.setStatus(resourceDetails.getStatus());
            resourceToUpdate.setFacultyId(resourceDetails.getFacultyId());
            resourceToUpdate.setFacultyName(resourceDetails.getFacultyName());
            
            Resource updatedResource = resourceService.saveResource(resourceToUpdate);
            return ResponseEntity.ok(updatedResource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        Optional<Resource> existingResource = resourceService.getResourceById(id);
        
        if (existingResource.isPresent()) {
            resourceService.deleteResource(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}