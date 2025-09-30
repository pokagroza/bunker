#!/bin/bash

# Скрипт для инициализации Git репозитория и первого коммита

echo "🚀 Инициализация Git репозитория для проекта Бункер..."

# Проверяем, установлен ли Git
if ! command -v git &> /dev/null; then
    echo "❌ Git не найден! Установите Git с https://git-scm.com/"
    exit 1
fi

# Инициализируем репозиторий, если он еще не создан
if [ ! -d ".git" ]; then
    echo "📁 Инициализация Git репозитория..."
    git init
else
    echo "✅ Git репозиторий уже существует"
fi

# Добавляем все файлы
echo "📝 Добавление файлов в Git..."
git add .

# Проверяем статус
echo "📊 Статус репозитория:"
git status

# Создаем первый коммит
echo "💾 Создание первого коммита..."
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
- Web: npm start
- Mobile: Expo Go app

🎯 Technologies:
- Backend: Node.js, Express, Socket.io
- Frontend: React, CSS3
- Mobile: React Native, Expo
- Real-time: WebSocket connections"

echo ""
echo "✅ Git репозиторий готов!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Создайте репозиторий на GitHub"
echo "2. Добавьте remote origin:"
echo "   git remote add origin https://github.com/ваш-логин/bunker-game.git"
echo "3. Отправьте код:"
echo "   git push -u origin main"
echo ""
echo "🔗 Полезные команды:"
echo "   git status          - статус изменений"
echo "   git add .           - добавить все файлы"
echo "   git commit -m '...' - создать коммит"
echo "   git push           - отправить на GitHub"
echo ""