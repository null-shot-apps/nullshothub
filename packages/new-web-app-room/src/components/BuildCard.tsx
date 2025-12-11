'use client';

import { useState } from 'react';
import { Star, MessageCircle, ExternalLink, Play } from 'lucide-react';
import { Build, User } from '@/types';
import BuildDetailModal from './BuildDetailModal';

interface BuildCardProps {
  build: Build;
  currentUser: User | null;
  onUpdate: () => void;
}

export default function BuildCard({ build, currentUser, onUpdate }: BuildCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [isStarred, setIsStarred] = useState(build.isStarred || false);
  const [starCount, setStarCount] = useState(build.starCount || 0);
  const [isStarring, setIsStarring] = useState(false);

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser || isStarring) return;

    setIsStarring(true);
    const newIsStarred = !isStarred;

    try {
      const res = await fetch(`/api/builds/${build.id}/star`, {
        method: newIsStarred ? 'POST' : 'DELETE',
      });

      if (res.ok) {
        setIsStarred(newIsStarred);
        setStarCount((prev: number) => newIsStarred ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Failed to star build:', error);
    } finally {
      setIsStarring(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      >
        {/* Preview Image or Video */}
        {build.images && build.images.length > 0 ? (
          <div className="aspect-video bg-gray-100 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={build.images[0]}
              alt={build.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : build.videoUrl ? (
          <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
        ) : build.websiteUrl ? (
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <ExternalLink className="w-12 h-12 text-white opacity-80" />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-4xl text-white opacity-50">🚀</span>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {build.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {build.description}
          </p>

          {/* User Info */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
              {build.user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-sm text-gray-700">{build.user?.username || 'Anonymous'}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleStar}
              disabled={!currentUser || isStarring}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isStarred
                  ? 'text-yellow-600'
                  : 'text-gray-600 hover:text-yellow-600'
              } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
              <span>{starCount}</span>
            </button>

            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Comment</span>
            </button>

            {build.websiteUrl && (
              <a
                href={build.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors ml-auto"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <BuildDetailModal
          build={build}
          currentUser={currentUser}
          onClose={() => setShowDetail(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}


