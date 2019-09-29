@echo off

set BUILD_DIR=build\win32
set DIST_DIR=dist\win32

if "%1"=="ia32" (
  goto build_ia32
) else if "%1"=="x64" (
  goto build_x64
)
 
:build_ia32
if not exist %BUILD_DIR%\ia32 mkdir %BUILD_DIR%\ia32
cmake -A Win32 -S . -B %BUILD_DIR%\ia32
cmake --build %BUILD_DIR%\ia32 --config Release
if not exist %DIST_DIR%\ia32 mkdir %DIST_DIR%\ia32
copy %BUILD_DIR%\ia32\lib\Release\oid.lib %DIST_DIR%\ia32\oid.lib
if "%1"=="ia32" goto end

:build_x64
if not exist %BUILD_DIR%\x64 mkdir %BUILD_DIR%\x64
cmake -A x64 -S . -B %BUILD_DIR%\x64
cmake --build %BUILD_DIR%\x64 --config Release
if not exist %DIST_DIR%\x64 mkdir %DIST_DIR%\x64
copy %BUILD_DIR%\x64\lib\Release\oid.lib %DIST_DIR%\x64\oid.lib
if "%1"=="x64" goto end

:end
if not exist dist\include mkdir dist\include
xcopy lib\include\*.* dist\include /s /e /c /y /h /r
