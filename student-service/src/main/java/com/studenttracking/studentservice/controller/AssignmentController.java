package com.studenttracking.studentservice.controller;

import com.studenttracking.studentservice.dto.AssignmentRequest;
import com.studenttracking.studentservice.dto.SubmissionRequest;
import com.studenttracking.studentservice.entity.Assignment;
import com.studenttracking.studentservice.entity.Submission;
import com.studenttracking.studentservice.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<Assignment> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {
        return ResponseEntity.ok(assignmentService.createAssignment(request));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Assignment>> getByClass(
            @PathVariable UUID classId) {
        return ResponseEntity.ok(
            assignmentService.getAssignmentsByClass(classId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable UUID id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<Submission> submitAssignment(
            @Valid @RequestBody SubmissionRequest request) {
        return ResponseEntity.ok(assignmentService.submitAssignment(request));
    }

    @GetMapping("/{assignmentId}/submissions")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(
            @PathVariable UUID assignmentId) {
        return ResponseEntity.ok(
            assignmentService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/submissions/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByStudent(
            @PathVariable UUID studentId) {
        return ResponseEntity.ok(
            assignmentService.getSubmissionsByStudent(studentId));
    }
}