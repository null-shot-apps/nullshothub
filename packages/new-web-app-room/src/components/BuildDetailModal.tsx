'use client';

import { useState, useEffect } from 'react';
import { X, Star, MessageCircle, ExternalLink, Flag, Code, Play } from 'lucide-react';
import { Build, User, Comment } from '@/types';

interface BuildDetailModalProps {
  build: Build;
  currentUser: User | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function BuildDetailModal({ build, currentUser, onClose, onUpdate }: BuildDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isStarred, setIsStarred] = useState(build.isStarred || false);
  const [starCount, setStarCount] = useState(build.starCount || 0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDescription, setReportDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [build.id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/builds/${build.id}/comments`);
      if (res.ok) {
        const data = await res.json() as { comments: Comment[] };
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleStar = async () => {
    if (!currentUser) return;

    const newIsStarred = !isStarred;
    try {
      const res = await fetch(`/api/builds/${build.id}/star`, {
        method: newIsStarred ? 'POST' : 'DELETE',
      });

      if (res.ok) {
        setIsStarred(newIsStarred);
        setStarCount((prev) => newIsStarred ? prev + 1 : prev - 1);
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to star build:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;

    try {
      const res = await fetch(`/api/builds/${build.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buildId: build.id,
          reason: reportReason,
          description: reportDescription,
        }),
      });

      if (res.ok) {
        setShowReport(false);
        setReportDescription('');
        alert('Report submitted successfully');
      }
    } catch (error) {
      console.error('Failed to submit report:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{build.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Left Column - Media & Description */}
            <div className="space-y-4">
              {/* Tabs for Preview/Code */}
              {(build.websiteUrl || build.videoUrl || build.codeSnippet) && (
                <div className="flex gap-2 border-b border-gray-200">
                  {(build.websiteUrl || build.videoUrl) && (
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'preview'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {build.videoUrl ? <Play className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                        Preview
                      </div>
                    </button>
                  )}
                  {build.codeSnippet && (
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-4 py-2 font-medium transition-colors ${
                        activeTab === 'code'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Code
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Media Display */}
              {activeTab === 'preview' && (
                <>
                  {build.videoUrl && (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                      <video src={build.videoUrl} controls className="w-full h-full" />
                    </div>
                  )}

                  {build.websiteUrl && !build.videoUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={build.websiteUrl}
                        className="w-full h-full"
                        title="Website Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  )}

                  {build.images && build.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {build.images.map((image, index) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={index}
                          src={image}
                          alt={`${build.title} - ${index + 1}`}
                          className="w-full rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'code' && build.codeSnippet && (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
                    <code>{build.codeSnippet}</code>
                  </pre>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{build.description}</p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {build.user?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{build.user?.username || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(build.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleStar}
                  disabled={!currentUser}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isStarred
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${!currentUser ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Star className={`w-5 h-5 ${isStarred ? 'fill-current' : ''}`} />
                  <span>{starCount} Stars</span>
                </button>

                {build.websiteUrl && (
                  <a
                    href={build.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                    <span>Open Live</span>
                  </a>
                )}

                <button
                  onClick={() => setShowReport(!showReport)}
                  className="ml-auto p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {/* Report Form */}
              {showReport && (
                <form onSubmit={handleReport} className="bg-red-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-red-900">Report this build</h4>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="spam">Spam</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="copyright">Copyright Violation</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Additional details (optional)"
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={!currentUser}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Submit Report
                  </button>
                </form>
              )}
            </div>

            {/* Right Column - Comments */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              {currentUser ? (
                <form onSubmit={handleComment} className="space-y-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask how they built it, share feedback..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Post Comment
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-600">
                  Sign in to comment
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                        {comment.user?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">
                        {comment.user?.username || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



