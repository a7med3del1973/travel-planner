# Build Phase
FROM maven:3.9.6-eclipse-temurin-17-focal AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application skipping tests to speed up the process
RUN mvn clean package -DskipTests

# Run Phase
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]
