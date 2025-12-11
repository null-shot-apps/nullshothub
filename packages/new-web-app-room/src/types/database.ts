export interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface Build {
  id: string;
  userId: string;
  title: string;
  description: string;
  images: string[];
  videoUrl: string | null;
  websiteUrl: string | null;
  codeSnippet: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  buildId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Star {
  id: string;
  buildId: string;
  userId: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  buildId: string;
  userId: string;
  reason: string;
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

export interface Database {
  users: User[];
  builds: Build[];
  comments: Comment[];
  stars: Star[];
  reports: Report[];
}

