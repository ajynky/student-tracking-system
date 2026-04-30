# Stage 1 — Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Cache dependencies separately from source code
COPY pom.xml .
RUN apk add --no-cache maven && mvn dependency:go-offline -q

# Build the app
COPY src ./src
RUN mvn clean package -DskipTests -q

# Extract layers for better Docker caching
RUN java -Djarmode=layertools -jar target/*.jar extract

# Stage 2 — Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Download Grafana OpenTelemetry Java agent
RUN apk add --no-cache curl && \
    curl -L https://github.com/grafana/grafana-opentelemetry-java/releases/latest/download/grafana-opentelemetry-java.jar \
    -o /app/grafana-opentelemetry-java.jar

# Copy layers in order of least → most likely to change
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./

USER appuser
EXPOSE 8080
ENTRYPOINT ["java", "-javaagent:/app/grafana-opentelemetry-java.jar", "org.springframework.boot.loader.launch.JarLauncher"]

# # Stage 1 — Build
# FROM eclipse-temurin:21-jdk-alpine AS builder
# WORKDIR /app

# COPY pom.xml .
# COPY src ./src
# RUN apk add --no-cache maven && mvn clean package -DskipTests -q

# # Extract layers
# RUN java -Djarmode=layertools -jar target/*.jar extract

# # Stage 2 — Runtime
# FROM eclipse-temurin:21-jre-alpine
# WORKDIR /app

# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# COPY --from=builder /app/dependencies/ ./
# COPY --from=builder /app/spring-boot-loader/ ./
# COPY --from=builder /app/snapshot-dependencies/ ./
# COPY --from=builder /app/application/ ./

# USER appuser
# EXPOSE 8080
# ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]