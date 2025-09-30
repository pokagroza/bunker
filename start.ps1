# Запуск игры "Бункер"
# PowerShell скрипт

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "       ЗАПУСК ИГРЫ 'БУНКЕР'" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Проверка Node.js
Write-Host "Проверка Node.js..." -ForegroundColor Green
try {
    $nodeVersion = node --version 2>$null
    Write-Host "Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ОШИБКА: Node.js не установлен!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Сначала запустите install.ps1 для установки зависимостей" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "Запуск сервера и клиента..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Сервер будет запущен на порту 5000" -ForegroundColor Cyan
Write-Host "Клиент будет доступен на http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Запуск игры
npm run dev