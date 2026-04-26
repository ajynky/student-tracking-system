package com.studenttracking.studentservice.service;

import com.studenttracking.studentservice.dto.StudentClassRequest;
import com.studenttracking.studentservice.entity.StudentClass;
import com.studenttracking.studentservice.repository.StudentClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudentClassService {

    private final StudentClassRepository classRepository;

    public StudentClass createClass(StudentClassRequest request) {
        StudentClass studentClass = StudentClass.builder()
                .name(request.getName())
                .teacherId(request.getTeacherId())
                .build();
        return classRepository.save(studentClass);
    }

    public List<StudentClass> getAllClasses() {
        return classRepository.findAll();
    }

    public StudentClass getClassById(UUID id) {
        return classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));
    }

    public List<StudentClass> getClassesByTeacher(UUID teacherId) {
        return classRepository.findByTeacherId(teacherId);
    }

    public StudentClass updateClass(UUID id, StudentClassRequest request) {
        StudentClass existing = getClassById(id);
        existing.setName(request.getName());
        existing.setTeacherId(request.getTeacherId());
        return classRepository.save(existing);
    }

    public void deleteClass(UUID id) {
        classRepository.deleteById(id);
    }
}