# DAILY Personal AI Assistant & Agents 2.0

## Assistant and memory

The assistant supports text and voice adapters, Uzbek/Russian/English detection, streaming responses, user preferences, and context-aware answers. Memory is typed as preference, important fact, recurring task, conversation context, or temporary context. Sensitive information is not persisted by default. Users can inspect, edit, delete, or clear memory; retention and explanation events are auditable.

## Agents and tools

Research, Writing, Planning, Shopping, Travel, Business, and Productivity agents use a tool-based provider abstraction. Each tool has a permission scope, validated input schema, execution boundary, validated result, rate limit, and audit event. Tools can search DAILY, summarize or translate chats, find products, prepare payment requests, create tasks/reminders, and open Mini Apps.

## Confirmation and safety

Important actions require an explicit confirmation card. The assistant never requests passwords, private keys, or payment credentials, and never sends money without confirmation. Prompt-injection defenses separate untrusted content from tool instructions. Tool outputs are validated, actions are idempotent where possible, and rollback is available for reversible operations.

## Tasks, reminders, and calendar

Reminder and Task entities support title, description, due time, timezone, recurrence, priority, tags, status, and reminder settings. Natural language is parsed into a reviewable action. Internal Calendar events support start/end, location, participants, reminders, recurrence, and an adapter boundary for external calendars.

## Privacy and usage

Context filtering minimizes data transfer. Permissions are explicit, AI activity is logged, users can see why context was used, and proactive briefings are opt-in with anti-spam limits. Free and DAILY+ usage limits are enforced server-side. Voice uses speech-to-text, streaming response, text-to-speech, interruption, and low-bandwidth adapters.

## Current UI status

The web MVP includes DAILY AI chat, voice mode, memory management, tasks, reminders, calendar, AI activity history, permission controls, confirmation flow, product/Mini App action suggestions, privacy mode, and usage-limit indicators.
