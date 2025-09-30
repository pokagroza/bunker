# PowerShell скрипт для разработки игры "Бункер"

Write-Host "🏠 БУНКЕР - Режим разработки" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

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

Write-Host "🚀 Запуск в режиме разработки..." -ForegroundColor Green
Write-Host ""
Write-Host "=====================================
🏠 БУНКЕР - Режим разработки
=====================================
🔧 Сервер: http://localhost:5000
🌐 Клиент: http://localhost:3000
=====================================
⚠️  Hot reload включен для разработки
⚠️  Чтобы остановить, нажмите Ctrl+C
=====================================" -ForegroundColor Cyan

# Запуск в режиме разработки
Write-Host "Запуск сервера..." -ForegroundColor Yellow
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$($scriptPath)\server'; npm run dev"

Write-Host "Запуск клиента..." -ForegroundColor Yellow  
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "cd '$($scriptPath)\client'; npm start"

Write-Host "✅ Оба процесса запущены в отдельных окнах PowerShell" -ForegroundColor Green
Read-Host "Нажмите Enter для закрытия этого окна"