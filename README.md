# SnapDish Flutter

An AI-powered recipe generation app built with Flutter. Capture photos of food and get instant recipe suggestions powered by AI.

## Features

- 📸 **Camera Integration**: Take photos or select from gallery
- 🤖 **AI Recipe Generation**: Get detailed recipes from food photos
- 📱 **Cross-Platform**: Works on both iOS and Android
- 💾 **Local Storage**: Save and manage your favorite recipes
- ❤️ **Favorites**: Mark recipes as favorites for quick access
- 🔍 **Search & Filter**: Find recipes by difficulty and other criteria
- 📤 **Share**: Share recipes with friends and family

## Screenshots

*Add screenshots of your app here*

## Getting Started

### Prerequisites

- Flutter SDK (3.10.0 or higher)
- Dart SDK
- Android Studio / Xcode for mobile development
- A device or emulator for testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snapdish_flutter
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

### Building for Production

#### Android
```bash
# Build APK
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release
```

#### iOS
```bash
flutter build ios --release
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   └── recipe.dart
├── screens/                  # UI screens
│   ├── home_screen.dart
│   ├── camera_screen.dart
│   ├── gallery_screen.dart
│   ├── recipes_screen.dart
│   ├── settings_screen.dart
│   ├── recipe_detail_screen.dart
│   └── recipe_result_screen.dart
├── services/                 # Business logic
│   ├── storage_service.dart
│   └── openai_service.dart
└── utils/                    # Utilities
    └── theme.dart
```

## Configuration

### Camera Permissions

The app requires camera permissions to function properly. These are automatically requested when the camera is first accessed.

**Android**: Permissions are declared in `android/app/src/main/AndroidManifest.xml`
**iOS**: Add camera usage description in `ios/Runner/Info.plist`

### API Integration

Currently, the app uses mock data for recipe generation. To integrate with a real AI service:

1. Update `lib/services/openai_service.dart`
2. Add your API key to environment variables
3. Implement the actual API calls

## Dependencies

Key dependencies used in this project:

- `camera`: Camera functionality
- `image_picker`: Gallery image selection
- `shared_preferences`: Local data storage
- `google_fonts`: Typography
- `share_plus`: Sharing functionality
- `cached_network_image`: Image caching

## CI/CD

This project includes GitLab CI/CD configuration:

- **Code Quality**: Automated code analysis
- **Testing**: Unit and widget tests
- **Building**: Automated APK/AAB generation
- **Deployment**: Staging and production pipelines

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## Roadmap

- [ ] Real AI integration (OpenAI Vision API)
- [ ] User authentication
- [ ] Cloud storage sync
- [ ] Recipe sharing community
- [ ] Nutrition information
- [ ] Shopping list generation
- [ ] Meal planning features

---

Built with ❤️ using Flutter