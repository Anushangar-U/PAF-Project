package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceControllerTest {

    @Mock
    private ResourceService resourceService;

    @InjectMocks
    private ResourceController resourceController;

    @Test
    void createResource_returnsCreatedResponse() {
        Resource request = buildResource("Main Lab", "LAB", 40, "A1", "08:00-18:00", "AVAILABLE");
        when(resourceService.saveResource(request)).thenReturn(request);

        ResponseEntity<Resource> response = resourceController.createResource(request);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("Main Lab", response.getBody().getName());
        verify(resourceService).saveResource(request);
    }

    @Test
    void getAllResources_withoutType_returnsAll() {
        List<Resource> resources = List.of(buildResource("R1", "ROOM", 10, "L1", "Any", "AVAILABLE"));
        when(resourceService.getAllResources()).thenReturn(resources);

        ResponseEntity<List<Resource>> response = resourceController.getAllResources(null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(resourceService).getAllResources();
    }

    @Test
    void getAllResources_withType_filtersByType() {
        List<Resource> resources = List.of(buildResource("Lab X", "LAB", 20, "L2", "Any", "AVAILABLE"));
        when(resourceService.getResourcesByType("LAB")).thenReturn(resources);

        ResponseEntity<List<Resource>> response = resourceController.getAllResources("LAB");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("LAB", response.getBody().get(0).getType());
        verify(resourceService).getResourcesByType("LAB");
    }

    @Test
    void updateResource_whenExists_returnsUpdated() {
        Resource existing = buildResource("Old", "LAB", 10, "L1", "Any", "AVAILABLE");
        existing.setId("15");

        Resource incoming = buildResource("New", "LAB", 25, "L2", "09:00-17:00", "IN_USE");

        when(resourceService.getResourceById("15")).thenReturn(Optional.of(existing));
        when(resourceService.saveResource(existing)).thenReturn(existing);

        ResponseEntity<Resource> response = resourceController.updateResource("15", incoming);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("New", response.getBody().getName());
        assertEquals(25, response.getBody().getCapacity());
        assertEquals("IN_USE", response.getBody().getStatus());
        verify(resourceService).saveResource(existing);
    }

    @Test
    void updateResource_whenMissing_returnsNotFound() {
        Resource incoming = buildResource("Any", "LAB", 1, "L", "Any", "AVAILABLE");
        when(resourceService.getResourceById("404")).thenReturn(Optional.empty());

        ResponseEntity<Resource> response = resourceController.updateResource("404", incoming);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void deleteResource_whenExists_returnsNoContent() {
        Resource existing = buildResource("Keep", "LAB", 5, "L1", "Any", "AVAILABLE");
        when(resourceService.getResourceById("12")).thenReturn(Optional.of(existing));

        ResponseEntity<Void> response = resourceController.deleteResource("12");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(resourceService).deleteResource("12");
    }

    @Test
    void deleteResource_whenMissing_returnsNotFound() {
        when(resourceService.getResourceById("500")).thenReturn(Optional.empty());

        ResponseEntity<Void> response = resourceController.deleteResource("500");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    private Resource buildResource(String name, String type, int capacity, String location,
                                   String availabilityWindows, String status) {
        Resource resource = new Resource();
        resource.setName(name);
        resource.setType(type);
        resource.setCapacity(capacity);
        resource.setLocation(location);
        resource.setAvailabilityWindows(availabilityWindows);
        resource.setStatus(status);
        return resource;
    }
}
