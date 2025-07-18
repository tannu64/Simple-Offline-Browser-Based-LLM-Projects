# AI Flashcards for Language Learning

A modern, browser-based flashcard application that uses local AI to generate example sentences for vocabulary words. The app connects to Ollama for local AI processing, providing a seamless experience without requiring external servers.

## Features

- **Local AI Processing**: Uses Ollama for local AI generation
- **Interactive Flashcards**: Click to flip cards and generate example sentences
- **Vocabulary Management**: Add, remove, and navigate through your word list
- **Persistent Storage**: Words are saved in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Setup Instructions

### 1. Install Ollama

If you haven't already installed Ollama, follow the official installation guide:
- **Windows**: Download from [ollama.ai](https://ollama.ai)
- **macOS**: `brew install ollama`
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`

### 2. Start Ollama

Start the Ollama service:
```bash
ollama serve
```

### 3. Project Structure

```
AI Flashcards for Language Learning/
├── index.html
├── styles.css
├── app.js
└── README.md
```

### 4. Run the Application

1. Make sure Ollama is running (`ollama serve`)
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. Select a model from the dropdown (the app will automatically download it if needed)
4. Click "Connect to Ollama" to initialize the connection
5. Start adding words and generating examples!

## Usage

### Adding Words
1. Enter a word in the input field
2. Click "Add Word" or press Enter
3. The word will be added to your vocabulary list

### Using Flashcards
1. Click on a word in the vocabulary list or use navigation buttons
2. Click the flashcard to flip it and generate example sentences
3. The AI will generate 1-2 contextual example sentences
4. Use Previous/Next buttons to navigate through your words

### Model Management
- Select your preferred model from the dropdown
- Click "Connect to Ollama" to initialize the connection
- The app will automatically download the model if it's not already installed
- The model status will show connection progress and completion

## Technical Details

### AI Integration
- Uses Ollama API for local AI inference
- Supports various models (Llama 2, Mistral, Code Llama, etc.)
- Configurable parameters for generation (temperature, top_p, etc.)
- Automatic model downloading and management
- Fallback mock implementation for development/testing

### Browser Compatibility
- Modern browsers with fetch API support
- Chrome 57+, Firefox 52+, Safari 11+, Edge 79+
- Requires Ollama to be running locally

### Performance Considerations
- Model loading time depends on internet speed and model size
- Generation speed varies based on device capabilities and model size
- Uses Ollama's optimized inference engine

## Customization

### Adding New Models
1. Install additional models using Ollama: `ollama pull model-name`
2. Add them to the model selection dropdown in `index.html`
3. The app will automatically detect available models

### Modifying Generation Parameters
Edit the `generateExamples()` method in `app.js` to adjust:
- Temperature (creativity vs consistency)
- Max tokens (response length)
- Top-p sampling
- Stop sequences

### Styling
Modify `styles.css` to customize:
- Color scheme and gradients
- Card animations and transitions
- Layout and responsive breakpoints
- Typography and spacing

## Troubleshooting

### Model Loading Issues
- Ensure Ollama is running (`ollama serve`)
- Check browser console for error messages
- Verify the model is available: `ollama list`
- Try a different browser or clear cache

### Performance Issues
- Close other browser tabs to free up memory
- Use smaller models for better performance (e.g., llama2:7b instead of llama2:70b)
- Ensure sufficient RAM is available for the selected model
- Consider using a more powerful device

### Generation Problems
- Check if Ollama is running and connected
- Wait for generation to complete (can take 5-30 seconds depending on model)
- Try refreshing the page and reconnecting to Ollama
- Verify the model is properly installed: `ollama list`

## Development

### Local Development
1. Clone or download the project files
2. Set up a local web server (optional but recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Testing Without Ollama
The application includes a fallback mock implementation that generates example sentences without requiring Ollama. This is useful for testing the UI and functionality when Ollama is not available.

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## Acknowledgments

- Built with Llama.cpp for local AI inference
- Uses GGUF format models from Hugging Face
- Inspired by modern language learning applications 