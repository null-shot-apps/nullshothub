'use client';

import { useState } from 'react';
import { Build, User } from '@/types';
import { Star, Eye, MessageCircle, ExternalLink, Flag } from 'lucide-react';
import BuildDetailModal from './BuildDetailModal';

interface BuildCardProps {
  build: Build;
  currentUser: User | null;
  onUpdate: () => void;
}

export default function BuildCard({ build, currentUser, onUpdate }: BuildCardProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(build.stars);

  const handleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      alert('Please login to star builds');
      return;
    }

    try {
      const method = starred ? 'DELETE' : 'POST';
      const res = await fetch(`/api/builds/${build.id}/star`, { method });

      if (res.ok) {
        setStarred(!starred);
        setStarCount(prev => starred ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Failed to star build:', error);
    }
  };

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-200"
      >
        {/* Image */}
        {build.images[0] && (
          <div className="aspect-video bg-gray-100 overflow-hidden">
            <img
              src={build.images[0]}
              alt={build.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {build.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {build.description}
          </p>

          {/* Tags */}
          {build.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {build.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {build.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{build.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{build.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>0</span>
              </div>
            </div>

            <button
              onClick={handleStar}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                starred
                  ? 'bg-yellow-50 text-yellow-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-4 h-4 ${starred ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{starCount}</span>
            </button>
          </div>

          {/* Author */}
          {build.user && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {build.user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{build.user.name}</p>
                <p className="text-xs text-gray-500">@{build.user.username}</p>
              </div>
            </div>
          )}
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

