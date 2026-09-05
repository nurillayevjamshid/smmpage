# DAILY Audio, Video Calls & WebRTC

## Signaling flow

An authenticated device requests a short-lived call signaling session. The caller creates an SDP offer, sends it through the signaling WebSocket, and the callee returns an SDP answer. ICE candidates are exchanged through the same authenticated channel. Every event includes a `callId`, `sessionId`, monotonic sequence, and idempotency key. Reconnect resumes from the last acknowledged sequence.

## Call model

`Call` stores caller, type, status, timestamps, and policy metadata. `CallParticipant` stores authorization, role, join/leave time, and mute state. `CallEvent` records ringing, accepted, rejected, missed, ended, failed, and network-quality events. `CallSession` binds a device and expiring signaling token to a call. Status transitions are server validated: RINGING → ACCEPTED/REJECTED/MISSED, then ACCEPTED → ENDED/FAILED.

## STUN/TURN and quality

STUN/TURN endpoints are supplied through environment configuration, never hard-coded. ICE connectivity is monitored with connection state and packet-loss metrics. Adaptive bitrate lowers video resolution and frame rate on poor networks; audio remains prioritized. Reconnect uses bounded exponential backoff and network-change detection. Production deployments should use regional TURN capacity and encrypted transport.

## Group-call scaling

The current UI and model are SFU-compatible. One-to-one calls may use peer-to-peer media where appropriate; group calls should use an SFU with participant tracks, host/admin permissions, maximum-participant policy, and join/leave events. Media routing is separated from signaling so the same call metadata API can scale independently.

## Security and privacy

Signaling sessions are short-lived and device-scoped. Every participant is authorized against the conversation and block list. Call metadata is access-controlled; calls are private by default. Rate limits and spam controls apply to ringing and invite creation. Push notification, vibration, ringtone, and locked-screen handling are adapter interfaces for mobile clients.

## Current UI status

The web MVP includes audio/video call history, incoming/outgoing/active call states, accept/reject/end controls, microphone and camera toggles, quality indicator, adaptive bitrate and reconnect status, secure signaling notes, and group-call scaling documentation. Real STUN/TURN credentials are intentionally not included.
