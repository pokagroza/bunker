# PowerShell скрипт для запуска мобильного приложения Бункер

Write-Host "📱 БУНКЕР - Мобильное приложение" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

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

# Проверяем, установлен ли Expo CLI
try {
    $expoVersion = expo --version
    Write-Host "✅ Expo CLI найден: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Expo CLI не найден. Устанавливаем..." -ForegroundColor Yellow
    npm install -g @expo/cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при установке Expo CLI!" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit
    }
}

# Переходим в директорию мобильного приложения
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\mobile"

Write-Host "📦 Установка зависимостей мобильного приложения..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при установке зависимостей!" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit
    }
} else {
    Write-Host "❌ Файл package.json не найден в папке mobile!" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit
}

# Проверяем, запущен ли сервер
Write-Host "🔍 Проверка сервера..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -Method GET -TimeoutSec 5
    Write-Host "✅ Сервер работает на порту 5000" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Сервер не запущен на порту 5000" -ForegroundColor Yellow
    Write-Host "Запустите сервер с помощью start-game.ps1 или dev-start.ps1" -ForegroundColor Yellow
}

Write-Host "🚀 Запуск мобильного приложения..." -ForegroundColor Green
Write-Host ""
Write-Host "=====================================
📱 БУНКЕР - Мобильное приложение
=====================================
📋 QR-код будет отображен для подключения
📱 Установите Expo Go на телефон:
   • Android: Google Play Store
   • iOS: App Store
🔗 Отсканируйте QR-код в приложении Expo Go
🌐 Веб-версия откроется автоматически
=====================================
⚠️  Убедитесь, что сервер запущен!
⚠️  Чтобы остановить, нажмите Ctrl+C
=====================================" -ForegroundColor Cyan

# Запуск Expo
npx expo start