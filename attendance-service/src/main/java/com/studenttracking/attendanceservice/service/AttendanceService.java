package com.studenttracking.attendanceservice.service;

import com.studenttracking.attendanceservice.client.NotificationClient;
import com.studenttracking.attendanceservice.dto.AttendanceRequest;
import com.studenttracking.attendanceservice.dto.BulkAttendanceRequest;
import com.studenttracking.attendanceservice.entity.Attendance;
import com.studenttracking.attendanceservice.enums.AttendanceStatus;
import com.studenttracking.attendanceservice.exception.BusinessException;
import com.studenttracking.attendanceservice.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final NotificationClient notificationClient;

    @CacheEvict(value = {"attendanceByStudent", "attendanceByClassDate", "attendancePercentage"}, allEntries = true)
    public Attendance markAttendance(AttendanceRequest request) {

        attendanceRepository.findByStudentIdAndClassIdAndDate(
                request.getStudentId(),
                request.getClassId(),
                request.getDate())
                .ifPresent(a -> {
                    throw new BusinessException(
                        "Attendance already marked for this student on this date");
                });

        Attendance attendance = Attendance.builder()
                .studentId(request.getStudentId())
                .classId(request.getClassId())
                .date(request.getDate())
                .status(AttendanceStatus.valueOf(
                    request.getStatus().toUpperCase()))
                .markedBy(request.getMarkedBy())
                .build();

        Attendance saved = attendanceRepository.save(attendance);

        if (saved.getStatus() == AttendanceStatus.ABSENT) {
            if (request.getPhoneNumber() != null
                    && !request.getPhoneNumber().isEmpty()) {
                notificationClient.sendAbsenceSms(
                    request.getUserId() != null ?
                        request.getUserId() : request.getStudentId(),
                    request.getPhoneNumber(),
                    request.getStudentName() != null ?
                        request.getStudentName() : "Student",
                    request.getDate().toString()
                );
            }
        }

        return saved;
    }

    @Transactional
    @CacheEvict(value = {"attendanceByStudent", "attendanceByClassDate", "attendancePercentage"}, allEntries = true)
    public List<Attendance> markBulkAttendance(BulkAttendanceRequest request) {
        List<Attendance> saved = new ArrayList<>();

        for (BulkAttendanceRequest.AttendanceRecord record : request.getRecords()) {
            attendanceRepository.findByStudentIdAndClassIdAndDate(
                    record.getStudentId(),
                    request.getClassId(),
                    request.getDate())
                    .ifPresent(a -> {
                        throw new BusinessException(
                            "Attendance already marked for student: "
                            + record.getStudentId());
                    });

            Attendance attendance = Attendance.builder()
                    .studentId(record.getStudentId())
                    .classId(request.getClassId())
                    .date(request.getDate())
                    .status(AttendanceStatus.valueOf(
                        record.getStatus().toUpperCase()))
                    .markedBy(request.getMarkedBy())
                    .build();

            Attendance savedAttendance = attendanceRepository.save(attendance);
            saved.add(savedAttendance);

            // Trigger SMS if ABSENT
            if (savedAttendance.getStatus() == AttendanceStatus.ABSENT) {
                if (record.getPhoneNumber() != null
                        && !record.getPhoneNumber().isEmpty()) {
                    notificationClient.sendAbsenceSms(
                        record.getStudentId(),
                        record.getPhoneNumber(),
                        record.getStudentName() != null ?
                            record.getStudentName() : "Student",
                        request.getDate().toString()
                    );
                }
            }
        }

        return saved;
    }

    // existing query methods stay the same
    @Cacheable(value = "attendanceByStudent", key = "#studentId")
    public List<Attendance> getAttendanceByStudent(UUID studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    @Cacheable(value = "attendanceByClassDate", key = "#classId + '-' + #date")
    public List<Attendance> getAttendanceByClassAndDate(
            UUID classId, LocalDate date) {
        return attendanceRepository.findByClassIdAndDate(classId, date);
    }

    public List<Attendance> getAttendanceByStudentAndClass(
            UUID studentId, UUID classId) {
        return attendanceRepository.findByStudentIdAndClassId(
                studentId, classId);
    }

    public List<Attendance> getAttendanceByStudentAndDateRange(
            UUID studentId, LocalDate from, LocalDate to) {
        return attendanceRepository.findByStudentIdAndDateBetween(
                studentId, from, to);
    }

    @Cacheable(value = "attendancePercentage", key = "#studentId + '-' + #classId")
    public Map<String, Object> getAttendancePercentage(
            UUID studentId, UUID classId) {
        long total = attendanceRepository
                .countByStudentIdAndClassId(studentId, classId);
        long present = attendanceRepository
                .countByStudentIdAndClassIdAndStatus(
                        studentId, classId, AttendanceStatus.PRESENT);
        long late = attendanceRepository
                .countByStudentIdAndClassIdAndStatus(
                        studentId, classId, AttendanceStatus.LATE);
        double percentage = total == 0 ? 0 :
                ((double)(present + late) / total) * 100;

        Map<String, Object> report = new HashMap<>();
        report.put("studentId", studentId);
        report.put("classId", classId);
        report.put("totalDays", total);
        report.put("presentDays", present);
        report.put("lateDays", late);
        report.put("absentDays", total - present - late);
        report.put("attendancePercentage",
                Math.round(percentage * 100.0) / 100.0);
        return report;
    }
}