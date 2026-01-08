@echo off
REM MySQL Setup Script for CareConnect

echo ================================
echo CareConnect MySQL Setup
echo ================================
echo.

echo Starting MySQL service...
net start MySQL92
if errorlevel 1 (
    echo MySQL service is already running or requires admin privileges.
)

echo.
echo Creating database and importing schema...
cd /d "%~dp0"

REM Wait for MySQL to start
timeout /t 2 /nobreak

REM Create database and import schema
mysql -u root -e "CREATE DATABASE IF NOT EXISTS careconnect;"
mysql -u root careconnect < database\schema.sql

if errorlevel 0 (
    echo.
    echo ✓ Database created successfully!
    echo ✓ Schema imported!
    echo.
    echo Database Details:
    echo - Host: localhost
    echo - Database: careconnect
    echo - User: root
    echo.
) else (
    echo.
    echo ✗ Error creating database. Please check:
    echo   1. MySQL service is running (run as Administrator)
    echo   2. root user password is set in .env file
    echo.
)

pause
