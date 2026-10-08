@echo off
REM Open the existing workspace at Corners City. No packages are installed.
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 start.py
) else (
  where python >nul 2>nul
  if errorlevel 1 (
    echo Python 3 is missing. Install it from https://www.python.org/downloads/
  ) else (
    python start.py
  )
)
if errorlevel 1 pause
