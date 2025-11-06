# QR8

A modern, feature-rich QR code generator and scanner application built with React Native and Expo.

## Overview

QR8 provides a seamless experience for creating, customizing, and managing QR codes. Whether you need to share contact information, WiFi credentials, or web links, QR8 offers an intuitive interface with extensive customization options.

## Features

### QR Code Generation
- **Multiple QR Types**: Create QR codes for various content types:
  - Text
  - URLs/Links
  - Email
  - SMS
  - Phone numbers
  - WiFi credentials
  - vCard (contact information)
  - Events

### Customization
- Custom color schemes for QR codes
- Multiple pattern styles and eye designs
- Full control over QR code appearance

### QR Code Scanner
- Fast and accurate QR code scanning
- Real-time camera preview
- Automatic result parsing

### Library Management
- Save and organize your QR codes
- Quick access to previously created codes
- Share QR codes with others

## Technology Stack

- **React Native** 0.81.4
- **Expo** 54.0.10
- **TypeScript** 5.9.2
- **SQLite** (via expo-sqlite) for local storage
- **React Navigation** for navigation
- **ZXing** and **jsQR** for QR code processing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MiraWision/qr8.git
cd qr8
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Running on Devices

- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`

## Project Structure

```
qr8/
├── assets/          # Images, icons, and audio files
├── src/
│   ├── components/  # Reusable UI components
│   ├── screens/     # Main application screens
│   ├── services/    # Business logic and services
│   ├── storage/     # Database configuration
│   ├── theme/       # Theme configuration
│   ├── types/       # TypeScript type definitions
│   └── utils/       # Utility functions
├── lib/             # Third-party libraries
└── App.tsx          # Application entry point
```

## Permissions

The application requires the following permissions:
- **Camera**: For scanning QR codes
- **Storage**: For saving QR code images and data

## License

This project is private and proprietary.

## Version

Current version: **1.0.0**

---

Built with ❤️ using React Native and Expo

