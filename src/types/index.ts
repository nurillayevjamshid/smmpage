export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: any;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  brandColor?: string;
  platforms: string[];
  createdAt: any;
  postCount?: number;
}

export interface SocialAccount {
  id: string;
  projectId: string;
  platform: 'telegram' | 'instagram';
  accountName: string;
  accountId: string;
  accessToken?: string;
  chatId?: string; // For Telegram
  fbPageId?: string; // For Instagram
  igBusinessId?: string; // For Instagram
  status: 'active' | 'error';
  createdAt: number;
}

export interface Post {
  id: string;
  projectId: string;
  caption: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: number;
  publishedAt?: number;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  platforms: ('telegram' | 'instagram')[];
  createdAt: number;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  platform: string;
  status: 'success' | 'failed' | 'scheduled' | 'info';
  createdAt: number;
}

export interface PostTarget {
  id: string;
  postId: string;
  projectId: string;
  platform: 'telegram' | 'instagram';
  accountId: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  error?: string;
  createdAt: number;
}

export interface PostMedia {
  id: string;
  postId: string;
  projectId: string;
  url: string;
  type: string;
  createdAt: number;
}
