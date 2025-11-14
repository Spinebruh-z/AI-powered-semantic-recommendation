n@echo off
echo ===============================================
echo Starting AI Recommendation System
echo ===============================================
echo.
echo This will open TWO terminal windows:
echo   1. Backend Server (Port 5000)
echo   2. Frontend Server (Port 3000)
echo.
echo After both start, open: http://localhost:3000
echo.
echo Press any key to start...
pause > nul

start "Backend Server" cmd /k "cd backend && node src/server.js"
timeout /t 3 > nul
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ===============================================
echo.
echo Press any key to exit (servers will keep running)
pause > nul
