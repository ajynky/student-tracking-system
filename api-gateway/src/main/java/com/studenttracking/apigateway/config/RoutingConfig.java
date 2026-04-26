package com.studenttracking.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.RouterFunctions;
import org.springframework.web.servlet.function.ServerResponse;

@Configuration
public class RoutingConfig {

    @Value("${services.auth-service}")
    private String authServiceUrl;

    @Value("${services.student-service}")
    private String studentServiceUrl;

    @Value("${services.attendance-service}")
    private String attendanceServiceUrl;

    @Value("${services.notification-service}")
    private String notificationServiceUrl;

    @Bean
    public RouterFunction<ServerResponse> routes() {
        return RouterFunctions
            .route(RequestPredicates.path("/auth/**"),
                request -> ServerResponse.temporaryRedirect(
                    java.net.URI.create(authServiceUrl +
                        request.uri().getPath())).build())

            .andRoute(RequestPredicates.path("/students/**"),
                request -> ServerResponse.temporaryRedirect(
                    java.net.URI.create(studentServiceUrl +
                        request.uri().getPath())).build())

            .andRoute(RequestPredicates.path("/attendance/**"),
                request -> ServerResponse.temporaryRedirect(
                    java.net.URI.create(attendanceServiceUrl +
                        request.uri().getPath())).build())

            .andRoute(RequestPredicates.path("/notifications/**"),
                request -> ServerResponse.temporaryRedirect(
                    java.net.URI.create(notificationServiceUrl +
                        request.uri().getPath())).build());
    }
}