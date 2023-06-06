FROM gradle as app-build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon -x test

FROM eclipse-temurin:17-jre
WORKDIR /opt/workspace
COPY --from=app-build /home/gradle/src/build/libs/*.jar ./app.jar
ENTRYPOINT ["java", "-jar", "./app.jar"]
EXPOSE 8080
