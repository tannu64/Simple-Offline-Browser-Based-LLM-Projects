class TinyLlamaChatbot {
    constructor() {
        this.engine = null;
        this.isModelLoaded = false;
        this.isGenerating = false;
        
        // DOM elements
        this.statusText = document.getElementById('statusText');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.inputInfo = document.getElementById('inputInfo');
        
        this.initializeEventListeners();
        this.loadModel();
    }
    
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send message
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });
    }
    
    async loadModel() {
        try {
            this.updateStatus('Initializing WebLLM engine...', false);
            
            // Import WebLLM
            const { CreateMLCEngine } = await import("https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/lib/index.js");
            
            this.updateStatus('Loading TinyLlama model...', true);
            
            // Try TinyLlama first, fallback to Qwen if not available
            const modelOptions = [
                "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
                "mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC",
                "Qwen2-0.5B-Instruct-q4f16_1-MLC"
            ];
            
            let modelLoaded = false;
            let lastError = null;
            
            for (const modelName of modelOptions) {
                try {
                    this.updateStatus(`Trying model: ${modelName}...`, true);
                    
                    // Initialize the engine with current model
                    this.engine = await CreateMLCEngine(
                        modelName,
                        {
                            initProgressCallback: (progress) => {
                                this.updateProgress(progress);
                            }
                        }
                    );
                    
                    modelLoaded = true;
                    console.log(`Successfully loaded model: ${modelName}`);
                    break;
                } catch (error) {
                    console.warn(`Failed to load ${modelName}:`, error);
                    lastError = error;
                    continue;
                }
            }
            
            if (!modelLoaded) {
                throw lastError || new Error("All model loading attempts failed");
            }
            
            this.isModelLoaded = true;
            this.updateStatus('Model loaded successfully! Ready to chat.', false, true);
            this.enableChat();
            
            // Add welcome message
            this.addBotMessage("I'm now fully loaded and ready to help! I'm TinyLlama, a compact but capable AI assistant. Feel free to ask me questions, request help with tasks, or just have a conversation. What would you like to talk about?");
            
        } catch (error) {
            console.error('Error loading model:', error);
            this.updateStatus('Failed to load model. Please refresh and try again.', false, false, true);
            this.addBotMessage("Sorry, I encountered an error while loading. This might be due to:\n\n• WebGPU not being supported in your browser\n• Insufficient memory\n• Network connection issues\n\nPlease try refreshing the page or use a WebGPU-compatible browser like Chrome/Edge.");
        }
    }
    
    updateStatus(text, showProgress = false, isComplete = false, isError = false) {
        this.statusText.textContent = text;
        
        const spinner = this.statusIndicator.querySelector('.loading-spinner');
        if (isComplete) {
            spinner.classList.add('complete');
        } else if (isError) {
            spinner.style.border = '2px solid #e53e3e';
            spinner.style.borderTop = '2px solid #e53e3e';
            spinner.style.animation = 'none';
        }
        
        this.progressContainer.style.display = showProgress ? 'block' : 'none';
    }
    
    updateProgress(progress) {
        const percentage = Math.round(progress.progress * 100);
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${percentage}%`;
        
        if (progress.text) {
            this.statusText.textContent = progress.text;
        }
    }
    
    enableChat() {
        this.messageInput.disabled = false;
        this.sendButton.disabled = false;
        this.inputInfo.textContent = 'Type your message and press Enter or click send';
        this.messageInput.focus();
    }
    
    async sendMessage() {
        if (!this.isModelLoaded || this.isGenerating) {
            return;
        }
        
        const message = this.messageInput.value.trim();
        if (!message) {
            return;
        }
        
        // Add user message
        this.addUserMessage(message);
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Disable input while generating
        this.isGenerating = true;
        this.messageInput.disabled = true;
        this.sendButton.disabled = true;
        this.inputInfo.textContent = 'AI is thinking...';
        
        // Add typing indicator
        const typingId = this.addTypingIndicator();
        
        try {
            // Generate response
            const response = await this.engine.chat.completions.create({
                messages: [
                    {
                        role: "system", 
                        content: "You are TinyLlama, a helpful and friendly AI assistant. Provide concise, accurate, and helpful responses. Keep your answers clear and engaging while being informative."
                    },
                    {
                        role: "user", 
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 512,
            });
            
            // Remove typing indicator
            this.removeTypingIndicator(typingId);
            
            // Add bot response
            const botMessage = response.choices[0].message.content;
            this.addBotMessage(botMessage);
            
        } catch (error) {
            console.error('Error generating response:', error);
            this.removeTypingIndicator(typingId);
            this.addBotMessage("I apologize, but I encountered an error while generating a response. Please try again.");
        } finally {
            // Re-enable input
            this.isGenerating = false;
            this.messageInput.disabled = false;
            this.sendButton.disabled = false;
            this.inputInfo.textContent = 'Type your message and press Enter or click send';
            this.messageInput.focus();
        }
    }
    
    addUserMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${this.escapeHtml(content)}</p>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                ${this.formatBotMessage(content)}
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addTypingIndicator() {
        const typingId = 'typing-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.id = typingId;
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        return typingId;
    }
    
    removeTypingIndicator(typingId) {
        const typingElement = document.getElementById(typingId);
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    formatBotMessage(content) {
        // Convert newlines to paragraphs and handle basic formatting
        const paragraphs = content.split('\n\n').filter(p => p.trim());
        return paragraphs.map(paragraph => {
            // Handle bullet points
            if (paragraph.includes('•') || paragraph.includes('-')) {
                const lines = paragraph.split('\n');
                const listItems = lines
                    .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
                    .map(line => `<li>${this.escapeHtml(line.replace(/^[•\-]\s*/, ''))}</li>`)
                    .join('');
                
                if (listItems) {
                    const otherLines = lines
                        .filter(line => !line.trim().startsWith('•') && !line.trim().startsWith('-'))
                        .join('\n');
                    
                    return (otherLines ? `<p>${this.escapeHtml(otherLines)}</p>` : '') + 
                           `<ul>${listItems}</ul>`;
                }
            }
            
            return `<p>${this.escapeHtml(paragraph)}</p>`;
        }).join('');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TinyLlamaChatbot();
});

// Add some global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
}); 