[SIDEQUEST_README.md](https://github.com/user-attachments/files/27114763/SIDEQUEST_README.md)
# SideQuest — AI Accountability Platform

> Find your pod. Finish your mission.

**SideQuest** is a 30-day accountability platform that groups compatible people into private mission pods and keeps them on track through daily check-ins, streak tracking, an AI coach, and automated push reminders. No social feeds. No followers. Just a small group of peers going through the same life chapter — held together by structure, streaks, and a shared deadline.

🔗 **Live:** [sidequest-bm7.pages.dev](https://sidequest-bm7.pages.dev)

---

## The Concept

Most accountability tools fail because they're either too public (social pressure) or too solo (no real stakes). SideQuest sits in the middle: a private pod of 4–8 people who matched by life chapter and timezone, running a 30-day mission together. The pod disbands when the mission ends. No bloat, no social graph — just a focused container for getting things done.

---

## How It Works

**1. Onboarding**
User selects their current life chapter (e.g. fitness, career, creative, academic) and sets a personal goal statement. The timezone-aware pod matching algorithm finds the best available pod or creates a new one.

**2. Pod Matching**
The matching algorithm scores every open pod by timezone compatibility, maximising the overlap between a new user's UTC offset and the existing members'. Compatible pods (≤3 hour difference) score highest. If no suitable pod exists, a new one is created with the user as pod leader.

**3. Daily Check-Ins**
Each day, users submit a check-in with a mood score and written reflection. Missing a check-in breaks the streak. Cloudflare Workers runs a daily cron job that identifies users who haven't checked in and fires push notifications to nudge them before the day ends.

**4. Streak Reset**
A second cron job runs nightly to identify users who missed yesterday and resets their streak to zero. The reset is permanent — no grace periods.

**5. AI Coach (Groq)**
Every user gets a personalised AI coach powered by Groq's `llama-3.1-8b-instant` model, running on a Supabase Edge Function. The coach has full context: name, life chapter, current streak, pod size, average mood score from the last 7 check-ins, and recent reflection text. It generates a weekly insight on demand and handles free-form conversation — with responses capped at 2–4 sentences to stay actionable, not verbose.

**6. Graduation**
At the end of 30 days, pods graduate. Members get a completion record and the option to start a new mission.

---

## Architecture

### System Overview

```
User
  ├── React PWA (Netlify)
  │     ├── Supabase JS client (auth, data, realtime)
  │     └── Push Notification subscription → Cloudflare Worker
  │
  ├── Supabase Edge Function (Deno)
  │     └── /ai-coach → Groq API [llama-3.1-8b-instant]
  │
  └── Cloudflare Worker (Cron)
        ├── Daily: push notifications to non-checked-in users
        └── Nightly: streak reset for missed check-ins
```

### Pod Matching Algorithm

The matching system is timezone-aware, not random. For each new user:

1. Query all active pods with the same life chapter that have open slots
2. For each candidate pod, calculate a compatibility score: `(timezone-compatible members) / (total members)`
3. Two users are timezone-compatible if their UTC offsets differ by ≤3 hours
4. Assign the user to the highest-scoring pod, or create a new pod if none meets the threshold

This ensures pods are active at roughly the same time of day — critical for a platform built around daily habits.

### AI Coach — Groq via Supabase Edge Function

The AI coach runs on a Supabase Edge Function (Deno runtime) and calls Groq's inference API directly:

```typescript
// supabase/functions/ai-coach/index.ts
const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  body: JSON.stringify({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: 300,
    temperature: 0.7,
  }),
});
```

The system prompt is dynamically built from live user data — streak count, mood average, recent reflections, pod size, and goal statement. This means every response is grounded in what the user has actually done, not a generic coaching script.

Groq's `llama-3.1-8b-instant` was chosen specifically for its speed — coaching responses need to feel instant, not like waiting for a server.

### Cloudflare Worker — Push + Streak Automation

The Worker handles two scheduled jobs, both running against Supabase's REST API directly (no SDK dependency in the Worker runtime):

**Daily reminder** — Fetches all push subscribers, cross-references against today's check-ins, and fires Web Push notifications to anyone who hasn't checked in yet.

**Streak reset** — Fetches all users with `streak_count > 0`, checks who checked in yesterday, and patches `streak_count = 0` for anyone who missed it.

Web Push is implemented from scratch with a custom VAPID JWT signing flow using the Web Crypto API — no `web-push` library in the Worker:

```javascript
// Manual ECDSA JWT signing via Web Crypto
const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
const signature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, data);
```

---

## Features

**Pods**
- Timezone-aware matching algorithm (≤3h UTC offset tolerance)
- Life chapter grouping: fitness, career, creative, academic, and more
- 4–8 members per pod, 30-day fixed duration
- Pod leader role assigned on pod creation

**Check-ins**
- Daily mood score (1–5) + written reflection
- Streak counter with automatic nightly reset
- Pod Wall: shared view of all member check-ins

**AI Coach**
- Personalised weekly insight generated from real check-in data
- Free-form conversation with context-aware responses
- Powered by Groq `llama-3.1-8b-instant` via Supabase Edge Function

**Automation**
- Daily push notification cron (Cloudflare Worker)
- Nightly streak reset cron (Cloudflare Worker)
- Custom VAPID JWT signing — no third-party push library

**PWA**
- Offline-first check-ins via service worker
- Mobile installable (Web App Manifest)
- Safe area insets, 375px mobile breakpoint support

**Other**
- Invite system with unique invite links
- Progress Board with pod-level visibility
- Graduation flow at 30-day mission end
- Auth via Supabase (email + OAuth)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Motion.js |
| Routing | React Router v7 |
| Backend | Supabase Edge Functions (Deno) |
| Automation | Cloudflare Workers (cron) |
| Database | Supabase — PostgreSQL, Realtime, RLS |
| AI Coach | **Groq** — `llama-3.1-8b-instant` |
| Push Notifications | Web Push API + custom VAPID JWT (Web Crypto) |
| PWA | Service Worker + Web App Manifest |
| Deployment | Netlify (frontend) + Cloudflare Workers |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project with Edge Functions enabled
- Groq API key
- Cloudflare account (for the Worker cron jobs)

### Installation

```bash
git clone https://github.com/skpthiran/sidequest
cd sidequest
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Set the following as Supabase Edge Function secrets:

```
GROQ_API_KEY     # Powers the AI coach
```

For the Cloudflare Worker (`worker/index.js`), update the constants at the top of the file with your Supabase URL, anon key, and VAPID keys.

### Running Locally

```bash
npm run dev
```

### Deploying the AI Coach Edge Function

```bash
supabase functions deploy ai-coach
supabase secrets set GROQ_API_KEY=your_key_here
```

### Deploying the Worker

```bash
cd worker
wrangler deploy
```

To test the cron jobs manually:
```
GET /trigger  — runs both streak reset and daily reminder
GET /reset    — runs streak reset only
```

---

## Project Structure

```
sidequest/
├── src/
│   ├── pages/app/
│   │   ├── AICoach.tsx          # Groq-powered coach UI
│   │   ├── Dashboard.tsx
│   │   ├── PodWall.tsx          # Shared check-in feed
│   │   ├── ProgressBoard.tsx
│   │   └── Graduation.tsx
│   └── lib/
│       ├── podMatching.ts       # Timezone-aware matching algorithm
│       ├── pushNotifications.ts
│       └── invites.ts
├── supabase/
│   └── functions/
│       └── ai-coach/
│           └── index.ts         # Groq inference — Deno runtime
└── worker/
    └── index.js                 # Cloudflare Worker — cron + Web Push
```

---

## Why Groq

The AI coach is the most latency-sensitive feature in the app. Users open it expecting a response that feels immediate — a 4-second wait breaks the illusion of having a real coach. Groq's `llama-3.1-8b-instant` on LPU hardware delivers sub-second inference for the 300-token responses the coach generates, making the feature feel alive rather than processing.

It runs on a Supabase Edge Function (Deno), which means the entire AI layer is serverless, globally distributed, and costs nothing at idle.

---

## Built By

**Thiran Thathsara A. Wijesingha**
AI-Native Product Engineer · IIT (University of Westminster, UK)

[github.com/skpthiran](https://github.com/skpthiran) · [linkedin.com/in/skpthiran](https://linkedin.com/in/skpthiran)

---

*Built entirely independently. Original concept, architecture, and implementation — no templates, no team.*
