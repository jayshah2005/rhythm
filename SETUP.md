# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up API Keys
```bash
# Copy the example environment file
cp config/env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

**Required API Keys:**
- **Gemini AI**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Arcade.dev**: Get from [Arcade.dev](https://arcade.dev/)

### 3. Start the App
```bash
npm start
```

### 4. Run on Your Device
- **Mobile**: Scan QR code with Expo Go app
- **iOS**: Press `i` in terminal
- **Android**: Press `a` in terminal
- **Web**: Press `w` in terminal

## 🔑 API Keys Setup

### Gemini AI (Required for text suggestions)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and add to `.env`:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```

### Arcade.dev (Required for YouTube videos)
1. Go to [Arcade.dev](https://arcade.dev/)
2. Sign up for an account
3. Get your API key from dashboard
4. Add to `.env`:
   ```env
   ARCADE_API_KEY=your_actual_key_here
   ```

## 🎯 Features Overview

- **Pomodoro Timer**: 25-min work, customizable breaks
- **AI Break Suggestions**: Personalized activities via Gemini
- **YouTube Videos**: 50% chance for video suggestions (5+ min breaks)
- **Mood Tracking**: Track your productivity mood
- **Statistics**: Daily progress and insights
- **Dark/Light Mode**: Comfortable viewing

## 🛠️ Troubleshooting

### App won't start
- Check if all dependencies are installed: `npm install`
- Verify Node.js version: `node --version` (should be 20.10.0+)

### API keys not working
- Ensure `.env` file exists in project root
- Check API keys are correctly formatted (no quotes, no spaces)
- Restart the development server after adding keys

### YouTube videos not showing
- Verify Arcade.dev API key is correct
- Check internet connection
- App will fallback to text suggestions if YouTube fails

### Build errors
- Clear cache: `expo start -c`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📱 Testing the App

1. **Start a work session** - Tap "Start Session"
2. **Wait for break** - Timer will automatically switch to break
3. **Check break activity** - Should show AI suggestion or YouTube video
4. **Select mood** - Choose how you feel after the session
5. **View stats** - Check your progress on the home screen

## 🔒 Security Notes

- **Never commit API keys** to version control
- **`.env` file is ignored** by git automatically
- **Use environment variables** in production
- **Rotate API keys** regularly for security

---

**Need help?** Check the full [README.md](README.md) or create an issue on GitHub.
