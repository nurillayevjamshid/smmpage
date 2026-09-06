# DAILY Complete UI/UX Design System

## Identity and tokens

DAILY uses a calm violet primary, fresh green success accent, warm amber commerce accent, Manrope-style headings, and a compact readable interface. Design tokens live in `src/design-system.css`: colors, spacing, radii, shadows, motion, surfaces, text, status colors, and dark-theme values. Components should consume tokens rather than hard-coded product colors.

## Components

The reusable primitive layer defines button variants (primary, secondary, text, danger, icon), cards (default, elevated, interactive), fields, avatars, badges, chips, list tiles, dividers, loading, empty, and error states. Existing feature cards retain their domain styling while inheriting the same spacing, radius, focus, hover, and disabled behavior.

## Themes and appearance

Light and true dark themes use separate surface, text, divider, and shadow tokens rather than color inversion. The app shell supports reduced motion and high-contrast-friendly focus rings. Accent customization is represented by the token boundary so an appearance settings screen can persist a user-selected accent without changing components.

## Responsive rules

Desktop uses sidebar, chat/content, and optional detail panel. Tablet collapses the details panel and narrows content. Mobile uses a single content column, safe-area spacing, touch targets, and a fixed bottom navigation for Chats, For You, Shop, AI, and Settings. Feature workspaces have their own mobile breakpoints.

## Localization

UI text should be sourced from locale dictionaries for Uzbek, Russian, and English. The current architecture keeps language switching at the app boundary and supports device-scoped locale persistence and instant preview without an app restart.

## Accessibility and motion

Interactive controls have semantic labels where icon-only, visible focus rings, keyboard activation, minimum touch targets, readable contrast, and reduced-motion support. Loading, empty, error, confirmation, and destructive states are explicit. Motion is fast, smooth, and purposeful: feedback, navigation, modal, and reaction transitions only.

## UX principles

DAILY is inspired by fast messenger ergonomics without copying another product’s logo, exact colors, proprietary icons, or layouts. The product identity is original: a violet-green visual language, rounded editorial cards, compact premium density, and permission-first action flows.
