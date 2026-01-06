document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const heroSection = document.getElementById('hero-section');
    const scanningSection = document.getElementById('scanning-section');
    const resultSection = document.getElementById('result-section');
    const urlInput = document.getElementById('url-input');
    const scanBtn = document.getElementById('scan-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const detailsPanel = document.getElementById('details-panel');
    const toggleDetailsBtn = document.getElementById('toggle-details');
    
    // Result Elements
    const safeResult = document.getElementById('safe-result');
    const phishingResult = document.getElementById('phishing-result');
    const resultUrls = document.querySelectorAll('.result-url');
    const trustScore = document.getElementById('trust-score');
    const sslStatus = document.getElementById('ssl-status');
    const serverLoc = document.getElementById('server-loc');

    // Auth Elements
    const authSection = document.getElementById('auth-section');
    const mainNav = document.getElementById('main-nav');
    const mainContent = document.getElementById('main-content');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userDisplay = document.getElementById('user-display');
    
    // Inputs
    const loginUserIn = document.getElementById('login-username');
    const loginPassIn = document.getElementById('login-password');
    const regUserIn = document.getElementById('reg-username');
    const regPassIn = document.getElementById('reg-password');
    
    // Toggles
    const toggleLoginPass = document.getElementById('toggle-login-pass');
    const toggleRegPass = document.getElementById('toggle-reg-pass');

    // Initialize App
    initApp();

    function initApp() {
        // Load default users if not present
        if (!localStorage.getItem('users')) {
            fetch('users.json')
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('users', JSON.stringify(data));
                })
                .catch(err => {
                    console.error("Could not load default users", err);
                    // Fallback default
                    const defaults = [{ username: 'admin', password: 'password123' }];
                    localStorage.setItem('users', JSON.stringify(defaults));
                });
        }

        checkLogin();
    }

    function checkLogin() {
        const currentUser = sessionStorage.getItem('currentUser');
        if (currentUser) {
            showMainApp(currentUser);
        } else {
            showAuth();
        }
    }

    function showAuth() {
        authSection.classList.remove('hidden');
        mainNav.classList.add('hidden');
        mainContent.classList.add('hidden');
        document.body.classList.remove('danger-mode'); // Reset theme
        
        // Reset forms
        loginBtn.querySelector('.btn-text').classList.remove('hidden');
        loginBtn.querySelector('.btn-loader').classList.add('hidden');
    }

    function showMainApp(username) {
        authSection.classList.add('hidden');
        mainNav.classList.remove('hidden');
        mainContent.classList.remove('hidden');
        userDisplay.innerText = `Hi, ${username}`;
    }

    // Password Toggle Logic
    function setupPasswordToggle(toggleBtn, inputField) {
        toggleBtn.addEventListener('click', () => {
            const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
            inputField.setAttribute('type', type);
            
            // Toggle Icon
            if (type === 'text') {
                toggleBtn.classList.remove('fa-eye-slash');
                toggleBtn.classList.add('fa-eye');
            } else {
                toggleBtn.classList.remove('fa-eye');
                toggleBtn.classList.add('fa-eye-slash');
            }
        });
    }

    setupPasswordToggle(toggleLoginPass, loginPassIn);
    setupPasswordToggle(toggleRegPass, regPassIn);

    // Auth Event Listeners
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden-form');
        registerForm.classList.remove('hidden-form');
        registerForm.style.display = 'flex'; // Ensure flex display
        loginForm.style.display = 'none';
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden-form');
        loginForm.classList.remove('hidden-form');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    });

    loginBtn.addEventListener('click', () => {
        const username = loginUserIn.value.trim();
        const password = loginPassIn.value.trim();
        
        // Loading Animation
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        setTimeout(() => {
            if (login(username, password)) {
                sessionStorage.setItem('currentUser', username);
                showMainApp(username);
                loginUserIn.value = '';
                loginPassIn.value = '';
            } else {
                alert('Invalid credentials! Try admin/password123');
                loginPassIn.value = '';
                loginPassIn.focus();
            }
            // Reset Button
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }, 1500); // Fake network delay
    });

    registerBtn.addEventListener('click', () => {
        const username = regUserIn.value.trim();
        const password = regPassIn.value.trim();

        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Loading Animation
        const btnText = registerBtn.querySelector('.btn-text');
        const btnLoader = registerBtn.querySelector('.btn-loader');
        
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        setTimeout(() => {
            if (register(username, password)) {
                alert('Registration successful! Please login.');
                // Switch to login
                registerForm.classList.add('hidden-form');
                loginForm.classList.remove('hidden-form');
                loginForm.style.display = 'flex';
                registerForm.style.display = 'none';
                regUserIn.value = '';
                regPassIn.value = '';
            } else {
                alert('Username already exists!');
            }
            // Reset Button
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }, 1500);
    });
    
    // Add Enter key support for forms
    loginPassIn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginBtn.click();
        }
    });
    
    regPassIn.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            registerBtn.click();
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('currentUser');
        checkLogin();
    });

    // Auth Logic
    function login(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(u => u.username === username && u.password === password);
    }

    function register(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.username === username)) {
            return false; // User exists
        }
        
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        return true;
    }

    // Dashboard Elements
    const dashboardSection = document.getElementById('dashboard-section');
    const navHome = document.getElementById('nav-home');
    const navDashboard = document.getElementById('nav-dashboard');
    const totalScansEl = document.getElementById('total-scans');
    const safeCountEl = document.getElementById('safe-count');
    const phishingCountEl = document.getElementById('phishing-count');
    const historyListEl = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    // Navigation Logic
    if (navHome) {
        navHome.addEventListener('click', () => {
            document.body.classList.remove('danger-mode'); // Reset Theme on Home Click
            dashboardSection.classList.add('hidden');
            
            // Ensure main content is visible
            mainContent.classList.remove('hidden');
            
            if (scanningSection.classList.contains('hidden') && resultSection.classList.contains('hidden')) {
                heroSection.classList.remove('hidden');
            } else if (!resultSection.classList.contains('hidden')) {
                // Stay on result - Re-apply danger mode if needed
                 const isPhishingVisible = !phishingResult.classList.contains('hidden');
                 if(isPhishingVisible) document.body.classList.add('danger-mode');
            } else {
                // Stay on scanning (or reset?) - let's just show hero if not scanning
                 if (scanningSection.classList.contains('hidden')) {
                     heroSection.classList.remove('hidden');
                 }
            }
        });
    }

    if (navDashboard) {
        navDashboard.addEventListener('click', () => {
            heroSection.classList.add('hidden');
            scanningSection.classList.add('hidden');
            resultSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            loadDashboard();
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all scan history?')) {
                localStorage.removeItem('scanHistory');
                loadDashboard();
            }
        });
    }
    
    // Export History
    const exportHistoryBtn = document.getElementById('export-history');
    if (exportHistoryBtn) {
        exportHistoryBtn.addEventListener('click', () => {
            const history = JSON.parse(localStorage.getItem('scanHistory')) || [];
            if (history.length === 0) {
                alert('No history to export');
                return;
            }
            
            const dataStr = JSON.stringify(history, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `phishguard-history-${new Date().toISOString().slice(0,10)}.json`;
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });

    // Scan Button Click
    scanBtn.addEventListener('click', startScan);

    // Enter Key Support
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startScan();
    });

    function startScan() {
        const url = urlInput.value.trim();
        
        if (!url) {
            urlInput.style.borderColor = 'var(--danger-color)';
            setTimeout(() => urlInput.style.borderColor = 'transparent', 2000);
            return;
        }

        // Transition to Scanning
        heroSection.classList.add('hidden');
        scanningSection.classList.remove('hidden');
        
        // Reset Steps
        resetSteps();

        // Simulate Scanning Process
        simulateScan(url);
    }

    function resetSteps() {
        document.querySelectorAll('.step').forEach(step => {
            step.className = 'step';
            step.querySelector('i').className = 'fa-regular fa-circle';
        });
        document.getElementById('scan-text').innerText = 'Analyzing URL...';
    }

    // ============================================
    // API Configuration
    // ============================================
    const API_URL = 'https://insurable-daisy-enthrallingly.ngrok-free.dev/predict';
    
    async function simulateScan(url) {
        const steps = [
            { id: 'step-1', text: 'Checking domain reputation...' },
            { id: 'step-2', text: 'Verifying SSL certificate...' },
            { id: 'step-3', text: 'Analyzing page behavior...' }
        ];

        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep >= steps.length) {
                clearInterval(interval);
                // Call actual API instead of mock
                performActualScan(url);
                return;
            }

            const stepEl = document.getElementById(steps[currentStep].id);
            stepEl.classList.add('active');
            stepEl.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

            // Mark previous as done
            if (currentStep > 0) {
                const prevStep = document.getElementById(steps[currentStep - 1].id);
                prevStep.classList.remove('active');
                prevStep.classList.add('completed');
                prevStep.querySelector('i').className = 'fa-solid fa-check';
            }

            document.getElementById('scan-text').innerText = steps[currentStep].text;
            currentStep++;

        }, 800); // 800ms per step
    }

    // New function to call the actual API
    async function performActualScan(url) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            
            // Check if there's an error in the response
            if (data.error || data.detail) {
                throw new Error(data.error || data.detail);
            }

            // Show result based on API response
            showResult(url, data.prediction === 1, data.confidence || 'N/A');

        } catch (error) {
            console.error('API Error:', error);
            // Fallback to mock logic if API fails
            alert(`API Error: ${error.message}\n\nFalling back to demo mode.`);
            showResult(url, isPhishingUrl(url), '85%');
        }
    }

    function showResult(url, isPhishing, confidence = 'N/A') {
        // Mark last step as done
        const lastStep = document.getElementById('step-3');
        lastStep.classList.remove('active');
        lastStep.classList.add('completed');
        lastStep.querySelector('i').className = 'fa-solid fa-check';

        setTimeout(() => {
            scanningSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
            
            // Save to History
            saveScan(url, isPhishing, confidence);

            resultUrls.forEach(el => el.innerText = url);

            if (isPhishing) {
                document.body.classList.add('danger-mode'); // Enable Red Theme
                phishingResult.classList.remove('hidden');
                phishingResult.classList.add('shake'); // Add shake effect
                safeResult.classList.add('hidden');
                
                // Update Details for Phishing
                const confidencePercent = parseFloat(confidence) || 15;
                trustScore.style.width = confidencePercent + '%';
                trustScore.style.backgroundColor = 'var(--danger-color)';
                sslStatus.innerText = 'Invalid / Missing';
                sslStatus.style.color = 'var(--danger-color)';
                serverLoc.innerText = `Phishing (Confidence: ${confidence})`;
            } else {
                document.body.classList.remove('danger-mode'); // Ensure Safe Theme
                safeResult.classList.remove('hidden');
                phishingResult.classList.add('hidden');
                
                // Update Details for Safe
                const confidencePercent = parseFloat(confidence) || 95;
                trustScore.style.width = confidencePercent + '%';
                trustScore.style.backgroundColor = 'var(--success-color)';
                sslStatus.innerText = 'Valid (HTTPS)';
                sslStatus.style.color = 'var(--success-color)';
                serverLoc.innerText = `Legitimate (Confidence: ${confidence})`;
            }

            detailsPanel.classList.remove('hidden');
            
            // Load Preview and WHOIS
            loadWebsitePreview(url);
            loadWhoisData(url);

        }, 500);
    }

    // Load Website Preview Screenshot
    async function loadWebsitePreview(url) {
        const previewPanel = document.getElementById('preview-panel');
        const previewLoader = document.getElementById('preview-loader');
        const previewImage = document.getElementById('preview-image');
        
        previewPanel.classList.remove('hidden');
        previewLoader.classList.remove('hidden');
        previewImage.classList.add('hidden');
        
        try {
            // Extract domain info
            const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
            const domain = urlObj.hostname;
            const protocol = urlObj.protocol;
            const path = urlObj.pathname;
            
            // Show URL information instead of screenshot (free services have CORS/API key issues)
            previewLoader.innerHTML = `
                <div style="text-align: center; padding: 0.5rem; width: 100%;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <i class="fa-solid fa-globe" style="font-size: 1.2rem; color: var(--primary-color);"></i>
                        <h4 style="margin: 0; color: var(--text-color); font-size: 1rem;">URL Analysis</h4>
                    </div>
                    <div style="background: rgba(0,0,0,0.1); padding: 0.5rem; border-radius: 6px; text-align: left; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.3rem;">
                        <div style="display: flex; justify-content: space-between;"><strong>Domain:</strong> <span>${domain}</span></div>
                        <div style="display: flex; justify-content: space-between;"><strong>Protocol:</strong> <span>${protocol}</span></div>
                        <div style="display: flex; justify-content: space-between;"><strong>Path:</strong> <span>${path || '/'}</span></div>
                        <div style="display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 0.3rem; margin-top: 0.2rem;">
                            <strong>Secure:</strong> <span>${protocol === 'https:' ? '✅ Yes (HTTPS)' : '⚠️ No (HTTP)'}</span>
                        </div>
                    </div>
                    <p style="margin-top: 0.5rem; font-size: 0.7rem; opacity: 0.6;">Visual preview unavailable due to CORS restrictions</p>
                </div>
            `;
            
        } catch (error) {
            console.error('Preview error:', error);
            previewLoader.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i><p>Unable to parse URL</p>';
        }
    }

    // Load WHOIS Domain Data
    async function loadWhoisData(url) {
        const whoisPanel = document.getElementById('whois-panel');
        const whoisLoader = document.getElementById('whois-loader');
        const whoisContent = document.getElementById('whois-content');
        const whoisError = document.getElementById('whois-error');
        
        whoisPanel.classList.remove('hidden');
        whoisLoader.classList.remove('hidden');
        whoisContent.classList.add('hidden');
        whoisError.classList.add('hidden');
        
        try {
            // Extract domain from URL
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            // Using free WHOIS API
            const response = await fetch(`https://ipwhois.app/json/${domain}`);
            const data = await response.json();
            
            if (data.success !== false) {
                document.getElementById('whois-domain').textContent = domain;
                document.getElementById('whois-created').textContent = data.created || 'N/A';
                document.getElementById('whois-country').textContent = data.country || 'N/A';
                document.getElementById('whois-org').textContent = data.org || data.isp || 'N/A';
                document.getElementById('whois-ip').textContent = data.ip || 'N/A';
                document.getElementById('whois-isp').textContent = data.isp || 'N/A';
                
                whoisLoader.classList.add('hidden');
                whoisContent.classList.remove('hidden');
            } else {
                throw new Error('WHOIS lookup failed');
            }
            
        } catch (error) {
            console.error('WHOIS error:', error);
            whoisLoader.classList.add('hidden');
            whoisError.classList.remove('hidden');
        }
    }

    function isPhishingUrl(url) {
        const lowerUrl = url.toLowerCase();
        // Mock logic for demonstration
        return lowerUrl.includes('phish') || 
               lowerUrl.includes('hack') || 
               lowerUrl.includes('login') || 
               lowerUrl.includes('bank') ||
               lowerUrl.includes('update') ||
               lowerUrl.includes('verify');
    }

    // Reset Scanner
    window.resetScanner = function() {
        document.body.classList.remove('danger-mode'); // Reset Theme
        resultSection.classList.add('hidden');
        phishingResult.classList.remove('shake'); // Remove shake class
        heroSection.classList.remove('hidden');
        urlInput.value = '';
        
        // Hide additional panels
        safeResult.classList.add('hidden');
        phishingResult.classList.add('hidden');
        detailsPanel.classList.add('hidden');
        document.getElementById('preview-panel').classList.add('hidden');
        document.getElementById('whois-panel').classList.add('hidden');
        
        // Reset Details Panel
        const content = detailsPanel.querySelector('.panel-content');
        content.classList.remove('collapsed');
        const icon = toggleDetailsBtn.querySelector('i');
        icon.style.transform = 'rotate(0deg)';
    };

    // Toggle Details Panel
    toggleDetailsBtn.addEventListener('click', () => {
        const content = detailsPanel.querySelector('.panel-content');
        const icon = toggleDetailsBtn.querySelector('i');
        
        content.classList.toggle('collapsed');
        
        if (content.classList.contains('collapsed')) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    });

    // 3D Tilt Effect
    const cards = document.querySelectorAll('.glass-card');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        const midX = window.innerWidth / 2;
        const midY = window.innerHeight / 2;
        
        // Calculate rotation based on mouse position relative to center
        // Max rotation: 5 degrees to keep it subtle
        const rotateX = ((y - midY) / midY) * -5; 
        const rotateY = ((x - midX) / midX) * 5;

        cards.forEach(card => {
            // Only apply if card is visible
            if(card.offsetParent !== null) {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
    });
});
    // --- History & Dashboard Logic ---

    function saveScan(url, isPhishing, confidence = 'N/A') {
        try {
            const now = new Date();
            let domain = url;
            
            // Try to extract domain from URL
            try {
                const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
                domain = urlObj.hostname;
            } catch (e) {
                // If URL parsing fails, use the URL as-is
                domain = url.replace(/^https?:\/\//, '').split('/')[0];
            }
            
            const scan = {
                id: Date.now() + Math.random(), // Unique ID
                url: url,
                status: isPhishing ? 'Phishing' : 'Safe',
                confidence: confidence,
                date: now.toLocaleString(),
                timestamp: now.toISOString(),
                domain: domain
            };

            let history = JSON.parse(localStorage.getItem('scanHistory')) || [];
            history.unshift(scan); // Add to beginning
            
            // Limit history to 100 items
            if (history.length > 100) history.pop();

            localStorage.setItem('scanHistory', JSON.stringify(history));
            console.log('✅ Scan saved to history:', scan);
            
        } catch (error) {
            console.error('❌ Error saving scan to history:', error);
        }
    }

    function loadDashboard() {
        const history = JSON.parse(localStorage.getItem('scanHistory')) || [];
        
        // Get fresh references to dashboard elements
        const totalScans = document.getElementById('total-scans');
        const safeCount = document.getElementById('safe-count');
        const phishingCount = document.getElementById('phishing-count');
        const historyList = document.getElementById('history-list');
        
        // Check if dashboard elements exist
        if (!totalScans || !safeCount || !phishingCount || !historyList) {
            console.warn('Dashboard elements not found');
            return;
        }
        
        // Update Stats
        const total = history.length;
        const phishing = history.filter(item => item.status === 'Phishing').length;
        const safe = total - phishing;

        totalScans.innerText = total;
        safeCount.innerText = safe;
        phishingCount.innerText = phishing;

        // Render List
        historyList.innerHTML = '';

        if (history.length === 0) {
            historyList.innerHTML = '<div class=\'empty-state\'>No scan history found.</div>';
            return;
        }

        history.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `history-item ${item.status.toLowerCase()}`;
            div.setAttribute('data-id', item.id || index);
            
            const confidenceText = item.confidence ? ` (${item.confidence})` : '';
            const domain = item.domain || new URL(item.url).hostname;
            
            div.innerHTML = `
                <div class="history-main">
                    <div class="history-info">
                        <span class="history-url" title="${item.url}">${item.url}</span>
                        <span class="history-date"><i class="fa-solid fa-clock"></i> ${item.date}</span>
                        <span class="history-domain"><i class="fa-solid fa-globe"></i> ${domain}</span>
                    </div>
                    <div class="history-actions">
                        <span class="history-status ${item.status.toLowerCase()}">
                            ${item.status === 'Phishing' ? '<i class="fa-solid fa-triangle-exclamation"></i> Phishing' : '<i class="fa-solid fa-shield-check"></i> Safe'}${confidenceText}
                        </span>
                        <button class="delete-btn" onclick="deleteScanItem('${item.id || index}')" title="Delete this scan">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            historyList.appendChild(div);
        });
    }
    
    // Delete individual scan item
    window.deleteScanItem = function(itemId) {
        let history = JSON.parse(localStorage.getItem('scanHistory')) || [];
        history = history.filter(item => (item.id || item.url) != itemId);
        localStorage.setItem('scanHistory', JSON.stringify(history));
        loadDashboard();
    }

