package com.smartcampus.backend.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resources")
public class Resource {

    @Id
    private Long id;

    private String name;

    private String type; 

    private int capacity; 

    private String location; 

    private String availabilityWindows; 

    private String status; 

    private String facultyId;
    
    private String facultyName;
}