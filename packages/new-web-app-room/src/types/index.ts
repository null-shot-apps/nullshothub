export interface User {
  id: string;
  email: string;
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
  user?: User;
  starCount?: number;
  isStarred?: boolean;
}

export interface Comment {
  id: string;
  buildId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user?: User;
}

