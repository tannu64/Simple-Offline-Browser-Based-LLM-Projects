class SentimentAnalyzer {
    constructor() {
        this.pipeline = null;
        this.currentModel = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
        this.isLoading = false;
        this.isAnalyzing = false;
        
        // DOM elements
        this.statusText = document.getElementById('statusText');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        this.modelSelect = document.getElementById('modelSelect');
        this.switchModelBtn = document.getElementById('switchModelBtn');
        
        this.textInput = document.getElementById('textInput');
        this.charCount = document.getElementById('charCount');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.analyzeSpinner = document.getElementById('analyzeSpinner');
        
        this.resultsSection = document.getElementById('resultsSection');
        this.sentimentPrimary = document.getElementById('sentimentPrimary');
        this.sentimentEmoji = document.getElementById('sentimentEmoji');
        this.sentimentLabel = document.getElementById('sentimentLabel');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.detailedScores = document.getElementById('detailedScores');
        this.scoreGrid = document.getElementById('scoreGrid');
        this.explanationText = document.getElementById('explanationText');
        this.usedModel = document.getElementById('usedModel');
        this.analysisTime = document.getElementById('analysisTime');
        this.textLength = document.getElementById('textLength');
        
        this.technicalModal = document.getElementById('technicalModal');
        this.modalClose = document.getElementById('modalClose');
        this.showTechnicalInfo = document.getElementById('showTechnicalInfo');
        
        this.initializeEventListeners();
        this.loadModel();
    }
    
    initializeEventListeners() {
        // Model switching
        this.switchModelBtn.addEventListener('click', () => this.switchModel());
        
        // Text input
        this.textInput.addEventListener('input', () => this.updateCharCount());
        this.textInput.addEventListener('input', this.debounce(() => this.validateInput(), 300));
        
        // Example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.getAttribute('data-text');
                this.textInput.value = text;
                this.updateCharCount();
                this.validateInput();
            });
        });
        
        // Action buttons
        this.analyzeBtn.addEventListener('click', () => this.analyzeSentiment());
        this.clearBtn.addEventListener('click', () => this.clearText());
        
        // Modal
        this.showTechnicalInfo.addEventListener('click', (e) => {
            e.preventDefault();
            this.technicalModal.style.display = 'flex';
        });
        
        this.modalClose.addEventListener('click', () => {
            this.technicalModal.style.display = 'none';
        });
        
        this.technicalModal.addEventListener('click', (e) => {
            if (e.target === this.technicalModal) {
                this.technicalModal.style.display = 'none';
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!this.analyzeBtn.disabled) {
                        this.analyzeSentiment();
                    }
                } else if (e.key === 'l') {
                    e.preventDefault();
                    this.clearText();
                }
            }
            if (e.key === 'Escape') {
                this.technicalModal.style.display = 'none';
            }
        });
    }
    
    async loadModel() {
        try {
            this.isLoading = true;
            this.updateStatus('Initializing Transformers.js...', false);
            this.disableInterface();
            
            // Import Transformers.js
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.6.3');
            
            this.updateStatus('Loading sentiment analysis model...', true);
            
            // Create pipeline with progress callback
            this.pipeline = await pipeline('sentiment-analysis', this.currentModel, {
                progress_callback: (progress) => {
                    if (progress.status === 'downloading') {
                        const percentage = Math.round((progress.loaded / progress.total) * 100);
                        this.updateProgress(percentage, `Downloading model: ${percentage}%`);
                    } else if (progress.status === 'loading') {
                        this.updateProgress(90, 'Loading model into memory...');
                    }
                }
            });
            
            this.isLoading = false;
            this.updateStatus('Model loaded successfully! Ready to analyze text.', false, true);
            this.enableInterface();
            
            console.log('Sentiment analysis model loaded successfully');
            
        } catch (error) {
            console.error('Error loading model:', error);
            this.isLoading = false;
            this.updateStatus('Failed to load model. Please refresh and try again.', false, false, true);
            this.showError('Model Loading Error', error.message);
        }
    }
    
    async switchModel() {
        const newModel = this.modelSelect.value;
        if (newModel === this.currentModel) return;
        
        try {
            this.currentModel = newModel;
            this.pipeline = null;
            this.clearResults();
            await this.loadModel();
        } catch (error) {
            console.error('Error switching model:', error);
            this.showError('Model Switch Error', error.message);
        }
    }
    
    async analyzeSentiment() {
        if (!this.pipeline || this.isAnalyzing) return;
        
        const text = this.textInput.value.trim();
        if (!text) {
            this.showError('Input Error', 'Please enter some text to analyze.');
            return;
        }
        
        if (text.length > 512) {
            this.showError('Input Error', 'Text is too long. Please keep it under 512 characters.');
            return;
        }
        
        try {
            this.isAnalyzing = true;
            this.setAnalyzing(true);
            
            const startTime = performance.now();
            
            // Perform sentiment analysis
            const results = await this.pipeline(text);
            
            const endTime = performance.now();
            const analysisTime = Math.round(endTime - startTime);
            
            this.displayResults(results, analysisTime, text);
            
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            this.showError('Analysis Error', 'Failed to analyze sentiment. Please try again.');
        } finally {
            this.isAnalyzing = false;
            this.setAnalyzing(false);
        }
    }
    
    displayResults(results, analysisTime, originalText) {
        console.log('Analysis results:', results);
        
        // Show results section
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Get primary sentiment
        const primaryResult = results[0];
        const sentiment = primaryResult.label.toLowerCase();
        const confidence = Math.round(primaryResult.score * 100);
        
        // Update primary sentiment display
        this.updatePrimarySentiment(sentiment, confidence);
        
        // Update detailed scores
        this.updateDetailedScores(results);
        
        // Update explanation
        this.updateExplanation(sentiment, confidence, originalText);
        
        // Update metadata
        this.updateMetadata(analysisTime, originalText);
    }
    
    updatePrimarySentiment(sentiment, confidence) {
        // Update emoji
        const emojiMap = {
            'positive': '😊',
            'negative': '😞',
            'neutral': '😐',
            'label_0': '😞', // Some models use label_0 for negative
            'label_1': '😊'  // Some models use label_1 for positive
        };
        
        this.sentimentEmoji.textContent = emojiMap[sentiment] || '🤔';
        
        // Update label
        const labelMap = {
            'positive': 'Positive',
            'negative': 'Negative',
            'neutral': 'Neutral',
            'label_0': 'Negative',
            'label_1': 'Positive'
        };
        
        this.sentimentLabel.textContent = labelMap[sentiment] || 'Unknown';
        
        // Update confidence score
        this.confidenceScore.textContent = `${confidence}% confidence`;
        
        // Update styling based on sentiment
        const classMap = {
            'positive': 'positive',
            'negative': 'negative',
            'neutral': 'neutral',
            'label_0': 'negative',
            'label_1': 'positive'
        };
        
        this.confidenceScore.className = `confidence-score ${classMap[sentiment] || 'neutral'}`;
        this.sentimentLabel.className = classMap[sentiment] || 'neutral';
    }
    
    updateDetailedScores(results) {
        this.scoreGrid.innerHTML = '';
        
        results.forEach((result, index) => {
            const sentiment = result.label.toLowerCase();
            const score = Math.round(result.score * 100);
            
            const labelMap = {
                'positive': 'Positive',
                'negative': 'Negative', 
                'neutral': 'Neutral',
                'label_0': 'Negative',
                'label_1': 'Positive'
            };
            
            const colorMap = {
                'positive': '#48bb78',
                'negative': '#e53e3e',
                'neutral': '#4a5568',
                'label_0': '#e53e3e',
                'label_1': '#48bb78'
            };
            
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <span class="score-label">${labelMap[sentiment] || result.label}</span>
                <span class="score-value" style="color: ${colorMap[sentiment] || '#4a5568'}">${score}%</span>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${score}%; background-color: ${colorMap[sentiment] || '#4a5568'}"></div>
                </div>
            `;
            
            this.scoreGrid.appendChild(scoreItem);
            
            // Animate score bar
            setTimeout(() => {
                const fill = scoreItem.querySelector('.score-fill');
                fill.style.width = `${score}%`;
            }, 100 * index);
        });
    }
    
    updateExplanation(sentiment, confidence, text) {
        const explanations = {
            'positive': 'This text expresses positive emotions, opinions, or sentiments. The language used suggests satisfaction, happiness, or approval.',
            'negative': 'This text expresses negative emotions, opinions, or sentiments. The language used suggests dissatisfaction, sadness, or disapproval.',
            'neutral': 'This text appears to be neutral, expressing neither strongly positive nor negative sentiments. It may be factual, objective, or balanced in tone.',
            'label_0': 'This text expresses negative emotions, opinions, or sentiments. The language used suggests dissatisfaction, sadness, or disapproval.',
            'label_1': 'This text expresses positive emotions, opinions, or sentiments. The language used suggests satisfaction, happiness, or approval.'
        };
        
        let explanation = explanations[sentiment] || 'The sentiment of this text is unclear or mixed.';
        
        if (confidence >= 90) {
            explanation += ' The model is very confident in this prediction.';
        } else if (confidence >= 70) {
            explanation += ' The model is reasonably confident in this prediction.';
        } else if (confidence >= 50) {
            explanation += ' The model has moderate confidence in this prediction.';
        } else {
            explanation += ' The model has low confidence in this prediction, suggesting the text may be ambiguous or neutral.';
        }
        
        if (text.length < 10) {
            explanation += ' Note: Very short texts may be harder to analyze accurately.';
        }
        
        this.explanationText.textContent = explanation;
    }
    
    updateMetadata(analysisTime, text) {
        const modelNames = {
            'Xenova/distilbert-base-uncased-finetuned-sst-2-english': 'DistilBERT SST-2',
            'Xenova/bert-base-multilingual-uncased-sentiment': 'BERT Multilingual',
            'Xenova/cardiffnlp-twitter-roberta-base-sentiment-latest': 'RoBERTa Twitter'
        };
        
        this.usedModel.textContent = modelNames[this.currentModel] || this.currentModel;
        this.analysisTime.textContent = `${analysisTime}ms`;
        this.textLength.textContent = `${text.length} characters`;
    }
    
    // Utility methods
    updateStatus(text, showProgress = false, isComplete = false, isError = false) {
        this.statusText.textContent = text;
        
        if (isComplete) {
            this.loadingSpinner.classList.add('complete');
            this.loadingSpinner.classList.remove('error');
        } else if (isError) {
            this.loadingSpinner.classList.add('error');
            this.loadingSpinner.classList.remove('complete');
        } else {
            this.loadingSpinner.classList.remove('complete', 'error');
        }
        
        this.progressContainer.style.display = showProgress ? 'block' : 'none';
    }
    
    updateProgress(percentage, text = null) {
        this.progressFill.style.width = `${Math.min(percentage, 100)}%`;
        this.progressText.textContent = `${Math.min(percentage, 100)}%`;
        
        if (text) {
            this.statusText.textContent = text;
        }
    }
    
    updateCharCount() {
        const count = this.textInput.value.length;
        this.charCount.textContent = count;
        
        if (count > 512) {
            this.charCount.style.color = '#e53e3e';
        } else if (count > 400) {
            this.charCount.style.color = '#ed8936';
        } else {
            this.charCount.style.color = '#718096';
        }
    }
    
    validateInput() {
        const text = this.textInput.value.trim();
        const isValid = text.length > 0 && text.length <= 512;
        
        this.analyzeBtn.disabled = !isValid || !this.pipeline || this.isAnalyzing;
        this.clearBtn.disabled = text.length === 0;
        
        // Enable/disable example buttons
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.disabled = this.isAnalyzing;
        });
    }
    
    disableInterface() {
        this.textInput.disabled = true;
        this.modelSelect.disabled = true;
        this.switchModelBtn.disabled = true;
        this.analyzeBtn.disabled = true;
        this.clearBtn.disabled = true;
        
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
    
    enableInterface() {
        this.textInput.disabled = false;
        this.modelSelect.disabled = false;
        this.switchModelBtn.disabled = false;
        this.validateInput();
        
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.disabled = false;
        });
    }
    
    setAnalyzing(analyzing) {
        if (analyzing) {
            this.analyzeSpinner.classList.add('show');
            this.analyzeBtn.querySelector('.btn-text').textContent = 'Analyzing...';
        } else {
            this.analyzeSpinner.classList.remove('show');
            this.analyzeBtn.querySelector('.btn-text').textContent = 'Analyze Sentiment';
        }
        
        this.analyzeBtn.disabled = analyzing;
        this.textInput.disabled = analyzing;
        this.switchModelBtn.disabled = analyzing;
        
        document.querySelectorAll('.example-btn').forEach(btn => {
            btn.disabled = analyzing;
        });
    }
    
    clearText() {
        this.textInput.value = '';
        this.updateCharCount();
        this.validateInput();
        this.clearResults();
        this.textInput.focus();
    }
    
    clearResults() {
        this.resultsSection.style.display = 'none';
    }
    
    showError(title, message) {
        // Create simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fed7d7;
            border: 2px solid #e53e3e;
            color: #742a2a;
            padding: 1rem;
            border-radius: 8px;
            max-width: 400px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        errorDiv.innerHTML = `
            <strong>${title}</strong><br>
            ${message}
            <button onclick="this.parentElement.remove()" style="
                float: right;
                background: none;
                border: none;
                color: #742a2a;
                cursor: pointer;
                font-size: 18px;
                margin-left: 10px;
            ">&times;</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            modelLoadTime: 0,
            averageAnalysisTime: 0,
            totalAnalyses: 0
        };
    }
    
    startModelLoad() {
        this.modelLoadStart = performance.now();
    }
    
    endModelLoad() {
        this.metrics.modelLoadTime = performance.now() - this.modelLoadStart;
        console.log(`Model loaded in ${this.metrics.modelLoadTime.toFixed(2)}ms`);
    }
    
    recordAnalysis(time) {
        this.metrics.totalAnalyses++;
        this.metrics.averageAnalysisTime = 
            (this.metrics.averageAnalysisTime * (this.metrics.totalAnalyses - 1) + time) / 
            this.metrics.totalAnalyses;
        
        console.log(`Analysis completed in ${time}ms (avg: ${this.metrics.averageAnalysisTime.toFixed(2)}ms)`);
    }
    
    getMetrics() {
        return this.metrics;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check browser support
    if (!('modules' in HTMLScriptElement.prototype)) {
        alert('Your browser does not support ES6 modules. Please use a modern browser.');
        return;
    }
    
    // Initialize performance monitoring
    window.performanceMonitor = new PerformanceMonitor();
    
    // Initialize sentiment analyzer
    window.sentimentAnalyzer = new SentimentAnalyzer();
    
    // Add global error handling
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        
        if (window.sentimentAnalyzer) {
            window.sentimentAnalyzer.showError(
                'Application Error', 
                'An unexpected error occurred. Please refresh the page and try again.'
            );
        }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        
        if (window.sentimentAnalyzer) {
            window.sentimentAnalyzer.showError(
                'Network Error', 
                'Failed to load required resources. Please check your internet connection.'
            );
        }
    });
    
    console.log('🎭 Sentiment Analysis Tool initialized successfully');
    console.log('💡 Tip: Use Ctrl+Enter to analyze text quickly');
}); 