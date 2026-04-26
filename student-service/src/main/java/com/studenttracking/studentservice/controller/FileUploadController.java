package com.studenttracking.studentservice.controller;

import com.studenttracking.studentservice.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final StorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder)
            throws IOException {

        String fileUrl = storageService.uploadFile(file, folder);

        Map<String, String> response = new HashMap<>();
        response.put("fileUrl", fileUrl);
        response.put("message", "File uploaded successfully");

        return ResponseEntity.ok(response);
    }
}