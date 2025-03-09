@echo off

for /f "delims=" %%v in ('node -v 2^>nul') do set NODE_VERSION=%%v

IF "%NODE_VERSION%"=="" (
    echo Node.js is not installed! Please install it from https://nodejs.org/
    pause
    exit /b 1
) ELSE (
    echo Node.js is installed. Version: %NODE_VERSION%
    npm run start
)
