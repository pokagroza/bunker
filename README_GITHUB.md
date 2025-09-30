# 🏠 Bunker Game - Survival Multiplayer Game

<div align="center">

![Bunker Game Logo](https://img.shields.io/badge/🏠-BUNKER%20GAME-green?style=for-the-badge&labelColor=black)

**A thrilling multiplayer survival game where players must convince others they deserve a spot in the bunker!**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-purple.svg)](https://reactnative.dev/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.7-red.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[🎮 Play Now](#-quick-start) • [📱 Mobile App](#-mobile-app) • [⚙️ Admin Panel](#️-admin-panel) • [📖 Documentation](#-documentation)

</div>

## 🎯 Features

- 🌐 **Web Application** - Full-featured React app
- 📱 **Mobile App** - React Native with Expo  
- ⚙️ **Admin Panel** - Complete game master control
- 🎭 **1000+ Characters** - Unique personality combinations
- 🗳️ **Real-time Voting** - Live elimination system
- 📦 **Resource Management** - Bunker survival mechanics
- ⚡ **Random Events** - Dynamic gameplay challenges
- 🎨 **Bunker Theme** - Immersive post-apocalyptic design

## 🚀 Quick Start

### 🌐 Web Version

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bunker-game.git
   cd bunker-game
   ```

2. **Auto-install and run:**
   ```powershell
   # Windows PowerShell
   .\start-game.ps1
   ```

3. **Open your browser:** http://localhost:5000

### 📱 Mobile App

1. **Install Expo Go** on your phone:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. **Start mobile app:**
   ```powershell
   .\start-mobile.ps1
   ```

3. **Scan QR code** with Expo Go app

## 🎮 How to Play

1. **Create or join** a game room
2. **Get your character** with random traits
3. **Reveal cards** one by one strategically  
4. **Convince others** of your survival value
5. **Vote to eliminate** players from the bunker
6. **Survive** to win!

## ⚙️ Admin Panel

Game masters get powerful tools:
- 👥 **Player Management** - View all character details
- 📊 **Resource Control** - Manage bunker supplies
- ⚡ **Event Triggering** - Launch random challenges
- 🎮 **Game Control** - Force actions and restart

Access: Click "Admin Panel" on main menu

## 🛠️ Technology Stack

**Backend:**
- Node.js + Express
- Socket.io (WebSocket)
- Real-time synchronization

**Web Frontend:**
- React 18
- CSS3 with bunker theme
- Responsive design

**Mobile:**
- React Native + Expo
- Cross-platform (iOS/Android)
- Native performance

## 📁 Project Structure

```
bunker-game/
├── 🌐 server/          # Backend (Node.js + Socket.io)
├── 💻 client/          # Web app (React)
├── 📱 mobile/          # Mobile app (React Native)
├── 🚀 *.ps1           # Auto-run scripts
└── 📚 README.md       # This file
```

## 🔧 Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Development mode (hot reload)
.\dev-start.ps1

# Web: http://localhost:3000
# Server: http://localhost:5000
```

### Build for Production
```bash
# Build web client
cd client && npm run build

# Start production server
cd ../server && npm start
```

## 🎭 Game Content

- **50+ Professions** - From doctors to artists
- **Multiple Hobbies** - Survival-relevant skills
- **Health Conditions** - Physical/mental states
- **Phobias & Traits** - Character depth
- **5 Disaster Scenarios** - Nuclear war, zombies, climate change, asteroid, pandemic

## 🌟 Screenshots

<div align="center">

| Web Version | Mobile App | Admin Panel |
|-------------|------------|-------------|
| ![Web](https://via.placeholder.com/200x120/1a1a1a/00ff88?text=Web+Game) | ![Mobile](https://via.placeholder.com/200x120/1a1a1a/00ff88?text=Mobile+App) | ![Admin](https://via.placeholder.com/200x120/1a1a1a/ffaa00?text=Admin+Panel) |

</div>

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic Bunker board game
- Built with modern web technologies
- Designed for post-apocalyptic survival fun

---

<div align="center">

**🎮 Ready to fight for your spot in the bunker? 🏠**

[⭐ Star this repo](../../stargazers) • [🐛 Report bugs](../../issues) • [💡 Request features](../../issues)

Made with ❤️ for survival game enthusiasts

</div>