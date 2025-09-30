@echo off
chcp 65001 >nul
echo ========================================
echo     УСТАНОВКА ИГРЫ "БУНКЕР"
echo ========================================
echo.

echo Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Node.js не установлен!
    echo.
    echo Пожалуйста, скачайте и установите Node.js с сайта:
    echo https://nodejs.org/
    echo.
    echo После установки Node.js перезапустите этот файл.
    pause
    exit /b 1
)

echo Node.js найден. Продолжаем установку...
echo.

echo [1/3] Установка зависимостей сервера...
call npm install
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось установить зависимости сервера
    pause
    exit /b 1
)

echo.
echo [2/3] Переход в папку клиента...
cd client

echo.
echo [3/3] Установка зависимостей клиента...
call npm install
if %errorlevel% neq 0 (
    echo ОШИБКА: Не удалось установить зависимости клиента
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo     УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!
echo ========================================
echo.
echo Для запуска игры выполните:
echo   .\start.bat
echo.
echo Игра будет доступна по адресу:
echo   http://localhost:3000
echo.
pause