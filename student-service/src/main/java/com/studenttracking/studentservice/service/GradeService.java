package com.studenttracking.studentservice.service;

import com.studenttracking.studentservice.dto.GradeRequest;
import com.studenttracking.studentservice.entity.Grade;
import com.studenttracking.studentservice.repository.GradeRepository;
import com.studenttracking.studentservice.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;

    public Grade addGrade(GradeRequest request) {
        studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Grade grade = Grade.builder()
                .studentId(request.getStudentId())
                .subject(request.getSubject())
                .score(request.getScore())
                .semester(request.getSemester())
                .publishedAt(request.isPublish() ? LocalDateTime.now() : null)
                .build();

        return gradeRepository.save(grade);
    }

    public List<Grade> getGradesByStudent(UUID studentId) {
        studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return gradeRepository.findByStudentId(studentId);
    }

    public List<Grade> getPublishedGradesByStudent(UUID studentId) {
        return gradeRepository.findByStudentIdAndPublishedAtIsNotNull(studentId);
    }

    public List<Grade> getGradesByStudentAndSemester(
            UUID studentId, String semester) {
        return gradeRepository.findByStudentIdAndSemester(studentId, semester);
    }

    public Grade publishGrade(UUID gradeId) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
        grade.setPublishedAt(LocalDateTime.now());
        return gradeRepository.save(grade);
    }

    public Grade updateGrade(UUID gradeId, GradeRequest request) {
        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));

        grade.setSubject(request.getSubject());
        grade.setScore(request.getScore());
        grade.setSemester(request.getSemester());

        if (request.isPublish() && grade.getPublishedAt() == null) {
            grade.setPublishedAt(LocalDateTime.now());
        }

        return gradeRepository.save(grade);
    }

    public void deleteGrade(UUID gradeId) {
        gradeRepository.findById(gradeId)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
        gradeRepository.deleteById(gradeId);
    }
}