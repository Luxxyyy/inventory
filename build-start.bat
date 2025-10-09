@echo off
title QBWD App Starter
echo =======================================================
echo   🚀 Starting QBWD Full App (Frontend + Backend + Nginx)
echo =======================================================

REM ---- Step 1: Build React frontend ----
echo 🔨 Building React frontend...
cd /d "C:\Users\Cherry\Documents\qbwd-react-app\qwd-react-app\client" || (
    echo ❌ Failed to change directory to frontend client folder.
    pause
    exit /b 1
)
call npm run build
if errorlevel 1 (
    echo ❌ React build failed!
    pause
    exit /b 1
)

REM ---- Step 2: Copy build output to Nginx html folder ----
echo 📂 Syncing build files to Nginx html folder...
REM Optional: Remove old files to ensure a clean copy
rmdir /s /q C:\nginx\html
robocopy dist C:\nginx\html /MIR >nul
if errorlevel 1 (
    echo ❌ Failed to copy build files to Nginx html folder!
    pause
    exit /b 1
)

REM ---- Step 3: Start backend server ----
echo ⚙️  Starting backend server...
cd /d "C:\Users\Cherry\Documents\qbwd-react-app\qwd-react-app\server" || (
    echo ❌ Failed to change directory to backend server folder.
    pause
    exit /b 1
)
start "Backend" cmd /k "npm start"

REM ---- Step 4: Start Nginx ----
echo 🌐 Starting Nginx...
cd /d "C:\nginx" || (
    echo ❌ Failed to change directory to Nginx folder.
    pause
    exit /b 1
)
start "Nginx" nginx.exe

echo ✅ All services started! 
echo    - Backend:  http://localhost:8080/api
echo    - Frontend: http://localhost/
echo =======================================================
pause
