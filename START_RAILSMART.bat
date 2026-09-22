@echo off
title RailSmart - AI-Powered Railway Travel Management System
cd /d "%~dp0"
echo ===================================================
echo     RAILSMART - AI-POWERED SMART TRAIN BOOKING
echo ===================================================
echo Starting RailSmart Full-Stack Server with NODEMON (Auto-Restart)...
echo Open your browser at: http://localhost:5001
echo ===================================================
npx nodemon server/server.js
pause
