class SmartTodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.model = null;
        this.tokenizer = null;
        this.isModelLoaded = false;
        
        this.initializeElements();
        this.bindEvents();
        this.loadModel();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addTaskBtn = document.getElementById('addTaskBtn');
        this.taskList = document.getElementById('taskList');
        this.suggestionList = document.getElementById('suggestionList');
        this.totalTasksEl = document.getElementById('totalTasks');
        this.completedTasksEl = document.getElementById('completedTasks');
        this.pendingTasksEl = document.getElementById('pendingTasks');
    }

    bindEvents() {
        this.addTaskBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.taskInput.addEventListener('input', () => this.generateSuggestions());
        
        // Add test button functionality
        const testBtn = document.getElementById('testSuggestionsBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testSuggestions());
        }
    }

    async loadModel() {
        try {
            // Create a simple local model for suggestions (no ONNX needed for basic suggestions)
            this.createLocalModel();
            
            this.isModelLoaded = true;
            this.suggestionList.innerHTML = '<p>🤖 AI suggestions ready! Start typing to get smart recommendations.</p>';
        } catch (error) {
            console.error('Error loading model:', error);
            this.suggestionList.innerHTML = '<p>⚠️ Using basic suggestions. AI model unavailable.</p>';
            this.isModelLoaded = true;
        }
    }

    createLocalModel() {
        // Simple local model for task suggestions
        this.taskPatterns = {
            'work': ['meeting', 'email', 'report', 'presentation', 'deadline', 'project'],
            'home': ['clean', 'cook', 'laundry', 'grocery', 'organize', 'repair'],
            'health': ['exercise', 'meditation', 'doctor', 'vitamins', 'water', 'sleep'],
            'study': ['read', 'research', 'practice', 'review', 'homework', 'exam'],
            'personal': ['call', 'visit', 'birthday', 'anniversary', 'plan', 'book']
        };

        this.commonTasks = [
            'Buy groceries', 'Call mom', 'Exercise', 'Read book', 'Clean house',
            'Pay bills', 'Schedule meeting', 'Send email', 'Review documents',
            'Plan weekend', 'Cook dinner', 'Do laundry', 'Study', 'Meditate'
        ];
    }

    generateSuggestions() {
        const input = this.taskInput.value.toLowerCase().trim();
        if (!input || input.length < 2) {
            this.suggestionList.innerHTML = '<p>💡 Type at least 2 characters to get smart suggestions...</p>';
            return;
        }

        const suggestions = this.getSuggestions(input);
        this.displaySuggestions(suggestions);
    }

    getSuggestions(input) {
        const suggestions = new Set();
        console.log('🔍 Generating suggestions for:', input);

        // Check for pattern matches
        for (const [category, tasks] of Object.entries(this.taskPatterns)) {
            if (input.includes(category) || category.includes(input)) {
                tasks.forEach(task => suggestions.add(task));
            }
        }

        // Check for common task matches
        this.commonTasks.forEach(task => {
            if (task.toLowerCase().includes(input)) {
                suggestions.add(task);
            }
        });

        // Check task history for similar patterns
        this.tasks.forEach(task => {
            const taskLower = task.text.toLowerCase();
            if (taskLower.includes(input) && !suggestions.has(task.text)) {
                suggestions.add(task.text);
            }
        });

        // Add some contextual suggestions based on input
        if (input.includes('buy') || input.includes('purchase')) {
            suggestions.add('Buy groceries');
            suggestions.add('Buy birthday gift');
        }
        if (input.includes('call') || input.includes('phone')) {
            suggestions.add('Call mom');
            suggestions.add('Call doctor');
        }
        if (input.includes('clean') || input.includes('organize')) {
            suggestions.add('Clean house');
            suggestions.add('Organize desk');
        }

        const result = Array.from(suggestions).slice(0, 5);
        console.log('✨ Suggestions found:', result);
        return result;
    }

    displaySuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.suggestionList.innerHTML = '<p>No suggestions found. Try different keywords.</p>';
            return;
        }

        const suggestionHTML = suggestions.map(suggestion => 
            `<div class="suggestion-item" onclick="app.selectSuggestion('${suggestion}')">${suggestion}</div>`
        ).join('');

        this.suggestionList.innerHTML = suggestionHTML;
    }

    selectSuggestion(suggestion) {
        this.taskInput.value = suggestion;
        this.taskInput.focus();
        this.generateSuggestions();
    }

    addTask() {
        const text = this.taskInput.value.trim();
        if (!text) return;

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.taskInput.value = '';
        this.suggestionList.innerHTML = '<p>Task added! Type to get more suggestions.</p>';
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.taskList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No tasks yet. Add your first task above!</p>';
            return;
        }

        const taskHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" 
                       ${task.completed ? 'checked' : ''} 
                       onchange="app.toggleTask(${task.id})">
                <span class="task-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="app.deleteTask(${task.id})">Delete</button>
            </div>
        `).join('');

        this.taskList.innerHTML = taskHTML;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.pendingTasksEl.textContent = pending;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    testSuggestions() {
        console.log('🧪 Testing suggestions...');
        const testInputs = ['buy', 'work', 'clean', 'call', 'study'];
        
        testInputs.forEach(input => {
            console.log(`\n--- Testing "${input}" ---`);
            this.taskInput.value = input;
            this.generateSuggestions();
        });
        
        // Reset input
        this.taskInput.value = '';
        this.generateSuggestions();
    }
}

// Initialize the app when the page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new SmartTodoApp();
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 