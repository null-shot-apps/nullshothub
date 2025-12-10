// In-memory database for demo purposes
// In production, this would be replaced with a real database (PostgreSQL, MongoDB, etc.)

import { User, Build, Comment, Star, Report } from '@/types';

// Storage
const users: Map<string, User & { password: string }> = new Map();
const builds: Map<string, Build> = new Map();
const comments: Map<string, Comment> = new Map();
const stars: Map<string, Star> = new Map();
const reports: Map<string, Report> = new Map();

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 15);

// User operations
export const createUser = async (data: Omit<User, 'id' | 'createdAt'> & { password: string }) => {
  const id = generateId();
  const user = {
    ...data,
    id,
    createdAt: new Date(),
  };
  users.set(id, user);
  return user;
};

export const getUserByEmail = async (email: string) => {
  return Array.from(users.values()).find(u => u.email === email);
};

export const getUserByUsername = async (username: string) => {
  return Array.from(users.values()).find(u => u.username === username);
};

export const getUserById = async (id: string) => {
  const user = users.get(id);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Build operations
export const createBuild = async (data: Omit<Build, 'id' | 'stars' | 'views' | 'createdAt' | 'updatedAt'>) => {
  const id = generateId();
  const build: Build = {
    ...data,
    id,
    stars: 0,
    views: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  builds.set(id, build);
  return build;
};

export const getBuildById = async (id: string) => {
  const build = builds.get(id);
  if (!build) return null;
  
  // Increment views
  build.views++;
  builds.set(id, build);
  
  // Attach user data
  const user = await getUserById(build.userId);
  return { ...build, user: user || undefined };
};

export const getAllBuilds = async (options?: { limit?: number; offset?: number; userId?: string }) => {
  let buildList = Array.from(builds.values());
  
  if (options?.userId) {
    buildList = buildList.filter(b => b.userId === options.userId);
  }
  
  // Sort by createdAt descending
  buildList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  if (options?.offset) {
    buildList = buildList.slice(options.offset);
  }
  
  if (options?.limit) {
    buildList = buildList.slice(0, options.limit);
  }
  
  // Attach user data
  const buildsWithUsers = await Promise.all(
    buildList.map(async (build) => {
      const user = await getUserById(build.userId);
      return { ...build, user: user || undefined };
    })
  );
  
  return buildsWithUsers;
};

export const updateBuild = async (id: string, data: Partial<Build>) => {
  const build = builds.get(id);
  if (!build) return null;
  
  const updated = {
    ...build,
    ...data,
    updatedAt: new Date(),
  };
  builds.set(id, updated);
  return updated;
};

export const deleteBuild = async (id: string) => {
  return builds.delete(id);
};

// Comment operations
export const createComment = async (data: Omit<Comment, 'id' | 'createdAt'>) => {
  const id = generateId();
  const comment: Comment = {
    ...data,
    id,
    createdAt: new Date(),
  };
  comments.set(id, comment);
  return comment;
};

export const getCommentsByBuildId = async (buildId: string) => {
  const commentList = Array.from(comments.values())
    .filter(c => c.buildId === buildId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // Attach user data
  const commentsWithUsers = await Promise.all(
    commentList.map(async (comment) => {
      const user = await getUserById(comment.userId);
      return { ...comment, user: user || undefined };
    })
  );
  
  return commentsWithUsers;
};

export const deleteComment = async (id: string) => {
  return comments.delete(id);
};

// Star operations
export const createStar = async (buildId: string, userId: string) => {
  const id = generateId();
  const star: Star = {
    id,
    buildId,
    userId,
    createdAt: new Date(),
  };
  stars.set(id, star);
  
  // Update build star count
  const build = builds.get(buildId);
  if (build) {
    build.stars++;
    builds.set(buildId, build);
  }
  
  return star;
};

export const deleteStar = async (buildId: string, userId: string) => {
  const star = Array.from(stars.values()).find(
    s => s.buildId === buildId && s.userId === userId
  );
  
  if (star) {
    stars.delete(star.id);
    
    // Update build star count
    const build = builds.get(buildId);
    if (build && build.stars > 0) {
      build.stars--;
      builds.set(buildId, build);
    }
    
    return true;
  }
  
  return false;
};

export const hasUserStarred = async (buildId: string, userId: string) => {
  return Array.from(stars.values()).some(
    s => s.buildId === buildId && s.userId === userId
  );
};

// Report operations
export const createReport = async (data: Omit<Report, 'id' | 'status' | 'createdAt'>) => {
  const id = generateId();
  const report: Report = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date(),
  };
  reports.set(id, report);
  return report;
};

export const getAllReports = async () => {
  return Array.from(reports.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const updateReportStatus = async (id: string, status: Report['status']) => {
  const report = reports.get(id);
  if (!report) return null;
  
  report.status = status;
  reports.set(id, report);
  return report;
};

