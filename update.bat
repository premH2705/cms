@echo off
echo ===============================
echo   Updating CMS Project
echo ===============================

git add .
git commit -m "Auto update on %date% %time%"
git push origin main

echo.
echo ✅ Update complete. Check GitHub Pages.
pause
