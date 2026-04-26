package com.studenttracking.studentservice.service;

import com.studenttracking.studentservice.dto.StudentRequest;
import com.studenttracking.studentservice.entity.Student;
import com.studenttracking.studentservice.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public Student createStudent(StudentRequest request) {
        if (studentRepository.existsByRollNo(request.getRollNo())) {
            throw new RuntimeException("Roll number already exists");
        }
        Student student = Student.builder()
                .userId(request.getUserId())
                .name(request.getName())
                .rollNo(request.getRollNo())
                .classId(request.getClassId())
                .build();
        return studentRepository.save(student);
    }

    public Page<Student> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Student getStudentById(UUID id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public Student getStudentByUserId(UUID userId) {
        return studentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<Student> getStudentsByClass(UUID classId) {
        return studentRepository.findByClassId(classId);
    }

    public Student updateStudent(UUID id, StudentRequest request) {
        Student existing = getStudentById(id);
        existing.setName(request.getName());
        existing.setClassId(request.getClassId());
        return studentRepository.save(existing);
    }

    public void deleteStudent(UUID id) {
        studentRepository.deleteById(id);
    }
}