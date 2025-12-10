import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg"></div>
              <h1 className="text-2xl font-bold text-gray-900">Nullshot Builds</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/feed" className="text-gray-700 hover:text-gray-900 font-medium">
                Feed
              </Link>
              <Link href="/trending" className="text-gray-700 hover:text-gray-900 font-medium">
                Trending
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                Login
              </Link>
              <Link href="/signup" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium">
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Share Your Nullshot Builds
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Showcase your projects, get feedback, and discover amazing builds from the Nullshot community
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold text-lg">
              Get Started
            </Link>
            <Link href="/feed" className="bg-white text-purple-600 px-8 py-3 rounded-lg border-2 border-purple-600 hover:bg-purple-50 font-semibold text-lg">
              Explore Builds
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Share Videos & Demos</h3>
            <p className="text-gray-600">Upload videos and embed live previews of your builds</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Star & Comment</h3>
            <p className="text-gray-600">Engage with the community through stars and comments</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Build Your Profile</h3>
            <p className="text-gray-600">Showcase all your projects in one place</p>
          </div>
        </div>
      </main>
    </div>
  );
}

