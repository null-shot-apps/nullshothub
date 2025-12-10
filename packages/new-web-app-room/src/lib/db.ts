import { Database, User, Build, Comment, Star, Report } from '@/types/database';

// Mock database - replace with actual database in production
const db: Database = {
  users: [],
  builds: [],
  comments: [],
  stars: [],
  reports: [],
};

// User operations
export async function getUserByEmail(email: string): Promise<User | undefined> {
  return db.users.find((u: User) => u.email === email);
}

export async function getUserById(id: string): Promise<User | undefined> {
  return db.users.find((u: User) => u.id === id);
}

export async function createUser(data: { email: string; password: string; username: string }): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    email: data.email,
    password: data.password,
    username: data.username,
    avatar: null,
    bio: null,
    createdAt: new Date(),
  };
  db.users.push(user);
  return user;
}

// Build operations
export async function getBuilds(options?: { userId?: string; limit?: number; offset?: number }): Promise<Build[]> {
  let builds = [...db.builds];
  
  if (options?.userId) {
    builds = builds.filter((b: Build) => b.userId === options.userId);
  }
  
  builds.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  if (options?.limit) {
    builds = builds.slice(options.offset || 0, (options.offset || 0) + options.limit);
  }
  
  return builds;
}

export async function getBuildById(id: string): Promise<Build | undefined> {
  return db.builds.find((b: Build) => b.id === id);
}

export async function createBuild(data: {
  userId: string;
  title: string;
  description: string;
  images?: string[];
  videoUrl?: string;
  websiteUrl?: string;
  codeSnippet?: string;
}): Promise<Build> {
  const build: Build = {
    id: crypto.randomUUID(),
    ...data,
    images: data.images || [],
    videoUrl: data.videoUrl || null,
    websiteUrl: data.websiteUrl || null,
    codeSnippet: data.codeSnippet || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  db.builds.push(build);
  return build;
}

// Comment operations
export async function getCommentsByBuildId(buildId: string): Promise<Comment[]> {
  return db.comments.filter((c: Comment) => c.buildId === buildId)
    .sort((a: Comment, b: Comment) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createComment(data: { buildId: string; userId: string; content: string }): Promise<Comment> {
  const comment: Comment = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date(),
  };
  db.comments.push(comment);
  return comment;
}

// Star operations
export async function getStarCount(buildId: string): Promise<number> {
  return db.stars.filter((s: Star) => s.buildId === buildId).length;
}

export async function hasUserStarred(buildId: string, userId: string): Promise<boolean> {
  return db.stars.some((s: Star) => s.buildId === buildId && s.userId === userId);
}

export async function addStar(buildId: string, userId: string): Promise<Star> {
  const star: Star = {
    id: crypto.randomUUID(),
    buildId,
    userId,
    createdAt: new Date(),
  };
  db.stars.push(star);
  return star;
}

export async function removeStar(buildId: string, userId: string): Promise<void> {
  const index = db.stars.findIndex((s: Star) => s.buildId === buildId && s.userId === userId);
  if (index > -1) {
    db.stars.splice(index, 1);
  }
}

// Report operations
export async function createReport(data: {
  buildId: string;
  userId: string;
  reason: string;
  description?: string;
}): Promise<Report> {
  const report: Report = {
    id: crypto.randomUUID(),
    ...data,
    description: data.description || null,
    status: 'pending',
    createdAt: new Date(),
  };
  db.reports.push(report);
  return report;
}

