# DAILY Web, Desktop & Universal Search

## Shared application architecture

The React and TypeScript web application is the reference UI layer. Domain state, sync events, search contracts, payment models, AI service contracts, calls, and media abstractions remain platform-neutral. A desktop shell can reuse these modules through Tauri or Electron for Windows, macOS, and Linux while adding secure local storage, system notifications, background execution, auto-update, drag-and-drop, keyboard shortcuts, and multiple windows.

## Universal search

Search is exposed through a provider abstraction. The initial provider maps to PostgreSQL full-text search and cursor pagination; an OpenSearch, Elasticsearch, or vector provider can be substituted without changing UI contracts. Search indexes are updated asynchronously from message, media, user, group, channel, and payment events. Filters include sender, chat, date range, media type, file/link, unread, hashtag, and username. Results carry a cursor and a typed entity payload.

## Real-time and offline strategy

The web and desktop clients share a device-scoped session and WebSocket event stream. Reconnect resumes from a cursor, while offline writes enter the durable queue. Notifications are device-specific and may be routed to browser, desktop, or mobile adapters. Virtualized message lists, thumbnail-first media, lazy loading, and cursor pagination protect performance for large histories.

## Security

The shell stores refresh tokens in OS-secure storage; browser sessions use secure, HttpOnly cookie patterns where applicable. CSP, output encoding, XSS protections, CSRF protections, device authorization, session expiration, rate limits, and remote logout are required backend policies. Search results are permission-filtered before returning any content.

## Current UI status

The web MVP now includes a keyboard-accessible universal search overlay (`Cmd/Ctrl+K`, Escape to close), typed results for messages, people, groups, channels, and files, filters, natural-language-ready search copy, pagination cursor status, and a reusable architecture suitable for desktop shells.
