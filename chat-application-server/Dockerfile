# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory into the container
COPY target/chat-application-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port (change if your Spring Boot app runs on a different port)
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
