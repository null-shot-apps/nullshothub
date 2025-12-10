'use client';

import { useEffect, useState } from 'react';
import { User, Build } from '@/types';
import BuildCard from '@/components/BuildCard';
import AuthModal from '@/components/AuthModal';
import CreateBuildModal from '@/components/CreateBuildModal';
import { Star, Plus, LogOut, User as UserIcon } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    fetchCurrentUser();
    fetchBuilds();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchBuilds = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/builds');
      const data = await res.json();
      setBuilds(data.builds);
    } catch (error) {
      console.error('Failed to fetch builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAuthSuccess = (newUser: User) => {
    setUser(newUser);
    setShowAuthModal(false);
  };

  const handleBuildCreated = () => {
    setShowCreateModal(false);
    fetchBuilds();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-blue-600" fill="currentColor" />
              <h1 className="text-2xl font-bold text-gray-900">Nullshot Builds</h1>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Share Build
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Community Builds</h2>
          <p className="text-gray-600">
            Discover amazing projects built with Nullshot. Share your builds, get inspired, and learn from the community.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : builds.length === 0 ? (
          <div className="text-center py-20">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No builds yet</h3>
            <p className="text-gray-600 mb-6">Be the first to share your Nullshot build!</p>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share Your Build
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {builds.map((build) => (
              <BuildCard
                key={build.id}
                build={build}
                currentUser={user}
                onUpdate={fetchBuilds}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}

      {showCreateModal && user && (
        <CreateBuildModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleBuildCreated}
        />
      )}
    </div>
  );
}

