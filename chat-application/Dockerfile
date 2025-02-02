# Use a base image with OpenJDK
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
COPY target/chat-application-0.0.1-SNAPSHOT.jar /app/chat-application.jar

# Expose the port the application will run on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "chat-application.jar"]
