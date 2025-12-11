@echo off
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot"
if not exist "%JAVA_HOME%" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-17.0.11+9"
)
if not exist "%JAVA_HOME%" (
    echo Java 17 not found. Please install Java 17 or update the path in this script.
    pause
    exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Using Java: %JAVA_HOME%
java -version
echo.
echo Building project...
mvn clean compile