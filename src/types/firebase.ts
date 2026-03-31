import { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  brandColor: string;
  platforms: string[];
  postCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SocialAccount {
  id: string;
  projectId: string;
  userId: string;
  platform: 'instagram' | 'telegram';
  accountName: string;
  accessToken: string;
  status: 'active' | 'expired';
  createdAt: Timestamp;
}

export interface MediaFile {
  id: string;
  projectId: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  fileSize: number;
  createdAt: Timestamp;
}

export interface Post {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt: Timestamp | null;
  publishedAt: Timestamp | null;
  platforms: string[];
  mediaIds: string[];
  createdAt: Timestamp;
}

export interface ActivityLog {
  id: string;
  userId: string;
  projectId: string;
  action: string;
  platform: string;
  status: 'success' | 'scheduled' | 'failed';
  timestamp: Timestamp;
}
