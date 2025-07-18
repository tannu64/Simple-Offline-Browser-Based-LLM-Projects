# 🤖 TinyLlama Browser Chatbot

An **offline, browser-based AI chatbot** powered by TinyLlama 1.1B using WebLLM and WebGPU acceleration. This project demonstrates how to run a quantized Large Language Model (LLM) entirely in your web browser without any server backend.

![TinyLlama Chatbot](https://img.shields.io/badge/AI-TinyLlama%201.1B-blue) ![WebLLM](https://img.shields.io/badge/WebLLM-v0.2.46-green) ![WebGPU](https://img.shields.io/badge/WebGPU-Accelerated-orange) ![Offline](https://img.shields.io/badge/Mode-Offline-red)

## ✨ Features

- 🧠 **TinyLlama 1.1B Model**: Compact yet capable AI model optimized for speed
- 🌐 **Runs in Browser**: No server required, completely client-side
- ⚡ **WebGPU Acceleration**: Hardware-accelerated inference using WebGPU
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🔒 **Privacy-First**: All processing happens locally, no data sent to servers
- 💾 **Offline Capable**: Works without internet connection after initial load
- 🎨 **Modern UI**: Beautiful, intuitive chat interface with typing indicators
- 📊 **Real-time Progress**: Visual feedback during model loading

## 🔧 Requirements

### Browser Support
- **Chrome/Chromium 113+** (Recommended)
- **Edge 113+**
- **Firefox 110+** (with WebGPU enabled)
- **Safari 16.4+** (experimental WebGPU support)

### System Requirements
- **RAM**: 4GB+ available (8GB+ recommended)
- **WebGPU Support**: Required for GPU acceleration
- **Internet Connection**: Only needed for initial model download (~600MB)

### WebGPU Support Check
You can check if your browser supports WebGPU by visiting: `chrome://gpu/` or `edge://gpu/`

## 🚀 Quick Start

### Method 1: Python HTTP Server (Recommended)
```bash
# Clone or download the project files
# Navigate to the project directory
cd tinyllama-browser-chatbot

# Start a local HTTP server
python -m http.server 8000

# Open your browser and visit:
# http://localhost:8000
```

### Method 2: Node.js HTTP Server
```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to the project directory
cd tinyllama-browser-chatbot

# Start the server
npx http-server -p 8000 -c-1

# Open your browser and visit:
# http://localhost:8000
```

### Method 3: Using Package Scripts
```bash
# If you have the package.json file
npm install
npm start
```

## 📁 Project Structure

```
tinyllama-browser-chatbot/
├── index.html          # Main HTML file with chat interface
├── styles.css          # CSS styling for the chat UI
├── app.js              # JavaScript with WebLLM integration
├── package.json        # Project configuration and scripts
└── README.md           # This file
```

## 💡 How It Works

1. **Automatic Model Download**: The app automatically downloads TinyLlama 1.1B (~600MB) - **no manual installation needed!**
2. **Browser Caching**: Model files are cached in your browser for offline use
3. **WebLLM Engine**: Initializes the WebLLM engine with WebGPU acceleration
4. **Chat Interface**: Provides a modern chat UI for interaction
5. **Local Inference**: All AI processing happens in your browser using WebGPU
6. **Offline Operation**: Once downloaded and cached, works completely offline

### 🔄 Model Download Process
- **First Visit**: Downloads ~600MB model files (2-5 minutes)
- **Subsequent Visits**: Uses cached model (loads in 30-60 seconds)
- **No Server Required**: Everything runs in your browser
- **Privacy First**: No data sent to external servers

## 🎯 Usage Tips

### First Time Setup
- **Initial Load**: The first time you run the app, it will download the model files (~600MB)
- **Loading Time**: Model loading typically takes 2-5 minutes depending on your internet speed
- **Memory Usage**: The model requires about 2-3GB of RAM when loaded

### Chat Tips
- **Clear Communication**: TinyLlama works best with clear, specific questions
- **Context Aware**: The model maintains conversation context within the session
- **Response Time**: Responses typically generate in 1-5 seconds depending on your hardware
- **Model Limitations**: As a 1.1B parameter model, it's smaller than ChatGPT but still quite capable

### Performance Optimization
- **Close Unused Tabs**: Free up system memory for better performance
- **Use Chrome/Edge**: These browsers have the best WebGPU support
- **Desktop Recommended**: Mobile devices may have limited memory/performance

## 🛠️ Troubleshooting

### Common Issues

**"WebGPU not supported" Error**
- Ensure you're using a supported browser version
- Enable WebGPU in browser flags if needed:
  - Chrome: `chrome://flags/#enable-unsafe-webgpu`
  - Firefox: `about:config` → `dom.webgpu.enabled`

**Model Loading Fails**
- Check your internet connection for the initial download
- Clear browser cache and try again (`Ctrl+Shift+Delete`)
- Ensure you have enough available RAM (4GB+)
- Try opening browser console (F12) to see specific error messages
- If first model fails, the app will automatically try alternative models

**Slow Performance**
- Close other browser tabs and applications
- Try refreshing the page to reload the model
- Consider using a device with more RAM

**Chat Not Responding**
- Wait for the model to fully load (green checkmark in status)
- Check browser console for error messages
- Try refreshing the page

### Browser Console
Open Developer Tools (F12) and check the Console tab for detailed error messages.

## 🔬 Technical Details

### Model Information
- **Model**: TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC
- **Parameters**: 1.1 billion
- **Quantization**: 4-bit for efficiency
- **Size**: ~600MB compressed
- **Architecture**: Llama-based transformer

### WebLLM Features Used
- **Model Loading**: Automatic download and caching
- **GPU Acceleration**: WebGPU-powered inference
- **Streaming**: Real-time response generation
- **Memory Management**: Efficient model caching

### Security & Privacy
- **No Data Transmission**: All processing happens locally
- **CORS Safe**: Designed to work with local servers
- **Cache Friendly**: Models cached for offline use
- **No Telemetry**: No usage data collected

## 🤝 Contributing

This project is designed for educational and demonstration purposes. Feel free to:

- Fork the repository
- Submit bug reports
- Suggest improvements
- Add new features

## 📚 Learn More

### Related Technologies
- [WebLLM](https://github.com/mlc-ai/web-llm) - ML compiler for LLMs in browsers
- [TinyLlama](https://github.com/jzhang38/TinyLlama) - Compact Llama model
- [WebGPU](https://www.w3.org/TR/webgpu/) - Modern web graphics API
- [MLC-LLM](https://github.com/mlc-ai/mlc-llm) - Machine learning compilation for LLMs

### Other WebLLM Examples
- [Official WebLLM Examples](https://github.com/mlc-ai/web-llm/tree/main/examples)
- [WebLLM Documentation](https://mlc.ai/web-llm/)

## 📄 License

This project is licensed under the MIT License - see the package.json file for details.

## ⚠️ Disclaimer

This project is for educational and demonstration purposes. The AI model may generate incorrect or inappropriate content. Always verify important information from reliable sources.

---

**Enjoy chatting with TinyLlama! 🦙** 