export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}

export interface Build {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;
  websiteUrl?: string;
  codeSnippets?: CodeSnippet[];
  tags: string[];
  stars: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface Comment {
  id: string;
  buildId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user?: User;
}

export interface Star {
  id: string;
  buildId: string;
  userId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  buildId?: string;
  commentId?: string;
  userId: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
}

