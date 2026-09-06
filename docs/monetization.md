# DAILY Premium, Creator Economy & Monetization

## Subscriptions

Plans are Free, DAILY+, DAILY Pro, Creator Pro, and Business Pro. A subscription stores user, plan, status, price, currency, billing period, dates, auto-renewal, provider, and transaction ID. Payment providers are adapters behind the existing DAILY Payment Layer. Feature limits are enforced server-side, never by frontend state.

## Coins and ledger

DAILY Coins use Wallet, CoinTransaction, Purchase, Transfer, and Withdrawal abstractions. Purchases, gifts, creator tips, paid content, premium reactions, and Mini App payments are immutable ledger events. Every event has a unique ID, type, amount, currency, source, destination, status, timestamp, and idempotency key. Client balances are display-only.

## Creator and channel revenue

Creators and channel owners can monetize subscriptions, paid posts/videos, tips, gifts, memberships, and premium content. Earnings move through pending and available balances. Payout requests use a provider adapter with minimum payout, processing, completed, failed, refund, and chargeback states.

## Ads and developer monetization

Ads use Business Account, Campaign, Ad, Creative, Budget, Bid, Targeting, Impression, Click, and Conversion contracts. Eligible users are selected without sensitive-attribute targeting; auction, ranking, billing, invalid-click detection, bot traffic, and duplicate-event protection are separate services. Mini App developers can use paid apps, in-app purchases, subscriptions, and revenue share through the same ledger.

## Fraud and accounting

Signed webhooks, server confirmation, idempotency, rate limits, permission checks, audit logs, refund protection, payout security, referral qualification, and fraud review are mandatory. Admin controls cover subscriptions, coins, payouts, ads moderation, refunds, commissions, and revenue analytics.

## Current UI status

The web MVP includes Premium plans, subscription renewal status, Coins wallet and ledger activity, Creator earnings and payout readiness, Ads Manager campaign metrics, Business monetization architecture, and Invite & Earn with referral qualification safeguards.
