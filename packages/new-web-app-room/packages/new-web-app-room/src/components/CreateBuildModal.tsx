'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateBuildModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBuildModal({ onClose, onSuccess }: CreateBuildModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [''],
    videoUrl: '',
    websiteUrl: '',
    tags: [''],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Filter out empty values
      const cleanData = {
        ...formData,
        images: formData.images.filter(img => img.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        videoUrl: formData.videoUrl.trim() || undefined,
        websiteUrl: formData.websiteUrl.trim() || undefined,
      };

      if (cleanData.images.length === 0) {
        setError('Please add at least one image URL');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create build');
        return;
      }

      onSuccess();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addField = (field: 'images' | 'tags') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeField = (field: 'images' | 'tags', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const updateField = (field: 'images' | 'tags', index: number, value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Build</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="My Awesome Nullshot Build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your build, what it does, and how you built it..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URLs *
            </label>
            {formData.images.map((img, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => updateField('images', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('images', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('images')}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Image
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (optional)
            </label>
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Live Website URL (optional)
            </label>
            <input
              type="url"
              value={formData.websiteUrl}
              onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://your-build.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateField('tags', index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., web-app, ai, dashboard"
                />
                {formData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeField('tags', index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField('tags')}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Share Build'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

