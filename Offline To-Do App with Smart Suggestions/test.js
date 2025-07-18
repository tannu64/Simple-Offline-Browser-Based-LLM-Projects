// Test Suite for Smart To-Do App
class TodoAppTester {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.totalTests = 0;
    }

    // Test utility functions
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const colors = {
            info: '#007bff',
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107'
        };
        
        console.log(`%c[${timestamp}] ${message}`, `color: ${colors[type]}; font-weight: bold;`);
    }

    assert(condition, testName) {
        this.totalTests++;
        if (condition) {
            this.passedTests++;
            this.log(`✅ PASS: ${testName}`, 'success');
            this.testResults.push({ test: testName, status: 'PASS' });
        } else {
            this.log(`❌ FAIL: ${testName}`, 'error');
            this.testResults.push({ test: testName, status: 'FAIL' });
        }
    }

    // Test AI Suggestion System
    testAISuggestions() {
        this.log('🧠 Testing AI Suggestion System...', 'info');
        
        // Test pattern matching
        const testInputs = [
            { input: 'buy', expected: ['Buy groceries', 'Buy birthday gift'] },
            { input: 'work', expected: ['meeting', 'email', 'report'] },
            { input: 'clean', expected: ['Clean house', 'Organize desk'] },
            { input: 'call', expected: ['Call mom', 'Call doctor'] }
        ];

        testInputs.forEach(({ input, expected }) => {
            const suggestions = app.getSuggestions(input);
            const hasExpected = expected.some(exp => suggestions.includes(exp));
            this.assert(hasExpected, `AI suggestions for "${input}"`);
        });

        // Test empty input
        const emptySuggestions = app.getSuggestions('');
        this.assert(emptySuggestions.length === 0, 'Empty input returns no suggestions');

        // Test short input
        const shortSuggestions = app.getSuggestions('a');
        this.assert(shortSuggestions.length === 0, 'Short input returns no suggestions');
    }

    // Test Task Management
    testTaskManagement() {
        this.log('📝 Testing Task Management...', 'info');
        
        const initialTaskCount = app.tasks.length;
        
        // Test adding task
        const testTask = 'Test task for automation';
        app.taskInput.value = testTask;
        app.addTask();
        
        this.assert(app.tasks.length === initialTaskCount + 1, 'Task added successfully');
        this.assert(app.tasks.some(t => t.text === testTask), 'Added task found in list');
        
        // Test task completion
        const addedTask = app.tasks.find(t => t.text === testTask);
        if (addedTask) {
            app.toggleTask(addedTask.id);
            this.assert(addedTask.completed === true, 'Task marked as completed');
            
            app.toggleTask(addedTask.id);
            this.assert(addedTask.completed === false, 'Task marked as incomplete');
        }
        
        // Test task deletion
        const taskCountBeforeDelete = app.tasks.length;
        if (addedTask) {
            app.deleteTask(addedTask.id);
            this.assert(app.tasks.length === taskCountBeforeDelete - 1, 'Task deleted successfully');
        }
    }

    // Test Local Storage
    testLocalStorage() {
        this.log('💾 Testing Local Storage...', 'info');
        
        // Test saving tasks
        const testTasks = [
            { id: 1, text: 'Storage test 1', completed: false, createdAt: new Date().toISOString() },
            { id: 2, text: 'Storage test 2', completed: true, createdAt: new Date().toISOString() }
        ];
        
        app.tasks = testTasks;
        app.saveTasks();
        
        const savedData = localStorage.getItem('tasks');
        this.assert(savedData !== null, 'Tasks saved to localStorage');
        
        const parsedData = JSON.parse(savedData);
        this.assert(parsedData.length === testTasks.length, 'Correct number of tasks saved');
    }

    // Test UI Elements
    testUIElements() {
        this.log('🎨 Testing UI Elements...', 'info');
        
        // Test required elements exist
        this.assert(document.getElementById('taskInput') !== null, 'Task input field exists');
        this.assert(document.getElementById('addTaskBtn') !== null, 'Add button exists');
        this.assert(document.getElementById('taskList') !== null, 'Task list container exists');
        this.assert(document.getElementById('suggestionList') !== null, 'Suggestion list exists');
        
        // Test statistics elements
        this.assert(document.getElementById('totalTasks') !== null, 'Total tasks counter exists');
        this.assert(document.getElementById('completedTasks') !== null, 'Completed tasks counter exists');
        this.assert(document.getElementById('pendingTasks') !== null, 'Pending tasks counter exists');
    }

    // Test Responsive Design
    testResponsiveDesign() {
        this.log('📱 Testing Responsive Design...', 'info');
        
        // Test container max-width
        const container = document.querySelector('.container');
        if (container) {
            const styles = window.getComputedStyle(container);
            this.assert(styles.maxWidth === '800px', 'Container has correct max-width');
        }
        
        // Test input field responsiveness
        const taskInput = document.getElementById('taskInput');
        if (taskInput) {
            const styles = window.getComputedStyle(taskInput);
            this.assert(styles.flex === '1', 'Input field is flexible');
        }
    }

    // Test Performance
    testPerformance() {
        this.log('⚡ Testing Performance...', 'info');
        
        // Test suggestion generation speed
        const startTime = performance.now();
        for (let i = 0; i < 100; i++) {
            app.getSuggestions('test');
        }
        const endTime = performance.now();
        const avgTime = (endTime - startTime) / 100;
        
        this.assert(avgTime < 1, `Suggestion generation is fast (${avgTime.toFixed(3)}ms average)`);
        
        // Test task rendering speed
        const renderStart = performance.now();
        app.renderTasks();
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        
        this.assert(renderTime < 10, `Task rendering is fast (${renderTime.toFixed(3)}ms)`);
    }

    // Test Offline Capability
    testOfflineCapability() {
        this.log('🌐 Testing Offline Capability...', 'info');
        
        // Test service worker registration
        if ('serviceWorker' in navigator) {
            this.assert(true, 'Service Worker API available');
        } else {
            this.log('⚠️ Service Worker not supported in this browser', 'warning');
        }
        
        // Test localStorage availability
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.assert(true, 'localStorage is available');
        } catch (e) {
            this.assert(false, 'localStorage is not available');
        }
    }

    // Run all tests
    runAllTests() {
        this.log('🚀 Starting Smart To-Do App Test Suite...', 'info');
        console.log('='.repeat(60));
        
        this.testAISuggestions();
        this.testTaskManagement();
        this.testLocalStorage();
        this.testUIElements();
        this.testResponsiveDesign();
        this.testPerformance();
        this.testOfflineCapability();
        
        // Print results
        console.log('='.repeat(60));
        this.log(`📊 Test Results: ${this.passedTests}/${this.totalTests} tests passed`, 
                 this.passedTests === this.totalTests ? 'success' : 'error');
        
        if (this.passedTests === this.totalTests) {
            this.log('🎉 All tests passed! Your Smart To-Do App is working perfectly!', 'success');
        } else {
            this.log('⚠️ Some tests failed. Check the console for details.', 'warning');
        }
        
        // Detailed results
        console.table(this.testResults);
        
        return {
            passed: this.passedTests,
            total: this.totalTests,
            percentage: (this.passedTests / this.totalTests * 100).toFixed(1)
        };
    }
}

// Auto-run tests when page loads (if app is available)
function runTests() {
    if (typeof app !== 'undefined') {
        const tester = new TodoAppTester();
        return tester.runAllTests();
    } else {
        console.log('⏳ Waiting for app to load...');
        setTimeout(runTests, 1000);
    }
}

// Export for manual testing
window.TodoAppTester = TodoAppTester;
window.runTests = runTests;

// Auto-run after 2 seconds to ensure app is loaded
setTimeout(runTests, 2000); 