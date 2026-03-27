# Bootstrap Gatling project with Maven

## Check prerequisites

`java -version` should show at least Java 11.

A Maven install is not required because the project will include mvnw (Maven Wrapper).

## Download a sample project

Download the sample project corresponding to the chosen language, then unzip its content to the target directory:

- Java: https://github.com/gatling/gatling-maven-plugin-demo-java/archive/refs/heads/main.zip
- Kotlin: https://github.com/gatling/gatling-maven-plugin-demo-kotlin/archive/refs/heads/main.zip
- Scala: https://github.com/gatling/gatling-maven-plugin-demo-scala/archive/refs/heads/main.zip

## Edit project metadata

Ask user if they want to choose a group ID and artifact ID, then edit them in the pom.xml file. Otherwise keep the default values.
