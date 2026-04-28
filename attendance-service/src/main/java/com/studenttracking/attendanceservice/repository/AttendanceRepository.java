package com.studenttracking.attendanceservice.repository;

import com.studenttracking.attendanceservice.entity.Attendance;
import com.studenttracking.attendanceservice.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {

    List<Attendance> findByStudentId(UUID studentId);

    List<Attendance> findByClassIdAndDate(UUID classId, LocalDate date);

    List<Attendance> findByStudentIdAndClassId(UUID studentId, UUID classId);

    List<Attendance> findByStudentIdAndDateBetween(
            UUID studentId, LocalDate from, LocalDate to);

    Optional<Attendance> findByStudentIdAndClassIdAndDate(
            UUID studentId, UUID classId, LocalDate date);

    long countByStudentIdAndClassId(UUID studentId, UUID classId);

    long countByStudentIdAndClassIdAndStatus(
            UUID studentId, UUID classId, AttendanceStatus status);
}