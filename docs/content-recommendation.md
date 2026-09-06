# DAILY Content Feed & Recommendation Engine

## Content model

Posts reference ContentMedia and may be text, photo, video, link, poll, or carousel. Creator, Topic, Hashtag, Comment, Reaction, View, Bookmark, and Report are separate entities. News articles require title, summary, full content, cover, source attribution, author, category, publish and update timestamps.

## Feed and ranking

The first ranking provider is rule-based and combines freshness, follows, topic interest, watch time, completion rate, likes, comments, shares, saves, search history, and creator affinity. Negative feedback includes skip, hide, not interested, and report. The provider interface is designed for a later ML/AI ranker. Feed results use opaque cursors, prefetch the next content, and process views asynchronously so scrolling is not blocked.

## Video delivery

Short video uses CDN-hosted adaptive bitrate renditions, thumbnail-first loading, lazy media, and a queue for transcoding and analytics. Playback events are batched and deduplicated. The UI exposes like, comment, share, save, creator follow, and view signals.

## Moderation and trust

Content reports, spam/NSFW/copyright checks, removal, creator restrictions, suspension, and moderator audit logs are backend contracts. Source attribution is mandatory for news. Notification preferences cover new posts, follows, comments, mentions, reactions, creator updates, and breaking-news adapters.

## Current UI status

The web MVP includes For You, Following, News, Shorts, Trending, and Saved navigation, personalized feed cards, creator profiles, news attribution, vertical short-video playback architecture, engagement actions, view counters, and recommendation transparency copy.
