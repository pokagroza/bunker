# 🚀 Публикация проекта на GitHub

## 📋 Инструкция по загрузке на GitHub

### 1. Создание репозитория на GitHub

1. **Перейдите на [GitHub.com](https://github.com)**
2. **Войдите в аккаунт** или создайте новый
3. **Нажмите "New repository"** (зеленая кнопка)
4. **Заполните данные:**
   - **Repository name**: `bunker-game`
   - **Description**: `🏠 Bunker Game - Multiplayer survival game with web and mobile versions`
   - **Выберите Public** (чтобы другие могли увидеть)
   - **НЕ создавайте** README, .gitignore или LICENSE (у нас уже есть)

### 2. Подключение к GitHub

Выполните команды в PowerShell в папке проекта:

```powershell
# Добавьте ваш репозиторий (замените YOUR_USERNAME на ваш логин GitHub)
git remote add origin https://github.com/YOUR_USERNAME/bunker-game.git

# Отправьте код на GitHub
git push -u origin main
```

### 3. Настройка GitHub Pages (опционально)

Для автоматического хостинга веб-версии:

1. **Перейдите в Settings** вашего репозитория
2. **Найдите раздел "Pages"**
3. **Source**: Deploy from a branch
4. **Branch**: main
5. **Folder**: / (root)
6. **Нажмите Save**

### 4. Добавление описания проекта

В файле GitHub добавьте **topics (теги)**:
- `game`
- `bunker`
- `survival`
- `react`
- `nodejs`
- `socket-io`
- `react-native`
- `expo`
- `multiplayer`
- `real-time`

## 🔗 Полезные команды Git

```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить на GitHub
git push

# Проверить удаленные репозитории
git remote -v

# Посмотреть историю коммитов
git log --oneline
```

## 📁 Структура после публикации

```
https://github.com/YOUR_USERNAME/bunker-game/
├── 🌐 Веб-версия (React)
├── 📱 Мобильное приложение (React Native)
├── 🎯 Сервер (Node.js + Socket.io)
├── 📚 Документация (README.md)
├── 🚀 Скрипты запуска (.ps1)
└── ⚙️ Конфигурация (package.json, .gitignore)
```

## 🎯 Рекомендации

### Хорошие коммиты:
```bash
git commit -m "✨ Add new character traits"
git commit -m "🐛 Fix voting system bug"
git commit -m "📱 Improve mobile UI"
git commit -m "📚 Update documentation"
```

### Workflow разработки:
1. **Внесите изменения** в код
2. **Протестируйте** локально
3. **Добавьте в Git**: `git add .`
4. **Создайте коммит**: `git commit -m "Описание"`
5. **Отправьте на GitHub**: `git push`

## 🌟 После публикации

1. **Поделитесь ссылкой** на репозиторий
2. **Добавьте звезду** своему проекту ⭐
3. **Пригласите друзей** тестировать игру
4. **Следите за issues** и pull requests

---

**🎮 Ваш проект Бункер теперь доступен всему миру! 🌍**