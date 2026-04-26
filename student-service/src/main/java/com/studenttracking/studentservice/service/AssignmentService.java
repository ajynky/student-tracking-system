package com.studenttracking.studentservice.service;

import com.studenttracking.studentservice.dto.AssignmentRequest;
import com.studenttracking.studentservice.dto.SubmissionRequest;
import com.studenttracking.studentservice.entity.Assignment;
import com.studenttracking.studentservice.entity.Submission;
import com.studenttracking.studentservice.repository.AssignmentRepository;
import com.studenttracking.studentservice.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;

    public Assignment createAssignment(AssignmentRequest request) {
        Assignment assignment = Assignment.builder()
                .classId(request.getClassId())
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .fileUrl(request.getFileUrl())
                .build();
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsByClass(UUID classId) {
        return assignmentRepository.findByClassId(classId);
    }

    public Assignment getAssignmentById(UUID assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    public void deleteAssignment(UUID assignmentId) {
        assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        assignmentRepository.deleteById(assignmentId);
    }

    public Submission submitAssignment(SubmissionRequest request) {
        assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        submissionRepository.findByAssignmentIdAndStudentId(
                request.getAssignmentId(), request.getStudentId())
                .ifPresent(s -> {
                    throw new RuntimeException("Already submitted");
                });

        Submission submission = Submission.builder()
                .assignmentId(request.getAssignmentId())
                .studentId(request.getStudentId())
                .fileUrl(request.getFileUrl())
                .submittedAt(LocalDateTime.now())
                .build();

        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByAssignment(UUID assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> getSubmissionsByStudent(UUID studentId) {
        return submissionRepository.findByStudentId(studentId);
    }
}