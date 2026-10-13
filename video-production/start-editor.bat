@echo off
rem Starts the video editor (Remotion Studio) so the "Open the video editor" link in Corners City works.
rem Looks for the tool in ..\video-tool first, then in %USERPROFILE%\corners-video-tool.
set "TOOL=%~dp0..\video-tool"
if not exist "%TOOL%\package.json" set "TOOL=%USERPROFILE%\corners-video-tool"
if not exist "%TOOL%\package.json" (
  echo Could not find the video-tool folder. Merge the video tool pull request first.
  pause
  exit /b 1
)
cd /d "%TOOL%"
if not exist node_modules call npm install
echo.
echo Studio will be at http://localhost:3000 - keep this window open. Ctrl+C stops it.
call npm run dev -- --port=3000
