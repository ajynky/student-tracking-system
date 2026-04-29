package com.studenttracking.apigateway.config;

import java.net.URI;
import java.util.Collections;
import java.util.Enumeration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class ProxyController {

    @Value("${services.auth-service}")
    private String authServiceUrl;

    @Value("${services.student-service}")
    private String studentServiceUrl;

    @Value("${services.attendance-service}")
    private String attendanceServiceUrl;

    @Value("${services.notification-service}")
    private String notificationServiceUrl;

    private final RestTemplate restTemplate = createRestTemplate();

    private RestTemplate createRestTemplate() {
        HttpComponentsClientHttpRequestFactory factory =
                new HttpComponentsClientHttpRequestFactory();
        factory.setConnectionRequestTimeout(10000);
        factory.setReadTimeout(30000);
        return new RestTemplate(factory);
    }

    @RequestMapping("/auth/**")
    public ResponseEntity<String> proxyAuth(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(authServiceUrl, body, method, request);
    }

    @RequestMapping("/students/**")
    public ResponseEntity<String> proxyStudents(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(studentServiceUrl, body, method, request);
    }

    @RequestMapping("/classes/**")
    public ResponseEntity<String> proxyClasses(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(studentServiceUrl, body, method, request);
    }

    @RequestMapping("/grades/**")
    public ResponseEntity<String> proxyGrades(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(studentServiceUrl, body, method, request);
    }

    @RequestMapping("/assignments/**")
    public ResponseEntity<String> proxyAssignments(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(studentServiceUrl, body, method, request);
    }

    @RequestMapping("/files/**")
    public ResponseEntity<String> proxyFiles(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(studentServiceUrl, body, method, request);
    }

    @RequestMapping("/attendance/**")
    public ResponseEntity<String> proxyAttendance(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(attendanceServiceUrl, body, method, request);
    }

    @RequestMapping("/notifications/**")
    public ResponseEntity<String> proxyNotifications(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(notificationServiceUrl, body, method, request);
    }

    @RequestMapping("/users/**")
    public ResponseEntity<String> proxyUsers(
            @RequestBody(required = false) String body,
            HttpMethod method,
            HttpServletRequest request) {
        return proxy(authServiceUrl, body, method, request);
    }

    private ResponseEntity<String> proxy(
            String serviceUrl,
            String body,
            HttpMethod method,
            HttpServletRequest request) {

        // Build target URL
        String path = request.getRequestURI();
        String query = request.getQueryString();
        String targetUrl = serviceUrl + path +
                (query != null ? "?" + query : "");

        log.info("Proxying request to: {}", targetUrl);

        // Copy headers
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("host")) {
                headers.put(headerName,
                        Collections.list(request.getHeaders(headerName)));
            }
        }
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    URI.create(targetUrl),
                    method,
                    entity,
                    String.class
            );
            log.info("Response status: {}", response.getStatusCode());
            log.info("Response body: {}", response.getBody());
            return response;
        } catch (HttpClientErrorException e) {
            log.error("Client error: {}", e.getMessage());
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            log.error("Server error: {}", e.getMessage());
            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Proxy error: {}", e.getMessage());
            log.error("Proxy error cause: {}", e.getCause() != null ?
                    e.getCause().getMessage() : "no cause");
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("{\"error\": \"Service unavailable\"}");
        }
    }
}
