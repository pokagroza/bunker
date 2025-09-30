# Установка игры "Бункер"
# PowerShell скрипт

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "     УСТАНОВКА ИГРЫ 'БУНКЕР'" -ForegroundColor Yellow
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
    Write-Host "Пожалуйста, скачайте и установите Node.js с сайта:" -ForegroundColor Yellow
    Write-Host "https://nodejs.org/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "После установки Node.js перезапустите этот скрипт." -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "[1/3] Установка зависимостей сервера..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ОШИБКА: Не удалось установить зависимости сервера" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Переход в папку клиента..." -ForegroundColor Yellow
Set-Location client

Write-Host ""
Write-Host "[3/3] Установка зависимостей клиента..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ОШИБКА: Не удалось установить зависимости клиента" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "     УСТАНОВКА ЗАВЕРШЕНА УСПЕШНО!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для запуска игры выполните:" -ForegroundColor Yellow
Write-Host "  .\start.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Игра будет доступна по адресу:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Read-Host "Нажмите Enter для завершения"