# 🚀 Simple Offline Browser-Based LLM Projects

A collection of **privacy-first, browser-based AI applications** that run completely offline using cutting-edge web technologies. No servers, no data transmission, just powerful AI running in your browser.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Private-red.svg)
![Offline](https://img.shields.io/badge/Mode-Offline%20Ready-orange.svg)
![WebGPU](https://img.shields.io/badge/WebGPU-Accelerated-green.svg)

## 📱 Project Showcase

### 🤖 [TinyLlama Browser Chatbot](./tinyllama-browser-chatbot/)
![TinyLlama Chatbot](./TinyLlama%20Chatbot.png)

**Offline AI chatbot powered by TinyLlama 1.1B with WebGPU acceleration**

- 🧠 **TinyLlama 1.1B Model**: Compact yet capable AI model
- ⚡ **WebGPU Acceleration**: Hardware-accelerated inference
- 🌐 **Browser-Based**: No server required, completely client-side
- 🔒 **Privacy-First**: All processing happens locally
- 💾 **Offline Capable**: Works without internet after initial load

**Tech Stack**: WebLLM, WebGPU, Vanilla JavaScript

---

### 🎭 [AI Sentiment Analysis Tool](./sentiment-analysis-tool/)
![AI Sentiment Analysis](./AI%20Sentiment%20Analysis.png)

**Privacy-first sentiment analysis using state-of-the-art BERT models**

- 🤖 **Multiple BERT Models**: DistilBERT, BERT Multilingual, RoBERTa
- 📊 **Comprehensive Analysis**: Detailed sentiment scores with confidence
- 🔒 **100% Client-Side**: No data leaves your browser
- ⚡ **Real-time Analysis**: Instant sentiment detection
- 🎯 **High Accuracy**: State-of-the-art transformer architectures

**Tech Stack**: Transformers.js, ONNX Runtime, BERT Models

---

### 📝 [Smart To-Do App with AI Suggestions](./Offline%20To-Do%20App%20with%20Smart%20Suggestions/)
![Smart To-Do App](./Smart%20To-Do%20App.png)

**AI-powered task management with smart suggestions**

- 🤖 **AI-Powered Suggestions**: Contextual task recommendations
- 📱 **PWA Ready**: Installable as a web app
- 🌐 **Offline Capable**: Service worker for offline functionality
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations
- 📊 **Task Statistics**: Real-time progress tracking

**Tech Stack**: Vanilla JavaScript, ONNX Runtime Web, Service Workers

---

### 🎓 [AI Flashcards for Language Learning](./AI%20Flashcards%20for%20Language%20Learning/)
![AI Flashcards](./AI%20Flashcards.png)

**Interactive language learning with local AI-generated examples**

- 🧠 **Local AI Processing**: Uses Ollama for local AI generation
- 🎯 **Interactive Flashcards**: Click to flip and generate examples
- 📚 **Vocabulary Management**: Add, remove, and navigate word lists
- 💾 **Persistent Storage**: Words saved in browser localStorage
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

**Tech Stack**: Ollama, Vanilla JavaScript, Local AI Models

## ✨ Key Features Across All Projects

### 🔒 **Privacy & Security**
- **100% Client-Side Processing**: No data leaves your browser
- **No Server Dependencies**: Everything runs locally
- **GDPR Compliant**: No tracking, cookies, or data collection
- **Open Source**: Full code transparency

### 🌐 **Offline Capability**
- **Service Workers**: Works without internet after initial setup
- **Local Storage**: Data persists between sessions
- **Model Caching**: AI models cached for offline use
- **PWA Support**: Installable as web apps

### ⚡ **Performance**
- **WebGPU Acceleration**: Hardware-accelerated AI inference
- **Optimized Models**: Quantized and compressed for speed
- **Memory Efficient**: Minimal resource usage
- **Fast Loading**: Optimized for quick startup

### 🎨 **User Experience**
- **Modern Design**: Beautiful, responsive interfaces
- **Smooth Animations**: Professional-grade interactions
- **Cross-Platform**: Works on desktop, tablet, and mobile
- **Intuitive UI**: Easy-to-use interfaces

## 🚀 Quick Start

### Prerequisites
- **Modern Browser**: Chrome 88+, Firefox 90+, Safari 14+, Edge 88+
- **WebGPU Support**: Required for TinyLlama chatbot (Chrome 113+)
- **Memory**: 4GB+ RAM recommended
- **Storage**: ~1GB for model caching

### Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/simple-offline-browser-llm-projects.git
   cd simple-offline-browser-llm-projects
   ```

2. **Choose a project** and navigate to its directory:
   ```bash
   cd tinyllama-browser-chatbot
   # or
   cd sentiment-analysis-tool
   # or
   cd "Offline To-Do App with Smart Suggestions"
   # or
   cd "AI Flashcards for Language Learning"
   ```

3. **Start a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   ```

4. **Open in browser**: Visit `http://localhost:8000`

## 🛠️ Technology Stack

### **Core Technologies**
- **WebLLM**: Browser-based LLM inference
- **Transformers.js**: Hugging Face models in browser
- **ONNX Runtime Web**: Optimized AI inference
- **WebGPU**: Hardware acceleration
- **Service Workers**: Offline functionality
- **PWA**: Progressive Web App features

### **AI Models**
- **TinyLlama 1.1B**: Compact chatbot model
- **BERT Models**: Sentiment analysis (DistilBERT, Multilingual, RoBERTa)
- **Ollama Models**: Local AI for flashcards
- **Custom Models**: Task-specific AI for to-do suggestions

### **Frontend**
- **Vanilla JavaScript**: No frameworks, pure performance
- **Modern CSS**: Flexbox, Grid, animations
- **HTML5**: Semantic markup and modern APIs
- **ES6+**: Modern JavaScript features

## 📊 Performance Benchmarks

| Project | Model Size | Load Time | Memory Usage | Analysis Speed |
|---------|------------|-----------|--------------|----------------|
| TinyLlama Chatbot | ~600MB | 2-5 min | 2-3GB | 1-5 sec/response |
| Sentiment Analysis | 67-167MB | 10-60 sec | 150-300MB | 100-1000ms |
| Smart To-Do | <1MB | Instant | 50MB | Instant |
| AI Flashcards | Varies | 10-30 sec | 100-500MB | 5-30 sec |

## 🔧 Development

### **Local Development**
Each project is self-contained and can be developed independently:

```bash
# Navigate to any project
cd project-name

# Start development server
python -m http.server 8000

# Open in browser
open http://localhost:8000
```

### **Customization**
- **Model Selection**: Choose different AI models for each project
- **UI Theming**: Modify CSS for custom styling
- **Feature Addition**: Extend functionality with vanilla JavaScript
- **Performance Tuning**: Optimize for your specific use case

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Bug Reports**: Use GitHub issues for bugs
2. **💡 Feature Requests**: Suggest improvements
3. **📖 Documentation**: Improve guides and examples
4. **🧪 Testing**: Test on different devices/browsers
5. **🔧 Code**: Submit pull requests

### **Development Guidelines**
- **Code Style**: Follow existing patterns
- **Testing**: Add tests for new features
- **Documentation**: Update README for changes
- **Browser Support**: Maintain compatibility

## 📚 Resources

### **Learning Materials**
- [WebLLM Documentation](https://mlc.ai/web-llm/)
- [Transformers.js Guide](https://huggingface.co/docs/transformers.js)
- [WebGPU Tutorial](https://web.dev/webgpu/)
- [PWA Development](https://web.dev/progressive-web-apps/)

### **Related Projects**
- [Hugging Face Model Hub](https://huggingface.co/models)
- [ONNX Runtime](https://onnxruntime.ai/)
- [WebAssembly](https://webassembly.org/)
- [Ollama](https://ollama.ai/)

## 📄 License

This project is licensed under the **MIT License** - see individual project directories for specific license details.

### **Third-Party Licenses**
- **WebLLM**: Apache 2.0 License
- **Transformers.js**: Apache 2.0 License
- **ONNX Runtime**: MIT License
- **Model Weights**: Individual model licenses (typically Apache 2.0)

## 🙏 Acknowledgments

### **Special Thanks**
- **🤗 Hugging Face**: For Transformers.js and model hosting
- **🧠 MLC-AI**: For WebLLM and browser ML compilation
- **⚡ Microsoft**: For ONNX Runtime optimization
- **🌐 Mozilla**: For WebAssembly development
- **👥 Open Source Community**: For continuous improvements

### **Model Credits**
- **TinyLlama**: Zhang et al. (TinyLlama team)
- **BERT**: Google Research team
- **DistilBERT**: Hugging Face team
- **RoBERTa**: Facebook AI Research team

## 🚀 Getting Started Now

1. **📥 Clone**: `git clone https://github.com/tannu64/simple-offline-browser-llm-projects.git`
2. **🌐 Choose**: Pick any project that interests you
3. **⚡ Start**: Run the local server and open in browser
4. **🎯 Explore**: Try different AI models and features
5. **🔧 Customize**: Modify and extend for your needs

**Need help?** Check individual project READMEs or open an issue!

---

**Made with ❤️ for privacy-conscious AI applications**

*Empowering users with powerful AI tools that respect their privacy and work offline.* 