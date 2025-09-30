# PowerShell скрипт для запуска игры "Бункер"

Write-Host "🏠 БУНКЕР - Запуск игры" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Проверяем, установлен ли Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js не найден!" -ForegroundColor Red
    Write-Host "Установите Node.js с сайта: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit
}

# Переходим в директорию проекта
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📦 Установка зависимостей сервера..." -ForegroundColor Yellow
Set-Location "server"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при установке зависимостей сервера!" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit
    }
} else {
    Write-Host "❌ Файл package.json не найден в папке server!" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit
}

Write-Host "📦 Установка зависимостей клиента..." -ForegroundColor Yellow
Set-Location "../client"
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при установке зависимостей клиента!" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit
    }
} else {
    Write-Host "❌ Файл package.json не найден в папке client!" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit
}

Write-Host "🔥 Сборка клиентского приложения..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке клиентского приложения!" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit
}

Write-Host "🚀 Запуск сервера..." -ForegroundColor Green
Set-Location "../server"
Write-Host ""
Write-Host "=====================================
🏠 БУНКЕР - Игра запущена!
=====================================
📱 Откройте браузер и перейдите по адресу:
🌐 http://localhost:5000
=====================================
⚠️  Чтобы остановить сервер, нажмите Ctrl+C
=====================================" -ForegroundColor Cyan

# Запуск сервера
npm start