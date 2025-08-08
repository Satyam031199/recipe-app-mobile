# Recipe App 📱

A modern, cross-platform Recipe App built with **Expo** and **React Native**. Discover delicious recipes from TheMealDB, watch cooking tutorials, and save your favorites with a beautiful, intuitive interface.

## ✨ Features

- **🍽️ Recipe Discovery**: Browse and search thousands of recipes from TheMealDB
- **📖 Rich Recipe Details**: View ingredients, instructions, cook time, servings, and cuisine origin
- **🎥 Video Tutorials**: Watch embedded YouTube cooking tutorials directly in the app
- **🔐 Authentication**: Secure sign-in/sign-up with Clerk
- **❤️ Favorites**: Save and manage your favorite recipes with backend sync
- **🎨 Modern UI**: Beautiful gradients, smooth animations, and intuitive navigation
- **📱 Cross-Platform**: Works on iOS, Android, and Web

## 🛠️ Tech Stack

### Core Framework
- **Expo** - React Native development platform
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe JavaScript

### Navigation & Routing
- **Expo Router** - File-based routing system
- **React Navigation** - Tab navigation and screen transitions
- **React Native Gesture Handler** - Smooth touch interactions

### Data Management
- **TanStack Query** - Server state management and caching
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### Authentication
- **Clerk** - User authentication and session management
- **Expo Secure Store** - Secure token storage

### UI & Media
- **Expo Image** - High-performance image loading
- **Expo Vector Icons** - Icon library (Ionicons)
- **Expo Linear Gradient** - Beautiful gradient effects
- **React Native WebView** - Embedded video playback
- **React Native Toast Message** - In-app notifications
- **Expo Haptics** - Tactile feedback

### Styling
- **NativeWind** - Utility-first CSS framework
- **Tailwind CSS** - Design system

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-app/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the mobile directory
   - Add your Clerk publishable key:
     ```
     EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
     ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web browser
   - Scan QR code with Expo Go app on your device

## 📱 App Structure

```
mobile/
├── app/                    # File-based routing
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── recipe/            # Recipe detail screens
├── components/            # Reusable UI components
├── services/              # API services and utilities
├── constants/             # App constants and configurations
├── assets/                # Images, fonts, and styles
└── types/                 # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## 🌐 API Integration

- **TheMealDB** - Recipe data and images
- **YouTube** - Embedded video tutorials
- **Custom Backend** - Favorites management

## 📸 Screenshots

*Add screenshots of your app here*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TheMealDB](https://www.themealdb.com/) for recipe data
- [Expo](https://expo.dev/) for the amazing development platform
- [Clerk](https://clerk.dev/) for authentication
- [React Native](https://reactnative.dev/) community

---

Made with ❤️ using Expo and React Native
