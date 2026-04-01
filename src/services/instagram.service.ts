import { InstagramAccountInfo } from "../types/instagram";

const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/v19.0';

export const instagramService = {
  /**
   * Exchanges a short-lived FB user token for a long-lived user token.
   * Short-lived tokens expire in 1-2 hours; long-lived tokens in 60 days.
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
    const appId = import.meta.env.VITE_FB_APP_ID;
    const appSecret = import.meta.env.VITE_FB_APP_SECRET;

    if (!appId || !appSecret) {
      console.warn("FB App ID or Secret not configured. Skipping token exchange.");
      return shortLivedToken;
    }

    try {
      const response = await fetch(
        `${FB_GRAPH_BASE_URL}/oauth/access_token?` + 
        new URLSearchParams({
          grant_type: 'fb_exchange_token',
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: shortLivedToken
        })
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Failed to exchange token');
      
      return data.access_token;
    } catch (error: any) {
      console.error("Error exchanging token:", error);
      throw error;
    }
  },

  /**
   * Identifies the Instagram Business Account ID associated with a Facebook Page ID.
   */
  async getInstagramBusinessId(fbPageId: string, accessToken: string): Promise<string> {
    try {
      const response = await fetch(
        `${FB_GRAPH_BASE_URL}/${fbPageId}?fields=instagram_business_account&access_token=${accessToken}`
      );
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch IG Business Account');
      if (!data.instagram_business_account) {
        throw new Error("No Instagram Business Account linked to this Facebook Page. Ensure you have a Business/Creator account and it's linked.");
      }

      return data.instagram_business_account.id;
    } catch (error: any) {
      console.error("Error fetching IG Business ID:", error);
      throw error;
    }
  },

  /**
   * Fetches the profile information for the Instagram Business Account.
   */
  async getAccountInfo(igBusinessId: string, accessToken: string): Promise<InstagramAccountInfo> {
    try {
      const response = await fetch(
        `${FB_GRAPH_BASE_URL}/${igBusinessId}?fields=id,name,username,profile_picture_url,followers_count,biography&access_token=${accessToken}`
      );
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch Instagram account info');

      return {
        id: data.id,
        username: data.username,
        name: data.name,
        profilePictureUrl: data.profile_picture_url,
        followersCount: data.followers_count,
        biography: data.biography
      };
    } catch (error: any) {
      console.error("Error in getAccountInfo:", error);
      throw error;
    }
  },

  /**
   * Phase 1: Uploading the media to Instagram's servers to create a container.
   */
  async createMediaContainer(igBusinessId: string, accessToken: string, mediaUrl: string, caption: string, mediaType: 'image' | 'video' = 'image'): Promise<string> {
    try {
      const params: any = {
        access_token: accessToken,
        caption: caption
      };

      if (mediaType === 'video') {
        params.video_url = mediaUrl;
        params.media_type = 'VIDEO';
      } else {
        params.image_url = mediaUrl;
      }

      const response = await fetch(
        `${FB_GRAPH_BASE_URL}/${igBusinessId}/media?` + new URLSearchParams(params),
        { method: 'POST' }
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Instagram Media Container Error:", data);
        throw new Error(data.error?.message || 'Failed to create media container');
      }

      return data.id;
    } catch (error: any) {
      console.error("Error creating media container:", error);
      throw error;
    }
  },

  /**
   * Phase 2: Check the upload status of the media container.
   */
  async getContainerStatus(containerId: string, accessToken: string): Promise<'FINISHED' | 'IN_PROGRESS' | 'ERROR'> {
    try {
      const response = await fetch(
        `${FB_GRAPH_BASE_URL}/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const data = await response.json();
      
      if (!response.ok) return 'ERROR';

      const status = data.status_code;
      if (status === 'FINISHED') return 'FINISHED';
      if (status === 'PUBLISHED') return 'FINISHED';
      if (status === 'IN_PROGRESS') return 'IN_PROGRESS';
      return 'ERROR';
    } catch (error) {
      console.error("Error checking container status:", error);
      return 'ERROR';
    }
  },

  /**
   * Wait for container to be ready (especially for videos)
   */
  async waitForContainer(containerId: string, accessToken: string, maxAttempts = 10): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
        const status = await this.getContainerStatus(containerId, accessToken);
        if (status === 'FINISHED') return true;
        if (status === 'ERROR') return false;
        // Wait 3 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    return false;
  },

  /**
   * Phase 3: Committing the container to the Instagram feed.
   */
  async publishMedia(igBusinessId: string, accessToken: string, containerId: string): Promise<string> {
    try {
      const response = await fetch(
        `${FB_GRAPH_BASE_URL}/${igBusinessId}/media_publish?creation_id=${containerId}&access_token=${accessToken}`,
        { method: 'POST' }
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("Instagram Publish Error:", data);
        throw new Error(data.error?.message || 'Failed to publish media');
      }

      return data.id;
    } catch (error: any) {
      console.error("Error publishing media:", error);
      throw error;
    }
  }
};

