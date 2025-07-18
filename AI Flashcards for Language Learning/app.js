class AIFlashcards {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.selectedModel = null;
        this.isModelLoaded = false;
        this.isGenerating = false;
        this.ollamaUrl = 'http://localhost:11434';
        
        this.initializeElements();
        this.bindEvents();
        this.loadWordsFromStorage();
        this.updateUI();
    }

    initializeElements() {
        this.wordInput = document.getElementById('wordInput');
        this.addWordBtn = document.getElementById('addWordBtn');
        this.modelSelect = document.getElementById('modelSelect');
        this.loadModelBtn = document.getElementById('loadModelBtn');
        this.modelStatus = document.getElementById('modelStatus');
        this.progress = document.getElementById('progress');
        this.flashcard = document.getElementById('flashcard');
        this.currentWord = document.getElementById('currentWord');
        this.flashcardBack = document.getElementById('flashcardBack');
        this.examples = document.getElementById('examples');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.cardCounter = document.getElementById('cardCounter');
        this.wordList = document.getElementById('wordList');
    }

    bindEvents() {
        this.addWordBtn.addEventListener('click', () => this.addWord());
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWord();
        });
        
        this.loadModelBtn.addEventListener('click', () => this.loadModel());
        this.flashcard.addEventListener('click', () => this.flipCard());
        this.prevBtn.addEventListener('click', () => this.previousCard());
        this.nextBtn.addEventListener('click', () => this.nextCard());
    }

    async loadModel() {
        if (this.isModelLoaded) {
            alert('Model is already loaded!');
            return;
        }

        const selectedModel = this.modelSelect.value;
        this.updateStatus('Connecting to Ollama...', 'Loading');
        this.loadModelBtn.disabled = true;

        try {
            // Check if Ollama is running and the model is available
            const response = await fetch(`${this.ollamaUrl}/api/tags`);
            if (!response.ok) {
                throw new Error('Ollama is not running. Please start Ollama first.');
            }

            const models = await response.json();
            const modelExists = models.models.some(model => model.name === selectedModel);

            if (!modelExists) {
                this.updateStatus('Downloading model...', 'Downloading');
                // Pull the model if it doesn't exist
                const pullResponse = await fetch(`${this.ollamaUrl}/api/pull`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: selectedModel
                    })
                });

                if (!pullResponse.ok) {
                    throw new Error('Failed to download model');
                }

                // Wait for download to complete
                const reader = pullResponse.body.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const text = new TextDecoder().decode(value);
                    const lines = text.split('\n').filter(line => line.trim());
                    
                    for (const line of lines) {
                        try {
                            const data = JSON.parse(line);
                            if (data.status === 'success') {
                                break;
                            }
                        } catch (e) {
                            // Ignore non-JSON lines
                        }
                    }
                }
            }

            this.selectedModel = selectedModel;
            this.isModelLoaded = true;
            this.updateStatus('Connected to Ollama successfully!', 'Ready');
            this.loadModelBtn.textContent = 'Connected';
            this.loadModelBtn.style.background = '#28a745';
            
        } catch (error) {
            console.error('Error connecting to Ollama:', error);
            this.updateStatus('Failed to connect to Ollama', 'Error');
            this.loadModelBtn.disabled = false;
            alert(`Failed to connect to Ollama: ${error.message}\n\nPlease make sure Ollama is running and try again.`);
        }
    }

    async generateExamples(word) {
        if (!this.isModelLoaded || this.isGenerating) return;

        this.isGenerating = true;
        this.examples.innerHTML = '<div class="loading"></div> Generating examples...';

        try {
            const prompt = `Generate 2 example sentences using the word "${word}" in different contexts. Make the sentences natural and educational. Format as a simple list:

1. [First example sentence]
2. [Second example sentence]`;

            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.selectedModel,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.9,
                        num_predict: 150
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate examples');
            }

            const data = await response.json();
            const generatedText = data.response.trim();
            const sentences = this.parseSentences(generatedText);
            
            this.displayExamples(sentences);
            
        } catch (error) {
            console.error('Error generating examples:', error);
            this.examples.innerHTML = '<p class="error">Failed to generate examples. Please try again.</p>';
        } finally {
            this.isGenerating = false;
        }
    }

    parseSentences(text) {
        // Extract sentences from the generated text
        const lines = text.split('\n').filter(line => line.trim());
        const sentences = [];
        
        for (const line of lines) {
            // Remove numbering and extract the sentence
            const match = line.match(/^\d+\.\s*(.+)$/);
            if (match) {
                sentences.push(match[1].trim());
            } else if (line.trim() && !line.includes('[') && !line.includes(']')) {
                // If no numbering, just take the line if it looks like a sentence
                sentences.push(line.trim());
            }
        }
        
        // If parsing failed, create simple examples
        if (sentences.length === 0) {
            sentences.push(`Here is an example sentence using "${this.words[this.currentIndex]}".`);
            sentences.push(`Another example with "${this.words[this.currentIndex]}" in a different context.`);
        }
        
        return sentences.slice(0, 2); // Return max 2 sentences
    }

    displayExamples(sentences) {
        this.examples.innerHTML = '';
        sentences.forEach(sentence => {
            const div = document.createElement('div');
            div.className = 'example-sentence';
            div.textContent = sentence;
            this.examples.appendChild(div);
        });
    }

    addWord() {
        const word = this.wordInput.value.trim().toLowerCase();
        if (!word) return;

        if (this.words.includes(word)) {
            alert('This word is already in your list!');
            return;
        }

        this.words.push(word);
        this.saveWordsToStorage();
        this.updateUI();
        this.wordInput.value = '';
        
        // If this is the first word, set it as current
        if (this.words.length === 1) {
            this.currentIndex = 0;
            this.showCurrentWord();
        }
    }

    removeWord(index) {
        this.words.splice(index, 1);
        this.saveWordsToStorage();
        
        if (this.currentIndex >= this.words.length) {
            this.currentIndex = Math.max(0, this.words.length - 1);
        }
        
        this.updateUI();
        this.showCurrentWord();
    }

    flipCard() {
        if (this.words.length === 0) return;
        
        this.flashcard.classList.toggle('flipped');
        
        if (this.flashcard.classList.contains('flipped')) {
            this.generateExamples(this.words[this.currentIndex]);
        }
    }

    previousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.showCurrentWord();
        }
    }

    nextCard() {
        if (this.currentIndex < this.words.length - 1) {
            this.currentIndex++;
            this.showCurrentWord();
        }
    }

    showCurrentWord() {
        if (this.words.length === 0) {
            this.currentWord.textContent = 'Add a word to get started';
            this.flashcard.classList.remove('flipped');
            return;
        }

        this.currentWord.textContent = this.words[this.currentIndex];
        this.flashcard.classList.remove('flipped');
        this.examples.innerHTML = '<p class="placeholder">Click the card to generate examples...</p>';
    }

    updateUI() {
        this.updateNavigation();
        this.updateWordList();
        this.showCurrentWord();
    }

    updateNavigation() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.words.length - 1;
        this.cardCounter.textContent = `${this.words.length > 0 ? this.currentIndex + 1 : 0} / ${this.words.length}`;
    }

    updateWordList() {
        if (this.words.length === 0) {
            this.wordList.innerHTML = '<p class="empty-state">No words added yet. Add your first word above!</p>';
            return;
        }

        this.wordList.innerHTML = '';
        this.words.forEach((word, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = `word-item ${index === this.currentIndex ? 'active' : ''}`;
            wordItem.innerHTML = `
                ${word}
                <button class="remove-btn" onclick="app.removeWord(${index})">×</button>
            `;
            wordItem.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateUI();
                this.showCurrentWord();
            });
            this.wordList.appendChild(wordItem);
        });
    }

    updateStatus(message, status) {
        this.modelStatus.textContent = status;
        if (status === 'Loading') {
            this.modelStatus.innerHTML = `<span class="loading"></span> ${message}`;
        }
    }

    saveWordsToStorage() {
        localStorage.setItem('flashcard-words', JSON.stringify(this.words));
    }

    loadWordsFromStorage() {
        const saved = localStorage.getItem('flashcard-words');
        if (saved) {
            this.words = JSON.parse(saved);
        }
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AIFlashcards();
});

// Fallback for when Ollama is not available
if (!window.fetch) {
    console.warn('Fetch API not available. Using fallback example generation.');
    
    // Mock fetch for development/testing
    window.fetch = function(url, options) {
        if (url.includes('/api/generate')) {
            const word = options.body.match(/word "([^"]+)"/)?.[1] || 'example';
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    response: `1. The ${word} was used in a sentence to demonstrate its meaning.
2. Students learned how to properly use the ${word} in different contexts.`
                })
            });
        }
        return Promise.reject(new Error('Mock fetch not implemented for this endpoint'));
    };
} 