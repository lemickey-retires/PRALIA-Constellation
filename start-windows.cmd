@echo off
cd /d "%~dp0"
if exist "PRALIA-Constellation.exe" (
  start "" "%~dp0PRALIA-Constellation.exe"
  exit /b
)
where py >nul 2>nul
if not errorlevel 1 (
  py -3 "%~dp0run-preview.py" --headless
  pause
  exit /b
)
where python >nul 2>nul
if not errorlevel 1 (
  python "%~dp0run-preview.py" --headless
  pause
  exit /b
)
echo Download the Windows ZIP from GitHub Releases and extract the complete folder.
echo That ZIP includes PRALIA-Constellation.exe and does not require Python.
pause
