import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Graph Test - Charles Adu Tetteh Portfolio",
  description:
    "Test page to verify Open Graph and Twitter Card meta tags for social media sharing",
};

export default function OGTestPage() {
  const baseUrl = process.env.NEXT_PUBLIC_PORTFOLIO_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_PORTFOLIO_URL
    : "http://localhost:3000";

  const imageUrl = `${baseUrl}/charles_big.png`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Open Graph Test Page
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Meta Tags</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Title:</strong> Charles Adu Tetteh - Full-Stack Developer
              & AWS Cloud Expert
            </p>
            <p>
              <strong>Description:</strong> React & Next.js specialist building
              high-performance apps with AWS cloud integration. Hire Charles Adu
              Tetteh for modern software development needs. Available for hire
              globally.
            </p>
            <p>
              <strong>Image URL:</strong>{" "}
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {imageUrl}
              </a>
            </p>
            <p>
              <strong>Site URL:</strong>{" "}
              <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {baseUrl}
              </a>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Your Links</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Facebook Sharing Debugger:</h3>
              <a
                href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
                  baseUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Test on Facebook Debugger
              </a>
            </div>

            <div>
              <h3 className="font-medium mb-2">Twitter Card Validator:</h3>
              <a
                href={`https://cards-dev.twitter.com/validator`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Test on Twitter Card Validator
              </a>
            </div>

            <div>
              <h3 className="font-medium mb-2">LinkedIn Post Inspector:</h3>
              <a
                href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(
                  baseUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Test on LinkedIn Post Inspector
              </a>
            </div>

            <div>
              <h3 className="font-medium mb-2">WhatsApp:</h3>
              <p className="text-gray-600">
                Share your portfolio URL directly in WhatsApp to test the
                preview.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview Image</h2>
          <div className="border rounded-lg p-4">
            <img
              src={imageUrl}
              alt="Charles Adu Tetteh - Social Media Preview"
              className="max-w-full h-auto rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/charles_big.png";
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">How to Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Use the links above to test your meta tags on different platforms
            </li>
            <li>
              Share your portfolio URL on WhatsApp, Twitter, LinkedIn, or
              Facebook
            </li>
            <li>
              Check if the preview shows your image, title, and description
              correctly
            </li>
            <li>
              If the image doesn&apos;t load, make sure the S3 bucket allows
              public access
            </li>
            <li>
              Clear cache on social platforms if you make changes to meta tags
            </li>
          </ol>
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
