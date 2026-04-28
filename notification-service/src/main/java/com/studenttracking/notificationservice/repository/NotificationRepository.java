package com.studenttracking.notificationservice.repository;

import com.studenttracking.notificationservice.entity.Notification;
import com.studenttracking.notificationservice.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserId(UUID userId);
    List<Notification> findByStatus(NotificationStatus status);
}