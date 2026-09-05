# DAILY Cloud Sync & Media Infrastructure

## Multi-device model

Each signed-in device receives a unique `deviceId` and a device-scoped access/refresh token pair. The session record stores the platform, display name, last active timestamp, IP metadata, token hash, and revocation state. WebSocket connections are isolated per device; fan-out delivers an accepted event to all authorized devices.

## Sync protocol

The sync cursor is monotonic and opaque (`evt_*`). Clients acknowledge events idempotently and reconnect with their last cursor. The backend returns missing events in cursor order, applies duplicate suppression by `eventId` and `idempotencyKey`, and resolves conflicts with server timestamps plus entity versions. Offline writes enter a durable client queue and are retried after reconnect. Read states, drafts, reactions, pins, mutes, settings, and blocked-user changes are all modeled as events.

## Media upload flow

The client requests an authorized signed upload URL from the backend. The backend validates ownership, MIME allowlists, size limits, and rate limits before issuing a short-lived URL. Object storage receives the bytes, then a processing queue performs malware scanning, MIME sniffing, image compression, thumbnail generation, and video metadata extraction. Only after processing does the backend create a `MediaAsset` and attach it to a message. Downloads use short-lived signed URLs and authorization checks; media is private by default and CDN-ready.

## Data model

`MediaAsset` contains `id`, `ownerId`, `type`, `mimeType`, `size`, `storageKey`, `checksum`, `width`, `height`, `duration`, `thumbnailKey`, `status`, and timestamps. `MessageAttachment` references `MediaAsset` rather than storing storage URLs in message text. Database indexes cover `ownerId + createdAt`, checksum, message relation, processing status, and storage key.

## Security and scaling

Access and refresh tokens are hashed and device-scoped. Upload and download authorization is evaluated on every request. Redis is used for cursor/session/event deduplication and rate limits; a queue isolates media processing from real-time messaging. WebSocket reconnects are bounded with exponential backoff. Production adapters should implement S3-compatible storage, Redis, a queue worker, signed webhooks, and observability without exposing credentials to the client.

## Current UI status

The current frontend provides a mockable Devices & Sync workspace with active sessions, logout affordances, cursor status, offline queue status, media upload progress, retry/cancel architecture, processing completion, and security notes. No production credential or secret is included.
