import { InstagramAccountInfo, InstagramTokenData } from "../types/instagram";

const FB_GRAPH_BASE_URL = 'https://graph.facebook.com/v19.0'; // Version at current time (mocking)

export const instagramService = {
  /**
   * Exchanges a short-lived FB user token for a long-lived page/user token.
   * Short-lived tokens expire in 1-2 hours; long-lived tokens in 60 days.
   */
  async exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
    // Logic: GET /oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}
    console.log("Exchanging for long-lived token:", shortLivedToken);
    return "long_lived_token_skeleton";
  },

  /**
   * Identifies the Instagram Business Account ID associated with a Facebook Page ID.
   * Instagram Graph API requires this specific ID for posting.
   */
  async getInstagramBusinessId(fbPageId: string, accessToken: string): Promise<string> {
    // Logic: GET /{facebook-page-id}?fields=instagram_business_account
    console.log("Fetching IG Business ID for Page:", fbPageId);
    return "ig_business_id_skeleton";
  },

  /**
   * Fetches the profile information for the Instagram Business Account.
   */
  async getAccountInfo(igBusinessId: string, accessToken: string): Promise<InstagramAccountInfo> {
    // Logic: GET /{instagram-business-account-id}?fields=id,name,username,profile_picture_url,followers_count,biography
    console.log("Fetching IG Account Info for:", igBusinessId);
    return {
      id: igBusinessId,
      username: "mock_username",
      name: "Mock Instagram Account",
      profilePictureUrl: "https://via.placeholder.com/150",
      followersCount: 1200,
      biography: "This is a skeleton mock account profile."
    };
  },

  /**
   * Phase 1: Uploading the media to Instagram's servers to create a container.
   * Returns a creation_id that is needed for the next step.
   */
  async createMediaContainer(igBusinessId: string, accessToken: string, mediaUrl: string, caption: string): Promise<string> {
    // Logic: POST /{instagram-business-account-id}/media?image_url={url}&caption={caption}
    // OR for video: POST /{instagram-business-account-id}/media?video_url={url}&media_type=VIDEO&caption={caption}
    console.log("Creating IG Media Container for:", mediaUrl);
    return "media_container_id_skeleton";
  },

  /**
   * Phase 2: Check the upload status of the media container.
   * Required for videos before publishing.
   */
  async getContainerStatus(containerId: string, accessToken: string): Promise<'FINISHED' | 'IN_PROGRESS' | 'ERROR'> {
    // Logic: GET /{container-id}?fields=status_code
    console.log("Checking status for container:", containerId);
    return 'FINISHED';
  },

  /**
   * Phase 3: Committing the container to the Instagram feed.
   * Once this is called, the post becomes public.
   */
  async publishMedia(igBusinessId: string, accessToken: string, containerId: string): Promise<string> {
    // Logic: POST /{instagram-business-account-id}/media_publish?creation_id={container-id}
    console.log("Publishing media container:", containerId);
    return "post_id_skeleton";
  }
};
