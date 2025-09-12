@echo off
echo Stopping nginx...
cd /d C:\nginx
nginx -s stop

echo Killing node processes...
taskkill /F /IM node.exe >nul 2>&1

echo Done.
pause
