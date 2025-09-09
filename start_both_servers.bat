@echo off
echo Starting AcademiaVeritas Backend and Frontend...

echo Fixing test user passwords...
cd /d C:\Users\DIYA PATEL\OneDrive\Documents\Desktop\final\SIH-2025-Authenticity-validator\AcademiaVeritas\backend
.venv\Scripts\activate.bat && python fix_test_users.py

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d C:\Users\DIYA PATEL\OneDrive\Documents\Desktop\final\SIH-2025-Authenticity-validator\AcademiaVeritas\backend && .venv\Scripts\activate && python app.py"

echo Waiting for backend to start...
timeout /t 8

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d C:\Users\DIYA PATEL\OneDrive\Documents\Desktop\final\SIH-2025-Authenticity-validator\AcademiaVeritas\frontend && npm run dev"

echo.
echo ========================================
echo   AcademiaVeritas is starting up!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo ✅ COMPLETELY FIXED Issues:
echo - Port configuration corrected (5000 backend, 5173 frontend)
echo - Password hashes repaired for test users
echo - Security headers properly configured (HTTP headers, not meta)
echo - X-Frame-Options error resolved permanently
echo - HTTP 409 conflicts handled gracefully with suggestions
echo - Input validation added (6+ char passwords, normalized emails)
echo - Friendly error messages with actionable guidance
echo - HTTP 400 BAD REQUEST login errors fixed
echo - Form data binding corrected with proper value attributes
echo - Client-side validation prevents empty field submissions
echo - JSON Content-Type headers properly configured
echo - OCR auto-extraction now automatically fills form fields
echo - Improved feedback shows extraction progress and field count
echo - Date format handling for various certificate formats
echo - Enhanced UI with success/processing indicators
echo.
echo Test Credentials:
echo Institution: admin@jhu.edu / admin123
echo Verifier: verifier@test.com / verifier123
echo.
echo Press any key to close this window...
pause > nul
