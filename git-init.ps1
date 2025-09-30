# PowerShell скрипт для инициализации Git репозитория

Write-Host "🚀 Инициализация Git репозитория для проекта Бункер..." -ForegroundColor Green

# Проверяем, установлен ли Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git найден: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git не найден!" -ForegroundColor Red
    Write-Host "Установите Git с сайта: https://git-scm.com/" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit
}

# Переходим в директорию проекта
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Инициализируем репозиторий, если он еще не создан
if (-Not (Test-Path ".git")) {
    Write-Host "📁 Инициализация Git репозитория..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "✅ Git репозиторий уже существует" -ForegroundColor Green
}

# Настраиваем основную ветку как main
git branch -M main

# Добавляем все файлы
Write-Host "📝 Добавление файлов в Git..." -ForegroundColor Yellow
git add .

# Проверяем статус
Write-Host "📊 Статус репозитория:" -ForegroundColor Cyan
git status

# Создаем первый коммит
Write-Host "💾 Создание первого коммита..." -ForegroundColor Yellow
git commit -m "🎮 Initial commit: Bunker Game - Web + Mobile

✨ Features:
- 🌐 Full-featured web application (React + Node.js)
- 📱 Mobile application (React Native + Expo)
- ⚙️ Admin panel for game masters
- 🎭 1000+ character combinations
- 🗳️ Real-time voting system
- 📦 Resource management
- ⚡ Random events system
- 🎨 Bunker-themed design

🚀 Ready to play:
- Web: .\start-game.ps1
- Mobile: .\start-mobile.ps1

🎯 Technologies:
- Backend: Node.js, Express, Socket.io
- Frontend: React, CSS3
- Mobile: React Native, Expo
- Real-time: WebSocket connections"

Write-Host ""
Write-Host "✅ Git репозиторий готов!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Следующие шаги:" -ForegroundColor Cyan
Write-Host "1. Создайте репозиторий на GitHub" -ForegroundColor White
Write-Host "2. Добавьте remote origin:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/ваш-логин/bunker-game.git" -ForegroundColor Gray
Write-Host "3. Отправьте код:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Полезные команды:" -ForegroundColor Cyan
Write-Host "   git status          - статус изменений" -ForegroundColor Gray
Write-Host "   git add .           - добавить все файлы" -ForegroundColor Gray
Write-Host "   git commit -m '...' - создать коммит" -ForegroundColor Gray
Write-Host "   git push           - отправить на GitHub" -ForegroundColor Gray
Write-Host ""

Read-Host "Нажмите Enter для закрытия"