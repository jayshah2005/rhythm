# Rhythm - Pomodoro Timer App

A beautiful and intelligent Pomodoro timer app built with React Native and Expo, featuring AI-powered break suggestions and YouTube video recommendations.

## 🌟 Features

### Core Functionality
- **Pomodoro Timer**: 25-minute work sessions with customizable break times
- **Mood Tracking**: Track your mood after each work session
- **Progress Statistics**: View daily work time, completed cycles, and overall mood
- **Dark/Light Mode**: Toggle between themes for comfortable usage

### AI-Powered Break Activities
- **Gemini AI Integration**: Get personalized break activity suggestions
- **YouTube Video Recommendations**: 50% chance for video suggestions during 5+ minute breaks
- **Mood-Based Suggestions**: Activities tailored to your current mood and break duration
- **Smart Fallbacks**: Automatic fallback to text suggestions if video search fails

### Break Activity Types
- **Short Breaks (<5 min)**: Always get AI text suggestions
- **Medium Breaks (5-9 min)**: 50% chance for YouTube videos
- **Long Breaks (10+ min)**: 50% chance for YouTube videos with extended activities

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.10.0 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rhythm-1.git
   cd rhythm-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp config/env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ARCADE_API_KEY=your_arcade_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 🔑 API Keys Setup

### Gemini AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GEMINI_API_KEY`

### Arcade.dev API Key
1. Visit [Arcade.dev](https://arcade.dev/)
2. Sign up and get your API key
3. Add it to your `.env` file as `ARCADE_API_KEY`

## 📱 App Structure

```
rhythm-1/
├── components/
│   ├── BreakActivity.js      # AI break suggestions & YouTube videos
│   ├── HomeScreen.js         # Main dashboard with stats
│   ├── LiquidProgress.js     # Animated progress indicator
│   ├── MoodSelector.js       # Mood selection interface
│   └── PomodoroTimer.js      # Main timer component
├── services/
│   ├── arcade.js            # YouTube video search via Arcade.dev
│   └── geminiService.js     # AI break activity suggestions
├── config/
│   ├── env.js               # Environment variable configuration
│   └── env.example          # Example environment file
├── utils/
│   └── database.js          # SQLite database for stats
└── assets/                  # App icons and images
```

## 🎯 How It Works

### Pomodoro Sessions
1. **Start Session**: Begin a 25-minute work timer
2. **Work Phase**: Focus on your task with visual progress indicator
3. **Break Time**: Take a break with AI-suggested activities
4. **Mood Selection**: Track how you feel after each session
5. **Statistics**: View your productivity patterns

### Break Activity Selection
The app intelligently chooses between AI text suggestions and YouTube videos:

- **Break Time < 5 minutes**: Always shows AI text suggestions
- **Break Time ≥ 5 minutes**: 50% chance for YouTube videos
- **Mood-Based Keywords**: Different search terms based on your mood
- **Duration-Specific**: Keywords adapt to break length

### YouTube Video Integration
When a video is selected:
1. **Search**: Uses Arcade.dev API to find relevant videos
2. **Popup Modal**: Shows video title, channel, and description
3. **Watch Button**: Opens video directly in YouTube app
4. **Fallback**: If video search fails, shows AI text suggestion

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key
- `ARCADE_API_KEY`: Your Arcade.dev API key
- `NODE_ENV`: Environment (development/production)

### Customization
- Modify break durations in `PomodoroTimer.js`
- Add new mood types in `MoodSelector.js`
- Customize YouTube keywords in `BreakActivity.js`
- Adjust AI prompts in `geminiService.js`

## 📊 Database Schema

The app uses SQLite to store:
- **Sessions**: Work/break cycles with timestamps
- **Moods**: User mood selections
- **Statistics**: Daily aggregated data

## 🚀 Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for web
expo build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Happy Productivity! 🎯**
