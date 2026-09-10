@echo off
title RailSmart - AI-Powered Railway Travel Management System
cd /d "%~dp0"
echo ===================================================
echo     RAILSMART - AI-POWERED SMART TRAIN BOOKING
echo ===================================================
echo Starting RailSmart Full-Stack Server on Port 5001...
echo Open your browser at: http://localhost:5001
echo ===================================================
node server/server.js
pause
