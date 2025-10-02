@echo off
title QBWD App Starter
echo =======================================================
echo   🚀 Starting QBWD Full App (Frontend + Backend + Nginx)
echo =======================================================

REM ---- Step 1: Build React client ----
echo 🔨 Building React frontend...
cd /d "C:\Users\Cherry\Documents\qbwd-react-app\qwd-react-app\client"
call npm run build
if errorlevel 1 (
    echo ❌ React build failed!
    pause
    exit /b
)

REM ---- Step 2: Copy build output to nginx/html ----
echo 📂 Copying build files to Nginx html folder...
robocopy dist C:\nginx\html /MIR >nul

REM ---- Step 3: Start backend server ----
echo ⚙️  Starting backend server...
cd /d "C:\Users\Cherry\Documents\qbwd-react-app\qwd-react-app\server"
start "Backend" cmd /k "npm start"

REM ---- Step 4: Start Nginx ----
echo 🌐 Starting Nginx...
cd /d "C:\nginx"
start "Nginx" nginx.exe

echo ✅ All services started! 
echo    - Backend:  http://localhost:8080/api
echo    - Frontend: http://localhost/
echo =======================================================
pause
