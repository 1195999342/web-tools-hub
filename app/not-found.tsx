import Link from 'next/link';

export default function NotFound() {
  return (
    <html>
      <body>
        <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50">
          <span className="text-6xl mb-6">🔍</span>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
          <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
          <p className="text-gray-500 mb-8">The page you are looking for does not exist.</p>
          <Link
            href="/en"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </main>
      </body>
    </html>
  );
}
