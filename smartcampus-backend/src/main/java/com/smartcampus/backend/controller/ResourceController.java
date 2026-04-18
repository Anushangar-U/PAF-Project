package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {  // String
        return resourceService.getResourceById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<Resource>> getResourcesByFacultyId(@PathVariable String facultyId) {
        List<Resource> resources = resourceService.getResourcesByFacultyId(facultyId);
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
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resourceDetails) {
        return resourceService.getResourceById(id)
            .map(existingResource -> {
                existingResource.setName(resourceDetails.getName());
                existingResource.setType(resourceDetails.getType());
                existingResource.setCapacity(resourceDetails.getCapacity());
                existingResource.setLocation(resourceDetails.getLocation());
                existingResource.setAvailabilityWindows(resourceDetails.getAvailabilityWindows());
                existingResource.setStatus(resourceDetails.getStatus());
                existingResource.setFacultyId(resourceDetails.getFacultyId());
                existingResource.setFacultyName(resourceDetails.getFacultyName());
                
                Resource updatedResource = resourceService.saveResource(existingResource);
                return ResponseEntity.ok(updatedResource);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {  // String
        return resourceService.getResourceById(id)
            .map(resource -> {
                resourceService.deleteResource(id);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}