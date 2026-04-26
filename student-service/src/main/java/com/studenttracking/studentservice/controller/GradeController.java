package com.studenttracking.studentservice.controller;

import com.studenttracking.studentservice.dto.GradeRequest;
import com.studenttracking.studentservice.entity.Grade;
import com.studenttracking.studentservice.service.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    public ResponseEntity<Grade> addGrade(
            @Valid @RequestBody GradeRequest request) {
        return ResponseEntity.ok(gradeService.addGrade(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Grade>> getGradesByStudent(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(gradeService.getGradesByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/published")
    public ResponseEntity<List<Grade>> getPublishedGrades(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(
            gradeService.getPublishedGradesByStudent(studentId));
    }

    @GetMapping("/student/{studentId}/semester/{semester}")
    public ResponseEntity<List<Grade>> getGradesBySemester(
            @PathVariable UUID studentId,
            @PathVariable String semester) {
        return ResponseEntity.ok(
            gradeService.getGradesByStudentAndSemester(studentId, semester));
    }

    @PutMapping("/{gradeId}/publish")
    public ResponseEntity<Grade> publishGrade(
            @PathVariable UUID gradeId) {
        return ResponseEntity.ok(gradeService.publishGrade(gradeId));
    }

    @PutMapping("/{gradeId}")
    public ResponseEntity<Grade> updateGrade(
            @PathVariable UUID gradeId,
            @Valid @RequestBody GradeRequest request) {
        return ResponseEntity.ok(gradeService.updateGrade(gradeId, request));
    }

    @DeleteMapping("/{gradeId}")
    public ResponseEntity<Void> deleteGrade(
            @PathVariable UUID gradeId) {
        gradeService.deleteGrade(gradeId);
        return ResponseEntity.noContent().build();
    }
}