package com.studenttracking.studentservice.repository;

import com.studenttracking.studentservice.entity.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StudentClassRepository
        extends JpaRepository<StudentClass, UUID> {
    List<StudentClass> findByTeacherId(UUID teacherId);
}