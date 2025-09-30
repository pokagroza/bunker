# PowerShell скрипт для сборки APK мобильного приложения

Write-Host "📦 БУНКЕР - Сборка APK" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green

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

# Проверяем, установлен ли EAS CLI
try {
    $easVersion = eas --version
    Write-Host "✅ EAS CLI найден: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ EAS CLI не найден. Устанавливаем..." -ForegroundColor Yellow
    npm install -g @expo/eas-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Ошибка при установке EAS CLI!" -ForegroundColor Red
        Read-Host "Нажмите Enter для выхода"
        exit
    }
}

# Переходим в директорию мобильного приложения
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$scriptPath\mobile"

Write-Host "📦 Установка зависимостей..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при установке зависимостей!" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit
}

Write-Host "⚙️ Настройка проекта для сборки..." -ForegroundColor Yellow

# Создаем конфигурацию EAS
$easConfig = @"
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
"@

$easConfig | Out-File -FilePath "eas.json" -Encoding UTF8

Write-Host "🔐 Авторизация в Expo..." -ForegroundColor Yellow
Write-Host "Если у вас нет аккаунта Expo, создайте его на https://expo.dev/" -ForegroundColor Cyan

eas login

Write-Host "🏗️ Начинаем сборку APK..." -ForegroundColor Green
Write-Host ""
Write-Host "=====================================
📦 СБОРКА APK ФАЙЛА
=====================================
⏱️  Сборка может занять 10-15 минут
📧 Уведомление придет на email
📱 APK файл будет доступен для скачивания
🔗 Ссылка появится в консоли после сборки
=====================================
⚠️  Не закрывайте окно до завершения!
=====================================" -ForegroundColor Cyan

# Инициализируем проект (если нужно)
try {
    eas build:configure
} catch {
    Write-Host "⚠️ Проект уже настроен или произошла ошибка конфигурации" -ForegroundColor Yellow
}

# Запускаем сборку APK
eas build --platform android --profile preview

Write-Host ""
Write-Host "✅ Сборка завершена!" -ForegroundColor Green
Write-Host "📱 APK файл можно скачать по ссылке выше" -ForegroundColor Green
Write-Host "📋 Установите APK на Android устройство для тестирования" -ForegroundColor Cyan

Read-Host "Нажмите Enter для закрытия"