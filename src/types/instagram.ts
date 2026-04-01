export interface InstagramTokenData {
  accessToken: string;
  tokenType: 'short-lived' | 'long-lived';
  expiresAt: number; // timestamp
  fbPageId: string;
  igBusinessId: string;
}

export interface InstagramAccountInfo {
  id: string;
  username: string;
  name: string;
  profilePictureUrl: string;
  followersCount?: number;
  biography?: string;
}

export type InstagramErrorState = 
  | 'AUTH_EXPIRED'
  | 'AUTH_CANCELLED'
  | 'PERMISSION_MISSING'
  | 'API_LIMIT_REACHED'
  | 'MEDIA_UPLOAD_FAILED'
  | 'UNKNOWN_ERROR';

export interface InstagramIntegrationState {
  isConnected: boolean;
  account?: InstagramAccountInfo;
  error?: {
    code: InstagramErrorState;
    message: string;
  };
  isLoading: boolean;
}
