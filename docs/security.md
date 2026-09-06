# DAILY Security, Privacy & E2EE 2.0

## Threat model

DAILY protects account credentials, device sessions, private messages, media, calls, payments, marketplace actions, and Mini App capabilities. The server must not receive private-message plaintext in E2EE mode. Threats include token theft, malicious devices, replay, spam, phishing, payment abuse, unauthorized admin access, and compromised third-party app origins.

## Encryption architecture

Private 1-to-1 chats should use a professionally reviewed protocol and implementation such as the Signal Protocol through an audited library; DAILY must not invent cryptography. Each device has an identity key and signed pre-key, sessions rotate, forward secrecy is preserved, and key changes trigger a security warning. Safety numbers are derived and displayed for verification. Encrypted media is client-encrypted before upload, stored privately, and accessed through expiring authorized URLs.

## Authentication and account recovery

OTP login can be strengthened with password-based 2FA, recovery codes, new-device verification, refresh-token rotation, token revocation, secure sessions, login history, remote logout, and suspicious recovery protection. Browser tokens should use secure HttpOnly cookie patterns where applicable; mobile uses Keychain/Keystore. Secrets belong in a managed secret store.

## Privacy and abuse prevention

Privacy controls cover phone visibility, last seen, online status, profile photos, messaging, groups, calls, stories, read receipts, forwarding, blocked users, sessions, 2FA, and Secret Chat. Rate limits, new-account restrictions, link-spam detection, bot abuse controls, reputation, cooldowns, block/report/restrict flows, and appeals reduce abuse while limiting false positives.

## Payments, admin, and monitoring

Payment and marketplace risk scoring uses velocity, device, behavior, and anomaly signals with a manual-review queue and appeal flow. Admin access uses RBAC, admin 2FA, separated moderator permissions, sensitive-action confirmation, device/IP controls, and audit logs. Security events include failed login, new device, password/2FA changes, suspicious activity, mass messaging, and payment anomalies.

## Security checklist

Use TLS everywhere, strong password hashing, encrypted-at-rest PII, least privilege, strict input validation, SQL parameterization, CSP/security headers, CSRF protection where applicable, restrictive CORS, request-size limits, authenticated WebSockets, API versioning, secure backups, retention policies, dependency scanning, E2EE key/session tests, authentication/authorization tests, upload abuse tests, and recovery attack tests.

## Current UI status

The web MVP includes Privacy & Security Center, E2EE session verification, safety number architecture, new-device warning, Secret Chat controls, disappearing-message architecture, 2FA and active-session management, privacy visibility controls, block/report/restrict readiness, spam protection, fraud monitoring, and secure recovery documentation.
