package com.studenttracking.studentservice.repository;

import com.studenttracking.studentservice.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudentRepository
        extends JpaRepository<Student, UUID> {
    List<Student> findByClassId(UUID classId);
    Optional<Student> findByUserId(UUID userId);
    boolean existsByRollNo(String rollNo);
}