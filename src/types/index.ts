export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: number;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  brandColor?: string;
  platforms: string[];
  createdAt: number;
}

export interface SocialAccount {
  id: string;
  projectId: string;
  platform: 'telegram' | 'instagram';
  accountName: string;
  accountId: string;
  accessToken?: string;
  chatId?: string;
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
