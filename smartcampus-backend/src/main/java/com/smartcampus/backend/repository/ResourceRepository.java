package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    
    List<Resource> findByType(String type);
    
    List<Resource> findByStatus(String status);
    
    List<Resource> findByTypeAndStatus(String type, String status);
}