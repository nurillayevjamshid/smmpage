# Instagram Integration Architecture

This document outlines the structure and requirements for the Instagram Business API integration.

## 1. Meta Application Structure

To support Instagram publishing via the Graph API, the Meta App must be configured as follows:

### App Configuration
- **App Type**: `Business` or `Consumer` (Business is recommended for long-term health).
- **Products**: 
  - `Facebook Login / Login for Business`
  - `Instagram Graph API`

### Required Permissions (Scope)
The following permissions must be requested during the Facebook Login flow:
1. `instagram_basic`: To read account information (username, profile pic).
2. `instagram_content_publish`: **Critical**. To create media containers and publish posts.
3. `pages_show_list`: To list Facebook Pages the user manages.
4. `pages_read_engagement`: Often required alongside `instagram_basic`.
5. `public_profile`: Basic user info.

---

## 2. Token Management

We implement a Two-Phase token system:
1. **Short-Lived User Access Token**: Obtained directly from the FB SDK on the client (valid for 1-2 hours).
2. **Long-Lived User Access Token**: Exchanged via the backend/service using `client_id` and `client_secret` (valid for 60 days).

### Metadata Storage
Tokens and associated IDs are stored in Firestore under `socialAccounts`:
- `accessToken`: The Long-Lived token.
- `fbPageId`: The ID of the FB Page linked to the Instagram Business account.
- `igBusinessId`: The target ID for all `/{ig-business-id}/media` calls.
- `expiresAt`: Timestamp for proactive re-auth notifications.

---

## 3. Publishing Workflow (3-Step Skeleton)

The Instagram Graph API does not allow direct "Post this image" calls. It requires a container process:

1. **Step 1: Create Media Container**
   `POST /{ig-business-id}/media?image_url={url}&caption={caption}`
   Returns a `creation_id`.

2. **Step 2: Status Check (Mandatory for Videos)**
   `GET /{creation_id}?fields=status_code`
   Wait until `status_code === 'FINISHED'`.

3. **Step 3: Publish Container**
   `POST /{ig-business-id}/media_publish?creation_id={creation_id}`
   Makes the post go live on the user's feed.

---

## 4. Error Handling States

Common states handled in the UI and Service:
- `AUTH_EXPIRED`: Token is no longer valid (requires re-login).
- `PERMISSION_MISSING`: User didn't check the required Page/Instagram account in the FB popup.
- `API_LIMIT_REACHED`: Meta's rate limits (posts per 24h per account).
- `MEDIA_UPLOAD_FAILED`: Meta couldn't fetch the image from our Firebase Storage (check URL accessibility).
- `REAUTH_REQUIRED`: Password change or security event invalidated the token.
