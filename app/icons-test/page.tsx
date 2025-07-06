"use client";

export default function IconsTestPage() {
  const baseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_PORTFOLIO_URL
    : "http://localhost:3000";

  const icons = [
    { name: "Favicon 16x16", url: "/favicon-16x16.png", size: "16x16" },
    { name: "Favicon 32x32", url: "/favicon-32x32.png", size: "32x32" },
    { name: "Apple Touch Icon", url: "/apple-touch-icon.png", size: "180x180" },
    { name: "Android Chrome 192", url: "/android-chrome-192x192.png", size: "192x192" },
    { name: "Android Chrome 512", url: "/android-chrome-512x512.png", size: "512x512" },
  ];

  const socialImages = [
    { name: "Open Graph Image", url: "/charles_big.png", recommended: "1200x630" },
    { name: "Profile Image", url: "/charles_passport_size.png", recommended: "Square format" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Icons & Meta Tags Test Page
        </h1>
        
        {/* Current Icons Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current App Icons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {icons.map((icon) => (
              <div key={icon.name} className="border rounded-lg p-4 text-center">
                <div className="mb-3">
                  <img 
                    src={icon.url} 
                    alt={icon.name}
                    className="mx-auto border"
                    style={{ 
                      width: icon.size.split('x')[0] + 'px',
                      height: icon.size.split('x')[1] + 'px',
                      maxWidth: '128px',
                      maxHeight: '128px'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.textContent = 'Image not found';
                      errorDiv.className = 'text-red-500 text-sm';
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
                <h3 className="font-medium text-sm">{icon.name}</h3>
                <p className="text-gray-600 text-xs">{icon.size}</p>
                <a 
                  href={icon.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                >
                  View Full Size
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media Images Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Social Media Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialImages.map((image) => (
              <div key={image.name} className="border rounded-lg p-4">
                <div className="mb-3">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-auto border rounded max-w-md mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.textContent = 'Image not found';
                      errorDiv.className = 'text-red-500 text-center py-8';
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
                <h3 className="font-medium text-center">{image.name}</h3>
                <p className="text-gray-600 text-sm text-center">Recommended: {image.recommended}</p>
                <div className="text-center mt-2">
                  <a 
                    href={image.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Full Size
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meta Tags Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Meta Tags Configuration</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-green-600">✓ Open Graph (Facebook, LinkedIn, WhatsApp)</h3>
              <ul className="text-sm text-gray-600 ml-4 mt-1">
                <li>• Title: Charles Adu Tetteh - Full-Stack Developer & AWS Cloud Expert</li>
                <li>• Image: /charles_big.png (1200x630)</li>
                <li>• Description: Professional summary included</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-green-600">✓ Twitter Card</h3>
              <ul className="text-sm text-gray-600 ml-4 mt-1">
                <li>• Card Type: summary_large_image</li>
                <li>• Handle: @hon_adutette</li>
                <li>• Image: /charles_big.png</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-green-600">✓ App Icons</h3>
              <ul className="text-sm text-gray-600 ml-4 mt-1">
                <li>• Favicon: 16x16, 32x32</li>
                <li>• Apple Touch Icon: 180x180</li>
                <li>• Android Chrome: 192x192, 512x512</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-green-600">✓ Structured Data (JSON-LD)</h3>
              <ul className="text-sm text-gray-600 ml-4 mt-1">
                <li>• Person schema with professional details</li>
                <li>• LinkedIn and GitHub links</li>
                <li>• Skills and occupation information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testing Tools */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Your Social Media Sharing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Facebook/Meta Debugger:</h3>
              <a 
                href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(baseUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Test on Facebook Debugger →
              </a>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Twitter Card Validator:</h3>
              <a 
                href="https://cards-dev.twitter.com/validator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Test on Twitter Card Validator →
              </a>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">LinkedIn Post Inspector:</h3>
              <a 
                href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(baseUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Test on LinkedIn Post Inspector →
              </a>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Rich Results Test:</h3>
              <a 
                href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(baseUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Test Google Rich Results →
              </a>
            </div>
          </div>
        </div>

        {/* Manual Testing Guide */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Manual Testing Guide</h2>
          <div className="space-y-3 text-sm">
            <div>
              <h3 className="font-medium">WhatsApp:</h3>
              <p className="text-gray-600">Share your portfolio URL in a chat to see the preview with your image and description.</p>
            </div>
            
            <div>
              <h3 className="font-medium">Facebook/Instagram:</h3>
              <p className="text-gray-600">Post your URL on Facebook or Instagram to see the Open Graph preview.</p>
            </div>
            
            <div>
              <h3 className="font-medium">Twitter/X:</h3>
              <p className="text-gray-600">Tweet your URL to see the Twitter Card with your image.</p>
            </div>
            
            <div>
              <h3 className="font-medium">LinkedIn:</h3>
              <p className="text-gray-600">Share your URL in a LinkedIn post to see the professional preview.</p>
            </div>
            
            <div>
              <h3 className="font-medium">Browser Icons:</h3>
              <p className="text-gray-600">Check your browser tab for the favicon, bookmark your site to see the icon, and add to home screen on mobile.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
