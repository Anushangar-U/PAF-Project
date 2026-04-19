package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceService resourceService;

    @Test
    void saveResource_delegatesToRepository() {
        Resource resource = new Resource();
        resource.setName("Lab A");
        when(resourceRepository.save(resource)).thenReturn(resource);

        Resource result = resourceService.saveResource(resource);

        assertSame(resource, result);
        verify(resourceRepository).save(resource);
    }

    @Test
    void getAllResources_returnsRepositoryValues() {
        List<Resource> expected = List.of(new Resource(), new Resource());
        when(resourceRepository.findAll()).thenReturn(expected);

        List<Resource> result = resourceService.getAllResources();

        assertEquals(2, result.size());
        assertSame(expected, result);
        verify(resourceRepository).findAll();
    }

    @Test
    void getResourceById_returnsOptionalFromRepository() {
        Resource resource = new Resource();
        resource.setId("7");
        when(resourceRepository.findById("7")).thenReturn(Optional.of(resource));

        Optional<Resource> result = resourceService.getResourceById("7");

        assertTrue(result.isPresent());
        assertEquals("7", result.get().getId());
        verify(resourceRepository).findById("7");
    }

    @Test
    void getResourcesByType_filtersByType() {
        Resource resource = new Resource();
        resource.setType("LAB");
        List<Resource> expected = List.of(resource);
        when(resourceRepository.findByType("LAB")).thenReturn(expected);

        List<Resource> result = resourceService.getResourcesByType("LAB");

        assertEquals(1, result.size());
        assertSame(expected, result);
        verify(resourceRepository).findByType("LAB");
    }

    @Test
    void deleteResource_callsRepositoryDeleteById() {
        resourceService.deleteResource("99");

        verify(resourceRepository).deleteById("99");
    }
}
