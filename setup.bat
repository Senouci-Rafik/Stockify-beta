@echo off
echo Cleaning up...
if exist "node_modules" (
    rmdir /s /q "node_modules"
)
if exist "package-lock.json" (
    del /f /q "package-lock.json"
)

echo Installing dependencies...
call npm install

echo Creating necessary directories...
if not exist "src\components\ui" mkdir "src\components\ui"
if not exist "src\hooks" mkdir "src\hooks"
if not exist "src\lib" mkdir "src\lib"
if not exist "src\types" mkdir "src\types"

echo Setup complete! You can now run 'npm run dev' 