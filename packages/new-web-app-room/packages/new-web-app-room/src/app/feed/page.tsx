'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Build {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  stars: number;
  comments: number;
  thumbnail: string;
  createdAt: string;
}

const mockBuilds: Build[] = [
  {
    id: '1',
    title: 'AI-Powered Task Manager',
    description: 'Built a smart task manager with AI suggestions using Nullshot. Features include natural language input, priority detection, and smart scheduling.',
    author: {
      name: 'Sarah Chen',
      avatar: '👩‍💻'
    },
    stars: 42,
    comments: 8,
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
    createdAt: '2 hours ago'
  },
  {
    id: '2',
    title: 'Real-time Collaboration Whiteboard',
    description: 'Created a collaborative whiteboard app with real-time sync. Multiple users can draw, add sticky notes, and brainstorm together.',
    author: {
      name: 'Alex Kumar',
      avatar: '👨‍🎨'
    },
    stars: 67,
    comments: 15,
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
    createdAt: '5 hours ago'
  },
  {
    id: '3',
    title: 'Fitness Tracker Dashboard',
    description: 'A beautiful fitness tracking app with charts, goal setting, and workout plans. Integrated with wearable devices.',
    author: {
      name: 'Mike Johnson',
      avatar: '💪'
    },
    stars: 89,
    comments: 23,
    thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400',
    createdAt: '1 day ago'
  }
];

export default function FeedPage() {
  const [builds] = useState<Build[]>(mockBuilds);
  const [filter, setFilter] = useState<'latest' | 'trending' | 'top'>('latest');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg"></div>
                <h1 className="text-2xl font-bold text-gray-900">Nullshot Builds</h1>
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/feed" className="text-purple-600 font-semibold">
                Feed
              </Link>
              <Link href="/trending" className="text-gray-700 hover:text-gray-900 font-medium">
                Trending
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-gray-900 font-medium">
                Profile
              </Link>
              <Link href="/new-build" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium">
                + New Build
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('latest')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'latest'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'trending'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Trending
            </button>
            <button
              onClick={() => setFilter('top')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'top'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Top
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search builds..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build) => (
            <Link
              key={build.id}
              href={`/build/${build.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={build.thumbnail}
                  alt={build.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{build.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{build.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{build.author.avatar}</span>
                    <span className="text-sm font-medium text-gray-700">{build.author.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{build.createdAt}</span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{build.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{build.comments}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

