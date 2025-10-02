@echo off
title QBWD App Starter
echo =======================================================
echo   🚀 Starting QBWD App (Backend + Nginx Only)
echo =======================================================

REM ---- Step 1: Start backend server ----
echo ⚙️  Starting backend server...
cd /d "C:\Users\Cherry\Documents\qbwd-react-app\qwd-react-app\server"
start "Backend" cmd /k "npm start"

REM ---- Step 2: Start Nginx ----
echo 🌐 Starting Nginx...
cd /d "C:\nginx"
start "Nginx" nginx.exe

echo ✅ All services started! 
echo    - Backend:  http://localhost:8080/api
echo    - Frontend: http://localhost/
echo =======================================================
pause
