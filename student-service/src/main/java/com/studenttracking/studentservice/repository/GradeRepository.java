package com.studenttracking.studentservice.repository;

import com.studenttracking.studentservice.entity.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GradeRepository extends JpaRepository<Grade, UUID> {
    List<Grade> findByStudentId(UUID studentId);
    List<Grade> findByStudentIdAndSemester(UUID studentId, String semester);
    List<Grade> findByStudentIdAndPublishedAtIsNotNull(UUID studentId);
}