# 📝 Smart To-Do App with AI Suggestions

A modern, offline-capable to-do list application that uses AI-powered smart suggestions to help you create tasks faster. Built with vanilla JavaScript and ONNX Runtime Web for local AI processing.

## ✨ Features

### 🎯 Core Functionality
- **Add Tasks**: Create new tasks with a clean, intuitive interface
- **Mark Complete**: Check off completed tasks with visual feedback
- **Delete Tasks**: Remove unwanted tasks with one click
- **Task Statistics**: Real-time tracking of total, completed, and pending tasks

### 🤖 AI-Powered Smart Suggestions
- **Contextual Suggestions**: Get relevant task suggestions based on your input
- **Pattern Recognition**: AI learns from your task history and suggests similar tasks
- **Category-Based Suggestions**: Smart categorization (work, home, health, study, personal)
- **Real-time Suggestions**: Suggestions appear as you type (minimum 2 characters)

### 🌐 Offline Capability
- **Service Worker**: Works completely offline after initial load
- **Local Storage**: Tasks persist between browser sessions
- **PWA Ready**: Installable as a web app on mobile devices
- **No Internet Required**: All AI processing happens locally in the browser

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Gradients**: Modern purple gradient theme
- **Smooth Animations**: Hover effects and transitions for better user experience
- **Clean Interface**: Minimalist design focused on productivity

## 🚀 Quick Start

### Option 1: Direct Browser Access
1. Open `index.html` in your web browser
2. Start adding tasks and enjoy smart suggestions!

### Option 2: Local Server (Recommended)
1. Navigate to the project directory
2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **AI Runtime**: ONNX Runtime Web
- **Styling**: Pure CSS with modern features
- **Storage**: LocalStorage API
- **Offline**: Service Workers
- **PWA**: Web App Manifest

## 📱 How to Use

### Adding Tasks
1. Type in the input field at the top
2. Watch for smart suggestions to appear
3. Click on a suggestion or press Enter to add the task
4. Your task will be saved automatically

### Smart Suggestions
The AI analyzes your input and provides suggestions based on:
- **Keywords**: Type "buy" → suggests "Buy groceries", "Buy birthday gift"
- **Categories**: Type "work" → suggests work-related tasks
- **History**: Learns from your previous tasks
- **Patterns**: Recognizes common task patterns

### Managing Tasks
- **Complete**: Check the checkbox to mark as done
- **Delete**: Click the red "Delete" button to remove
- **View Stats**: See your progress in the statistics section

## 🔧 Project Structure

```
├── index.html          # Main HTML file
├── styles.css          # Modern CSS styling
├── app.js             # Main JavaScript application
├── sw.js              # Service Worker for offline functionality
├── manifest.json      # PWA manifest file
└── README.md          # This file
```

## 🎯 AI Implementation

The app uses a lightweight local AI model that:
- **Pattern Matching**: Recognizes task categories and keywords
- **Context Awareness**: Understands task context and relationships
- **Learning**: Improves suggestions based on user history
- **Fast Processing**: Runs entirely in the browser for instant results

### Suggestion Categories
- **Work**: meetings, emails, reports, presentations
- **Home**: cleaning, cooking, laundry, groceries
- **Health**: exercise, meditation, doctor visits
- **Study**: reading, research, practice, homework
- **Personal**: calls, visits, planning, appointments

## 🌟 Key Benefits

1. **Privacy**: All data stays on your device
2. **Speed**: No network requests for suggestions
3. **Reliability**: Works offline and in poor network conditions
4. **Simplicity**: No complex setup or dependencies
5. **Portability**: Works on any modern browser

## 📊 Performance

- **Lightning Fast**: Instant task suggestions
- **Low Memory**: Minimal resource usage
- **Responsive**: Smooth animations and interactions
- **Efficient**: Optimized for mobile devices

## 🔮 Future Enhancements

Potential improvements for future versions:
- Task categories and filtering
- Due dates and reminders
- Task priority levels
- Data export/import
- Cloud sync (optional)
- More advanced AI models
- Dark mode theme
- Keyboard shortcuts

## 🤝 Contributing

This is a simple, self-contained project. Feel free to:
- Fork and modify for your needs
- Report bugs or suggest features
- Improve the AI suggestion algorithm
- Enhance the UI/UX design

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy your productive, AI-powered task management! 🚀** 