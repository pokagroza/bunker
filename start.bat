@echo off
chcp 65001 >nul
echo ========================================
echo       ЗАПУСК ИГРЫ "БУНКЕР"
echo ========================================
echo.

echo Проверка Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Node.js не установлен!
    echo.
    echo Сначала запустите install.bat для установки зависимостей
    pause
    exit /b 1
)

echo Запуск сервера и клиента...
echo.
echo Сервер будет запущен на порту 5000
echo Клиент будет доступен на http://localhost:3000
echo.
echo Для остановки нажмите Ctrl+C
echo.

call npm run dev