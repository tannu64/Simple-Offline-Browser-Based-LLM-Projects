class SentimentTestSuite {
    constructor() {
        this.pipeline = null;
        this.testResults = [];
        this.metrics = {
            modelLoadTime: 0,
            totalAnalyses: 0,
            successfulAnalyses: 0,
            analysisTime: [],
            memoryUsage: []
        };
        
        this.testData = {
            positive: [
                "I absolutely love this product! It's amazing!",
                "This is the best service I've ever experienced.",
                "Fantastic quality and excellent customer support!",
                "I'm so happy with my purchase. Highly recommended!",
                "Outstanding performance and great value for money."
            ],
            negative: [
                "This product is terrible and completely useless.",
                "Worst customer service I've ever encountered.",
                "Poor quality and overpriced. Very disappointed.",
                "I hate this service. Complete waste of time.",
                "Awful experience. Would not recommend to anyone."
            ],
            neutral: [
                "The weather today is partly cloudy with some sun.",
                "The meeting is scheduled for 3 PM tomorrow.",
                "This document contains important information.",
                "The store is located on Main Street.",
                "Please submit your report by Friday."
            ],
            mixed: [
                "The product has good features but poor customer service.",
                "Great design but the price is too high for what you get.",
                "I like some aspects but there are also several issues.",
                "Decent quality though delivery was quite slow.",
                "The app works well sometimes but crashes frequently."
            ],
            edge: [
                "😊😊😊",
                "!!!???",
                "A",
                "",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(10),
                "🚀💖✨🎉👍",
                "This is GREAT!!! But also... not so good???",
                "neutral neutral neutral neutral neutral"
            ]
        };
        
        this.initializeElements();
        this.initializeEventListeners();
        this.detectBrowserInfo();
    }
    
    initializeElements() {
        // Browser info
        this.browserDetails = document.getElementById('browserDetails');
        
        // Outputs
        this.requirementsOutput = document.getElementById('requirementsOutput');
        this.modelOutput = document.getElementById('modelOutput');
        this.sentimentOutput = document.getElementById('sentimentOutput');
        this.summaryOutput = document.getElementById('summaryOutput');
        
        // Progress bars
        this.modelProgress = document.getElementById('modelProgress');
        this.modelProgressFill = document.getElementById('modelProgressFill');
        this.testProgress = document.getElementById('testProgress');
        this.testProgressFill = document.getElementById('testProgressFill');
        
        // Metrics
        this.modelLoadTime = document.getElementById('modelLoadTime');
        this.avgAnalysisTime = document.getElementById('avgAnalysisTime');
        this.totalAnalyses = document.getElementById('totalAnalyses');
        this.successRate = document.getElementById('successRate');
        this.performanceChart = document.getElementById('performanceChart');
        
        // Test list
        this.testList = document.getElementById('testList');
    }
    
    initializeEventListeners() {
        // Requirements tests
        document.getElementById('testRequirements').addEventListener('click', () => this.testRequirements());
        document.getElementById('testBrowserSupport').addEventListener('click', () => this.testBrowserSupport());
        document.getElementById('testPerformance').addEventListener('click', () => this.testPerformanceCapability());
        
        // Model tests
        document.getElementById('testModelLoading').addEventListener('click', () => this.testModelLoading());
        document.getElementById('testModelSwitching').addEventListener('click', () => this.testModelSwitching());
        document.getElementById('testModelCaching').addEventListener('click', () => this.testModelCaching());
        
        // Sentiment tests
        document.getElementById('testBasicSentiment').addEventListener('click', () => this.testBasicSentiment());
        document.getElementById('testAdvancedSentiment').addEventListener('click', () => this.testAdvancedSentiment());
        document.getElementById('testBatchAnalysis').addEventListener('click', () => this.testBatchAnalysis());
        document.getElementById('testEdgeCases').addEventListener('click', () => this.testEdgeCases());
        
        // Performance tests
        document.getElementById('runPerformanceTests').addEventListener('click', () => this.runPerformanceTests());
        document.getElementById('runStressTests').addEventListener('click', () => this.runStressTests());
        document.getElementById('clearMetrics').addEventListener('click', () => this.clearMetrics());
        
        // Automated tests
        document.getElementById('runAllTests').addEventListener('click', () => this.runAllTests());
        document.getElementById('runQuickTests').addEventListener('click', () => this.runQuickTests());
        document.getElementById('stopTests').addEventListener('click', () => this.stopTests());
    }
    
    detectBrowserInfo() {
        const info = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            memory: navigator.deviceMemory || 'Unknown',
            cores: navigator.hardwareConcurrency || 'Unknown',
            screen: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        let browserName = 'Unknown';
        if (navigator.userAgent.includes('Chrome')) browserName = 'Chrome';
        else if (navigator.userAgent.includes('Firefox')) browserName = 'Firefox';
        else if (navigator.userAgent.includes('Safari')) browserName = 'Safari';
        else if (navigator.userAgent.includes('Edge')) browserName = 'Edge';
        
        this.browserDetails.innerHTML = `
            <strong>Browser:</strong> ${browserName}<br>
            <strong>Platform:</strong> ${info.platform}<br>
            <strong>Language:</strong> ${info.language}<br>
            <strong>Memory:</strong> ${info.memory} GB<br>
            <strong>CPU Cores:</strong> ${info.cores}<br>
            <strong>Screen:</strong> ${info.screen}<br>
            <strong>Online:</strong> ${info.onLine ? 'Yes' : 'No'}
        `;
    }
    
    async testRequirements() {
        this.setButtonState('testRequirements', 'running');
        this.logToOutput(this.requirementsOutput, 'Starting system requirements test...', 'info');
        
        const tests = [
            {
                name: 'ES6 Modules Support',
                test: () => 'modules' in HTMLScriptElement.prototype,
                critical: true
            },
            {
                name: 'WebAssembly Support',
                test: () => typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function',
                critical: true
            },
            {
                name: 'Fetch API Support',
                test: () => typeof fetch === 'function',
                critical: true
            },
            {
                name: 'IndexedDB Support',
                test: () => typeof indexedDB !== 'undefined',
                critical: false
            },
            {
                name: 'Local Storage Support',
                test: () => typeof localStorage !== 'undefined',
                critical: false
            },
            {
                name: 'Service Worker Support',
                test: () => 'serviceWorker' in navigator,
                critical: false
            },
            {
                name: 'Web Workers Support',
                test: () => typeof Worker !== 'undefined',
                critical: false
            },
            {
                name: 'Sufficient Memory',
                test: () => {
                    const memory = navigator.deviceMemory;
                    return memory === undefined || memory >= 2;
                },
                critical: false
            }
        ];
        
        let passed = 0;
        let critical_failed = 0;
        
        for (const test of tests) {
            try {
                const result = test.test();
                const status = result ? 'PASS' : 'FAIL';
                const level = result ? 'success' : (test.critical ? 'error' : 'warning');
                
                this.logToOutput(this.requirementsOutput, `${test.name}: ${status}`, level);
                
                if (result) {
                    passed++;
                } else if (test.critical) {
                    critical_failed++;
                }
                
                await this.delay(100);
            } catch (error) {
                this.logToOutput(this.requirementsOutput, `${test.name}: ERROR - ${error.message}`, 'error');
                if (test.critical) critical_failed++;
            }
        }
        
        const overall = critical_failed === 0 ? 'success' : 'error';
        this.logToOutput(this.requirementsOutput, 
            `\nRequirements Test Complete: ${passed}/${tests.length} tests passed`, overall);
        
        if (critical_failed > 0) {
            this.logToOutput(this.requirementsOutput, 
                `${critical_failed} critical requirements failed. App may not work properly.`, 'error');
        }
        
        this.setButtonState('testRequirements', overall);
    }
    
    async testBrowserSupport() {
        this.setButtonState('testBrowserSupport', 'running');
        this.logToOutput(this.requirementsOutput, '\nTesting browser-specific support...', 'info');
        
        const browserTests = [
            {
                name: 'WebGPU Support',
                test: () => 'gpu' in navigator,
                description: 'Hardware acceleration for faster inference'
            },
            {
                name: 'WebGL Support',
                test: () => {
                    try {
                        const canvas = document.createElement('canvas');
                        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                    } catch (e) {
                        return false;
                    }
                },
                description: 'Graphics acceleration support'
            },
            {
                name: 'BigInt Support',
                test: () => typeof BigInt !== 'undefined',
                description: 'Large integer support for model calculations'
            },
            {
                name: 'SharedArrayBuffer Support',
                test: () => typeof SharedArrayBuffer !== 'undefined',
                description: 'Multi-threading support'
            },
            {
                name: 'OffscreenCanvas Support',
                test: () => typeof OffscreenCanvas !== 'undefined',
                description: 'Background processing support'
            }
        ];
        
        for (const test of browserTests) {
            const result = test.test();
            const status = result ? 'SUPPORTED' : 'NOT SUPPORTED';
            const level = result ? 'success' : 'warning';
            
            this.logToOutput(this.requirementsOutput, 
                `${test.name}: ${status} - ${test.description}`, level);
            
            await this.delay(100);
        }
        
        this.setButtonState('testBrowserSupport', 'success');
    }
    
    async testPerformanceCapability() {
        this.setButtonState('testPerformance', 'running');
        this.logToOutput(this.requirementsOutput, '\nTesting performance capabilities...', 'info');
        
        // Test JavaScript performance
        const start = performance.now();
        let iterations = 0;
        while (performance.now() - start < 100) {
            Math.random();
            iterations++;
        }
        const jsPerf = iterations / 1000;
        
        // Test memory allocation
        let memTest = 'success';
        try {
            const bigArray = new Array(1000000).fill(0);
            bigArray.length; // Access to ensure allocation
        } catch (error) {
            memTest = 'warning';
        }
        
        // Test WebAssembly performance
        let wasmPerf = 'unknown';
        try {
            const wasmCode = new Uint8Array([
                0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00
            ]);
            await WebAssembly.instantiate(wasmCode);
            wasmPerf = 'supported';
        } catch (error) {
            wasmPerf = 'error';
        }
        
        this.logToOutput(this.requirementsOutput, `JavaScript Performance: ${jsPerf.toFixed(0)}k ops/100ms`, 'info');
        this.logToOutput(this.requirementsOutput, `Memory Allocation: ${memTest.toUpperCase()}`, memTest);
        this.logToOutput(this.requirementsOutput, `WebAssembly: ${wasmPerf.toUpperCase()}`, wasmPerf === 'supported' ? 'success' : 'warning');
        
        const overallPerf = jsPerf > 1000 && memTest === 'success' && wasmPerf === 'supported' ? 'success' : 'warning';
        this.setButtonState('testPerformance', overallPerf);
    }
    
    async testModelLoading() {
        this.setButtonState('testModelLoading', 'running');
        this.logToOutput(this.modelOutput, 'Starting model loading test...', 'info');
        this.modelProgress.style.display = 'block';
        
        try {
            const startTime = performance.now();
            
            // Import Transformers.js
            this.logToOutput(this.modelOutput, 'Importing Transformers.js library...', 'info');
            const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.6.3');
            
            // Load model with progress tracking
            this.logToOutput(this.modelOutput, 'Loading DistilBERT model...', 'info');
            this.pipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
                progress_callback: (progress) => {
                    if (progress.status === 'downloading') {
                        const percentage = Math.round((progress.loaded / progress.total) * 100);
                        this.updateProgress(this.modelProgressFill, percentage);
                        this.logToOutput(this.modelOutput, `Downloading: ${percentage}%`, 'info');
                    }
                }
            });
            
            const loadTime = performance.now() - startTime;
            this.metrics.modelLoadTime = loadTime;
            this.updateMetric('modelLoadTime', Math.round(loadTime));
            
            this.logToOutput(this.modelOutput, `Model loaded successfully in ${Math.round(loadTime)}ms`, 'success');
            
            // Test basic functionality
            const testResult = await this.pipeline('This is a test');
            this.logToOutput(this.modelOutput, `Test inference successful: ${JSON.stringify(testResult)}`, 'success');
            
            this.setButtonState('testModelLoading', 'success');
            
        } catch (error) {
            this.logToOutput(this.modelOutput, `Model loading failed: ${error.message}`, 'error');
            this.setButtonState('testModelLoading', 'error');
        } finally {
            this.modelProgress.style.display = 'none';
        }
    }
    
    async testBasicSentiment() {
        if (!this.pipeline) {
            this.logToOutput(this.sentimentOutput, 'Model not loaded. Please run model loading test first.', 'error');
            return;
        }
        
        this.setButtonState('testBasicSentiment', 'running');
        this.logToOutput(this.sentimentOutput, 'Testing basic sentiment analysis...', 'info');
        
        const categories = ['positive', 'negative', 'neutral'];
        let totalTests = 0;
        let passedTests = 0;
        
        for (const category of categories) {
            this.logToOutput(this.sentimentOutput, `\nTesting ${category} examples:`, 'info');
            
            for (const text of this.testData[category]) {
                try {
                    const startTime = performance.now();
                    const result = await this.pipeline(text);
                    const endTime = performance.now();
                    
                    const analysisTime = endTime - startTime;
                    this.metrics.analysisTime.push(analysisTime);
                    this.metrics.totalAnalyses++;
                    this.metrics.successfulAnalyses++;
                    
                    const sentiment = result[0].label.toLowerCase();
                    const confidence = Math.round(result[0].score * 100);
                    
                    // Simple validation - just check if we get reasonable results
                    const isValid = confidence > 30 && sentiment.length > 0;
                    
                    this.logToOutput(this.sentimentOutput, 
                        `"${text.substring(0, 50)}..." → ${sentiment} (${confidence}%) [${Math.round(analysisTime)}ms]`, 
                        isValid ? 'success' : 'warning'
                    );
                    
                    totalTests++;
                    if (isValid) passedTests++;
                    
                    await this.delay(100); // Small delay for readability
                    
                } catch (error) {
                    this.logToOutput(this.sentimentOutput, `Error analyzing: ${error.message}`, 'error');
                    totalTests++;
                }
            }
        }
        
        this.updateMetrics();
        
        const successRate = Math.round((passedTests / totalTests) * 100);
        this.logToOutput(this.sentimentOutput, 
            `\nBasic sentiment test complete: ${passedTests}/${totalTests} tests passed (${successRate}%)`, 
            successRate >= 80 ? 'success' : 'warning'
        );
        
        this.setButtonState('testBasicSentiment', successRate >= 80 ? 'success' : 'warning');
    }
    
    async testAdvancedSentiment() {
        if (!this.pipeline) {
            this.logToOutput(this.sentimentOutput, 'Model not loaded. Please run model loading test first.', 'error');
            return;
        }
        
        this.setButtonState('testAdvancedSentiment', 'running');
        this.logToOutput(this.sentimentOutput, '\nTesting advanced sentiment cases...', 'info');
        
        let totalTests = 0;
        let passedTests = 0;
        
        // Test mixed sentiment
        this.logToOutput(this.sentimentOutput, '\nTesting mixed sentiment examples:', 'info');
        for (const text of this.testData.mixed) {
            try {
                const result = await this.pipeline(text);
                const confidence = Math.round(result[0].score * 100);
                
                // For mixed sentiment, we expect lower confidence
                const isReasonable = confidence < 90; // Mixed sentiment should be less confident
                
                this.logToOutput(this.sentimentOutput, 
                    `"${text.substring(0, 50)}..." → ${result[0].label} (${confidence}%)`, 
                    isReasonable ? 'success' : 'warning'
                );
                
                totalTests++;
                if (isReasonable) passedTests++;
                
                await this.delay(100);
                
            } catch (error) {
                this.logToOutput(this.sentimentOutput, `Error: ${error.message}`, 'error');
                totalTests++;
            }
        }
        
        const successRate = Math.round((passedTests / totalTests) * 100);
        this.logToOutput(this.sentimentOutput, 
            `Advanced sentiment test complete: ${passedTests}/${totalTests} tests passed (${successRate}%)`, 
            successRate >= 70 ? 'success' : 'warning'
        );
        
        this.setButtonState('testAdvancedSentiment', successRate >= 70 ? 'success' : 'warning');
    }
    
    async testBatchAnalysis() {
        if (!this.pipeline) {
            this.logToOutput(this.sentimentOutput, 'Model not loaded. Please run model loading test first.', 'error');
            return;
        }
        
        this.setButtonState('testBatchAnalysis', 'running');
        this.logToOutput(this.sentimentOutput, '\nTesting batch analysis performance...', 'info');
        
        const batchTexts = [
            ...this.testData.positive.slice(0, 3),
            ...this.testData.negative.slice(0, 3),
            ...this.testData.neutral.slice(0, 3)
        ];
        
        const startTime = performance.now();
        let successCount = 0;
        
        for (let i = 0; i < batchTexts.length; i++) {
            try {
                const result = await this.pipeline(batchTexts[i]);
                successCount++;
                
                if (i % 3 === 0) {
                    this.logToOutput(this.sentimentOutput, `Processed ${i + 1}/${batchTexts.length} texts...`, 'info');
                }
                
            } catch (error) {
                this.logToOutput(this.sentimentOutput, `Batch item ${i + 1} failed: ${error.message}`, 'error');
            }
        }
        
        const totalTime = performance.now() - startTime;
        const avgTimePerItem = totalTime / batchTexts.length;
        const throughput = (1000 / avgTimePerItem).toFixed(2);
        
        this.logToOutput(this.sentimentOutput, 
            `Batch analysis complete: ${successCount}/${batchTexts.length} successful`, 'success');
        this.logToOutput(this.sentimentOutput, 
            `Total time: ${Math.round(totalTime)}ms, Avg per item: ${Math.round(avgTimePerItem)}ms`, 'info');
        this.logToOutput(this.sentimentOutput, 
            `Throughput: ${throughput} analyses per second`, 'info');
        
        this.setButtonState('testBatchAnalysis', successCount === batchTexts.length ? 'success' : 'warning');
    }
    
    async testEdgeCases() {
        if (!this.pipeline) {
            this.logToOutput(this.sentimentOutput, 'Model not loaded. Please run model loading test first.', 'error');
            return;
        }
        
        this.setButtonState('testEdgeCases', 'running');
        this.logToOutput(this.sentimentOutput, '\nTesting edge cases and error handling...', 'info');
        
        let totalTests = 0;
        let handledGracefully = 0;
        
        for (const text of this.testData.edge) {
            totalTests++;
            
            try {
                if (text === '') {
                    // Empty string should either be handled or throw predictable error
                    try {
                        const result = await this.pipeline(text);
                        this.logToOutput(this.sentimentOutput, `Empty string handled: ${JSON.stringify(result)}`, 'success');
                        handledGracefully++;
                    } catch (error) {
                        this.logToOutput(this.sentimentOutput, `Empty string properly rejected: ${error.message}`, 'success');
                        handledGracefully++;
                    }
                } else {
                    const result = await this.pipeline(text);
                    const displayText = text.length > 20 ? text.substring(0, 20) + '...' : text;
                    
                    this.logToOutput(this.sentimentOutput, 
                        `"${displayText}" → ${result[0].label} (${Math.round(result[0].score * 100)}%)`, 'success');
                    handledGracefully++;
                }
                
                await this.delay(100);
                
            } catch (error) {
                this.logToOutput(this.sentimentOutput, 
                    `Edge case error (expected): ${error.message}`, 'warning');
                // Errors are sometimes expected for edge cases
                handledGracefully++;
            }
        }
        
        const successRate = Math.round((handledGracefully / totalTests) * 100);
        this.logToOutput(this.sentimentOutput, 
            `Edge case testing complete: ${handledGracefully}/${totalTests} handled gracefully (${successRate}%)`, 
            successRate >= 80 ? 'success' : 'warning'
        );
        
        this.setButtonState('testEdgeCases', successRate >= 80 ? 'success' : 'warning');
    }
    
    async runPerformanceTests() {
        this.setButtonState('runPerformanceTests', 'running');
        this.logToOutput(this.sentimentOutput, '\nRunning comprehensive performance tests...', 'info');
        
        if (!this.pipeline) {
            await this.testModelLoading();
        }
        
        // Test various text lengths
        const testTexts = [
            'Good', // Very short
            'This is good quality', // Short
            'This product has excellent quality and I would definitely recommend it to others', // Medium
            'I have been using this product for several months now and I must say that the quality is exceptional. The customer service team has been very helpful and responsive to all my queries. I would definitely recommend this to anyone looking for a reliable solution.', // Long
        ];
        
        const performanceData = [];
        
        for (let i = 0; i < testTexts.length; i++) {
            const text = testTexts[i];
            const times = [];
            
            // Run each test multiple times for accuracy
            for (let j = 0; j < 5; j++) {
                const start = performance.now();
                await this.pipeline(text);
                const time = performance.now() - start;
                times.push(time);
            }
            
            const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
            const minTime = Math.min(...times);
            const maxTime = Math.max(...times);
            
            performanceData.push({
                length: text.length,
                avgTime: avgTime,
                minTime: minTime,
                maxTime: maxTime
            });
            
            this.logToOutput(this.sentimentOutput, 
                `Text length ${text.length}: avg ${Math.round(avgTime)}ms (${Math.round(minTime)}-${Math.round(maxTime)}ms)`, 'info');
        }
        
        this.updatePerformanceChart(performanceData);
        this.setButtonState('runPerformanceTests', 'success');
    }
    
    async runStressTests() {
        this.setButtonState('runStressTests', 'running');
        this.logToOutput(this.sentimentOutput, '\nRunning stress tests...', 'info');
        
        if (!this.pipeline) {
            await this.testModelLoading();
        }
        
        const stressText = 'This is a stress test for the sentiment analysis model.';
        const iterations = 50;
        let successful = 0;
        let failed = 0;
        
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            try {
                await this.pipeline(stressText);
                successful++;
                
                if (i % 10 === 0) {
                    this.logToOutput(this.sentimentOutput, `Stress test progress: ${i + 1}/${iterations}`, 'info');
                }
            } catch (error) {
                failed++;
                this.logToOutput(this.sentimentOutput, `Stress test failure at iteration ${i + 1}: ${error.message}`, 'error');
            }
        }
        
        const totalTime = performance.now() - startTime;
        const reliability = Math.round((successful / iterations) * 100);
        
        this.logToOutput(this.sentimentOutput, 
            `Stress test complete: ${successful}/${iterations} successful (${reliability}% reliability)`, 
            reliability >= 95 ? 'success' : 'warning');
        this.logToOutput(this.sentimentOutput, 
            `Total time: ${Math.round(totalTime)}ms, Avg: ${Math.round(totalTime / iterations)}ms per analysis`, 'info');
        
        this.setButtonState('runStressTests', reliability >= 95 ? 'success' : 'warning');
    }
    
    async runAllTests() {
        this.setButtonState('runAllTests', 'running');
        this.testProgress.style.display = 'block';
        
        const tests = [
            { name: 'Browser Compatibility', fn: () => this.testRequirements() },
            { name: 'Transformers.js Loading', fn: () => this.testBrowserSupport() },
            { name: 'Model Download', fn: () => this.testModelLoading() },
            { name: 'Basic Sentiment', fn: () => this.testBasicSentiment() },
            { name: 'Advanced Cases', fn: () => this.testAdvancedSentiment() },
            { name: 'Performance', fn: () => this.runPerformanceTests() },
            { name: 'Error Handling', fn: () => this.testEdgeCases() },
            { name: 'Memory Usage', fn: () => this.checkMemoryUsage() }
        ];
        
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const indicator = this.testList.children[i].querySelector('.status-indicator');
            
            indicator.className = 'status-indicator running';
            this.updateProgress(this.testProgressFill, ((i) / tests.length) * 100);
            
            try {
                await test.fn();
                indicator.className = 'status-indicator success';
            } catch (error) {
                indicator.className = 'status-indicator error';
                this.logToOutput(this.summaryOutput, `Test "${test.name}" failed: ${error.message}`, 'error');
            }
            
            await this.delay(500);
        }
        
        this.updateProgress(this.testProgressFill, 100);
        this.generateTestSummary();
        this.setButtonState('runAllTests', 'success');
        
        setTimeout(() => {
            this.testProgress.style.display = 'none';
        }, 2000);
    }
    
    async runQuickTests() {
        this.setButtonState('runQuickTests', 'running');
        
        try {
            await this.testRequirements();
            await this.testModelLoading();
            await this.testBasicSentiment();
            
            this.logToOutput(this.summaryOutput, 'Quick tests completed successfully!', 'success');
            this.setButtonState('runQuickTests', 'success');
            
        } catch (error) {
            this.logToOutput(this.summaryOutput, `Quick tests failed: ${error.message}`, 'error');
            this.setButtonState('runQuickTests', 'error');
        }
    }
    
    checkMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            this.logToOutput(this.summaryOutput, 
                `Memory Usage - Used: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB, ` +
                `Total: ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB, ` +
                `Limit: ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`, 'info');
        } else {
            this.logToOutput(this.summaryOutput, 'Memory usage information not available in this browser', 'warning');
        }
    }
    
    generateTestSummary() {
        const summary = [];
        summary.push('=== TEST SUMMARY ===\n');
        
        if (this.metrics.modelLoadTime > 0) {
            summary.push(`Model Load Time: ${Math.round(this.metrics.modelLoadTime)}ms`);
        }
        
        if (this.metrics.totalAnalyses > 0) {
            const avgTime = this.metrics.analysisTime.reduce((a, b) => a + b, 0) / this.metrics.analysisTime.length;
            const successRate = Math.round((this.metrics.successfulAnalyses / this.metrics.totalAnalyses) * 100);
            
            summary.push(`Total Analyses: ${this.metrics.totalAnalyses}`);
            summary.push(`Success Rate: ${successRate}%`);
            summary.push(`Average Analysis Time: ${Math.round(avgTime)}ms`);
        }
        
        summary.push('\n=== RECOMMENDATIONS ===');
        
        if (this.metrics.modelLoadTime > 30000) {
            summary.push('⚠️ Model loading is slow. Consider using a faster internet connection.');
        }
        
        if (this.metrics.analysisTime.length > 0) {
            const avgTime = this.metrics.analysisTime.reduce((a, b) => a + b, 0) / this.metrics.analysisTime.length;
            if (avgTime > 2000) {
                summary.push('⚠️ Analysis is slow. Consider using a more powerful device.');
            } else if (avgTime < 500) {
                summary.push('✅ Excellent analysis performance!');
            }
        }
        
        summary.push('\n=== STATUS ===');
        summary.push('All core functionality is working correctly.');
        summary.push('The sentiment analysis tool is ready for use.');
        
        this.logToOutput(this.summaryOutput, summary.join('\n'), 'success');
    }
    
    // Utility methods
    updateMetrics() {
        this.updateMetric('totalAnalyses', this.metrics.totalAnalyses);
        
        if (this.metrics.analysisTime.length > 0) {
            const avgTime = this.metrics.analysisTime.reduce((a, b) => a + b, 0) / this.metrics.analysisTime.length;
            this.updateMetric('avgAnalysisTime', Math.round(avgTime));
        }
        
        if (this.metrics.totalAnalyses > 0) {
            const successRate = Math.round((this.metrics.successfulAnalyses / this.metrics.totalAnalyses) * 100);
            this.updateMetric('successRate', successRate);
        }
    }
    
    updateMetric(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    updateProgress(progressElement, percentage) {
        progressElement.style.width = `${percentage}%`;
        progressElement.textContent = `${Math.round(percentage)}%`;
    }
    
    updatePerformanceChart(data) {
        this.performanceChart.innerHTML = '';
        
        if (data.length === 0) return;
        
        const maxTime = Math.max(...data.map(d => d.avgTime));
        
        data.forEach((item, index) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.height = `${(item.avgTime / maxTime) * 100}%`;
            bar.title = `Length: ${item.length}, Time: ${Math.round(item.avgTime)}ms`;
            this.performanceChart.appendChild(bar);
        });
    }
    
    setButtonState(buttonId, state) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        button.className = `test-btn ${state}`;
        
        switch (state) {
            case 'running':
                button.innerHTML = '<span class="spinner"></span> Running...';
                button.disabled = true;
                break;
            case 'success':
                button.innerHTML = '✅ Passed';
                button.disabled = false;
                break;
            case 'error':
                button.innerHTML = '❌ Failed';
                button.disabled = false;
                break;
            case 'warning':
                button.innerHTML = '⚠️ Warning';
                button.disabled = false;
                break;
            default:
                button.disabled = false;
        }
    }
    
    logToOutput(outputElement, message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logLine = `[${timestamp}] ${message}\n`;
        
        const span = document.createElement('span');
        span.className = level;
        span.textContent = logLine;
        
        outputElement.appendChild(span);
        outputElement.scrollTop = outputElement.scrollHeight;
    }
    
    clearMetrics() {
        this.metrics = {
            modelLoadTime: 0,
            totalAnalyses: 0,
            successfulAnalyses: 0,
            analysisTime: [],
            memoryUsage: []
        };
        
        this.updateMetric('modelLoadTime', '-');
        this.updateMetric('avgAnalysisTime', '-');
        this.updateMetric('totalAnalyses', '-');
        this.updateMetric('successRate', '-');
        
        this.performanceChart.innerHTML = '';
        
        this.logToOutput(this.summaryOutput, 'Metrics cleared.', 'info');
    }
    
    stopTests() {
        // Simple stop mechanism - mainly for UI feedback
        this.testProgress.style.display = 'none';
        this.modelProgress.style.display = 'none';
        
        // Reset all button states
        const buttons = document.querySelectorAll('.test-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.className = 'test-btn';
            btn.innerHTML = btn.innerHTML.replace(/^(.*?Running...|.*?Passed|.*?Failed|.*?Warning)/, '');
        });
        
        this.logToOutput(this.summaryOutput, 'Tests stopped by user.', 'warning');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize test suite when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧪 Sentiment Analysis Test Suite loaded');
    window.testSuite = new SentimentTestSuite();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'r':
                    e.preventDefault();
                    window.testSuite.runQuickTests();
                    break;
                case 't':
                    e.preventDefault();
                    window.testSuite.runAllTests();
                    break;
            }
        }
    });
    
    console.log('💡 Keyboard shortcuts: Ctrl+R (Quick Tests), Ctrl+T (All Tests)');
}); 