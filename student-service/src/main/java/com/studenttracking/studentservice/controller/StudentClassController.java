package com.studenttracking.studentservice.controller;

import com.studenttracking.studentservice.dto.StudentClassRequest;
import com.studenttracking.studentservice.entity.StudentClass;
import com.studenttracking.studentservice.service.StudentClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
public class StudentClassController {

    private final StudentClassService classService;

    @PostMapping
    public ResponseEntity<StudentClass> createClass(
            @Valid @RequestBody StudentClassRequest request) {
        return ResponseEntity.ok(classService.createClass(request));
    }

    @GetMapping
    public ResponseEntity<Page<StudentClass>> getAllClasses(@PageableDefault(size = 10, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(classService.getAllClasses(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentClass> getClassById(@PathVariable UUID id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<StudentClass>> getByTeacher(
            @PathVariable UUID teacherId) {
        return ResponseEntity.ok(classService.getClassesByTeacher(teacherId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentClass> updateClass(
            @PathVariable UUID id,
            @Valid @RequestBody StudentClassRequest request) {
        return ResponseEntity.ok(classService.updateClass(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable UUID id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }
}