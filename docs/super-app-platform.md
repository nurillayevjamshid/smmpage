# DAILY Super App Platform

## Mini App sandbox

Every app has an app ID, signed configuration, version, owner, HTTPS origin, status, and explicit permission manifest. Apps open in an isolated WebView/browser sandbox. The host never exposes a DAILY session token. A scoped bridge exchanges short-lived capability tokens for approved operations.

## Permission model

Permissions are opt-in and individually approved: basic profile, username, avatar, phone, contacts, chat access, payment, location, and notifications. Grants are versioned, auditable, revocable, and scoped to an app. Sensitive payment credentials never leave DAILY; the flow is Mini App → payment request → DAILY confirmation → provider → signed webhook → transaction → app callback.

## SDK and API gateway

The versioned SDK exposes `getUser`, `getProfile`, `closeApp`, `openChat`, `sendMessage`, `requestPermission`, `openPayment`, and `share`. The API gateway uses OAuth-style authorization, scoped API keys, rate limits, usage tracking, API versioning, audit logs, and signed webhooks.

## Bots and business accounts

Bots use an owner-scoped token, username, commands, buttons, callbacks, media, webhook delivery, and rate limits. Business accounts add verified profiles, working hours, customer chat, automated replies, catalog, payment integration, and analytics contracts.

## Moderation and security

App publishing requires origin validation, HTTPS, signed configuration, malware/security review, reporting, disable controls, and audit logs. CSP, XSS/CSRF protections, token isolation, permission checks, and abuse rate limits apply to every bridge and gateway request.

## Current UI status

The web MVP includes a Mini App Store, featured/business/bot/developer tabs, secure sandbox viewer, per-permission approval controls, origin verification indicator, token-isolation notice, payment permission architecture, and developer portal readiness.
