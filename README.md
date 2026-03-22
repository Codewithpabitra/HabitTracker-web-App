# 🧠 HabitMind

> *Build habits. Journal your life. Get psychologically destroyed by an AI if you skip leg day.*

HabitMind is a full-stack personal productivity and reflection platform that combines daily journaling, habit tracking with streak logic, AI-powered mood analysis, multi-agent accountability coaching, and computer-vision habit verification — all wrapped in a wildcard **Paranoia Mode** where classified information may or may not be redacted at any time.

---

## 📸 Features at a Glance

| Feature | Description |
|---|---|
| 📓 Journaling Engine | Timestamped, editable daily long-form entries |
| ✅ Habit Tracker | Create habits, check them off, track streaks |
| 📊 Progress Visualisation | Calendar + history view of entries and completions |
| 🎭 The Mood Ring | AI sentiment + theme extraction from journal entries |
| 🤖 Accountability Coach | Dual-agent system that finds your excuses and calls them out |
| 📷 Proof of Work | Upload a photo to verify habit completion — or get roasted |
| 🕵️ Paranoia Mode | Random words get [REDACTED]. Hover to reveal. |

---

## 🗂️ Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Core Features](#core-features)
  - [Journaling Engine](#-journaling-engine)
  - [Habit Management & Streaks](#-habit-management--streaks)
  - [Progress Visualisation](#-progress-visualisation)
- [Feature Shock #1 — The Mood Ring](#-feature-shock-1--the-mood-ring-ai-text-analysis)
- [Feature Shock #2 — The Ruthless Accountability Coach](#-feature-shock-2--the-ruthless-accountability-coach-multi-agent)
- [Feature Shock #3 — Proof of Work](#-feature-shock-3--proof-of-work-multimodal-vision)
- [Wildcard — Paranoia Mode](#-wildcard--paranoia-mode)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + TypeScript
- Tailwind CSS
- Recharts (mood trend visualisations)
- React Calendar

**Backend**
- Node.js + Express (or Next.js API routes)
- PostgreSQL (primary database)
- Prisma ORM

**AI / ML**
- Anthropic Claude API (`claude-sonnet-4-20250514`)
  - Text analysis (Mood Ring)
  - Multi-agent pipeline (Accountability Coach)
  - Vision verification (Proof of Work)
  - Paranoia redaction (Wildcard)

**Infrastructure**
- AWS S3 / Cloudflare R2 (image uploads)
- Cron jobs via `node-cron` (Auditor agent background scans)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- An [Anthropic API key](https://console.anthropic.com/)
- An S3-compatible storage bucket (for photo uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/habitmind.git
cd habitmind

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Core Features

### 📓 Journaling Engine

A distraction-free editor for daily long-form entries.

- Entries are automatically timestamped on creation
- Fully editable at any time after creation
- Rich text support (bold, italic, lists)
- Past entries accessible via the Calendar view
- Each save triggers the **Mood Ring** analysis pipeline in the background

### ✅ Habit Management & Streaks

Create and manage habits from your personal dashboard.

- Add habits with a name and optional description (e.g., "Read 20 pages", "Meditation")
- Daily checklist view to mark habits as complete
- **Streak Logic**: backend service calculates:
  - `currentStreak` — consecutive days a habit has been completed up to today
  - `longestStreak` — the all-time record streak for that habit
- Habits can be marked as **Proof Required** (see Feature Shock #3)

**Streak Calculation Rules:**
- Completing a habit on day D increments the streak if day D-1 was also completed
- Missing a day resets `currentStreak` to 0
- `longestStreak` is only ever updated upward

### 📊 Progress Visualisation

- **Calendar View**: Each date is colour-coded — green if all habits were completed, yellow for partial, red for none
- Click any date to view the journal entry and habit completion status for that day
- **History Feed**: A reverse-chronological list of past journal entries with mood tags attached

---

## 🎭 Feature Shock #1 — The Mood Ring (AI Text Analysis)

> *Your users are journaling every day, but they aren't reading their past entries. Their data is rotting.*

### How It Works

Every time a journal entry is saved, it is passed asynchronously to the Claude API for analysis. The model extracts:

- **Sentiment** — a primary emotional tone (e.g., `Positive`, `Anxious`, `Reflective`, `Lethargic`, `Hopeful`)
- **Key Themes** — 2–5 thematic tags (e.g., `Work Stress`, `Good Sleep`, `Family`, `Exercise`, `Creativity`)

These are stored back to the database and associated with that entry.

### The Emotional Dashboard

Navigate to `/mood` to see an aggregated view of the past 7–14 days:

- **Sentiment Timeline** — a line/bar chart showing mood over time
- **Theme Frequency Cloud** — most common themes in the period
- **Weekly Summary Paragraph** — a generated narrative paragraph summarising your emotional arc for the week (e.g., *"This week you showed a strong recovery trajectory. Anxiety dominated Monday and Tuesday, likely tied to the 'Work Deadlines' theme that appeared 4 times, but by Thursday your tone shifted markedly positive."*)

### Technical Implementation

```js
// Triggered on journal entry save
async function analyseJournalEntry(entryId, text) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    system: `You are a mood analysis engine. Return ONLY valid JSON.
      Extract: { sentiment: string, themes: string[] }`,
    messages: [{ role: "user", content: text }]
  });

  const { sentiment, themes } = JSON.parse(response.content[0].text);
  await db.journalEntry.update({ where: { id: entryId }, data: { sentiment, themes } });
}
```

---

## 🤖 Feature Shock #2 — The Ruthless Accountability Coach (Multi-Agent)

> *Push notifications don't work anymore. Users ignore them. We need psychological warfare.*

HabitMind runs a two-agent pipeline to generate personalised, contextually devastating motivational messages.

### Agent A — The Auditor

Runs on a scheduled cron job every 6 hours.

**Job:** Scan all habit completion records. If a user has missed a habit for **2 or more consecutive days**, fire a payload to Agent B containing:
- The habit name
- Number of days missed
- The user's last 5 journal entries (raw text)

```js
// cron: every 6 hours
cron.schedule('0 */6 * * *', async () => {
  const brokenStreaks = await db.habit.findMany({
    where: { daysMissed: { gte: 2 } },
    include: { user: { include: { journalEntries: { take: 5, orderBy: { date: 'desc' } } } } }
  });

  for (const habit of brokenStreaks) {
    await invokeEnforcer(habit);
  }
});
```

### Agent B — The Enforcer

Receives the Auditor's payload. Queries the user's recent journal entries for mentions of or motivations related to the broken habit. Then generates a **highly personalised, slightly unhinged** message.

**Example output:**
> *"You missed 'Morning Run' for the third day in a row. Interesting. Because two days ago you wrote — and I'm quoting directly here — 'I really want to finish that half-marathon before summer.' Bold of you. Very bold. The race is in 11 weeks. The couch you're on right now does not have a finish line."*

Messages are delivered as an **in-app modal** that appears on next login, and can optionally be configured to render as a simulated email UI.

### Delivery Modes

| Mode | Behaviour |
|---|---|
| `modal` | Full-screen takeover on next app load |
| `toast` | Persistent toast notification at bottom of screen |
| `inbox` | Simulated email inbox UI at `/coach/inbox` |

---

## 📷 Feature Shock #3 — Proof of Work (Multimodal Vision)

> *Users are liars. They are checking the "Ate a healthy breakfast" box while eating a donut.*

### How It Works

Habits flagged as **Proof Required** replace the standard checkbox with a photo upload prompt.

1. The user uploads a photo from their device or camera
2. The image is sent to Claude's vision endpoint alongside the habit name and description
3. Claude evaluates whether the image constitutes valid proof
4. **If verified**: the habit is marked complete, streak increments, image saved to storage
5. **If rejected**: the habit is NOT marked complete, and the AI returns a sarcastic rejection message

### Example Interactions

**Habit:** "Eat a healthy meal"
- ✅ Upload: *photo of a salad bowl* → **Verified. Streak continues.**
- ❌ Upload: *photo of a pizza box* → *"Bold choice submitting this as evidence for 'Eat a healthy meal.' I've seen more vegetables in a bag of Doritos. Rejected."*

**Habit:** "Read 20 pages"
- ✅ Upload: *photo of open book with visible pages* → **Verified.**
- ❌ Upload: *photo of Netflix on TV* → *"An open browser is not a book. Audiobooks are also not a book. This is not a book. Rejected."*

### Technical Implementation

```js
async function verifyHabitProof(habitName, habitDescription, imageBase64) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 200,
    messages: [{
      role: "user",
      content: [
        {
          type: "image",
          source: { type: "base64", media_type: "image/jpeg", data: imageBase64 }
        },
        {
          type: "text",
          text: `Habit: "${habitName}". Description: "${habitDescription}".
          Does this image prove the habit was completed?
          Respond ONLY with JSON: { "verified": boolean, "message": string }
          If not verified, make the message sarcastic and specific to what you see.`
        }
      ]
    }]
  });

  return JSON.parse(response.content[0].text);
}
```

---

## 🕵️ Wildcard — Paranoia Mode

> *The AI has decided some information is classified. It will not explain why.*

Enable **Paranoia Mode** from Settings. When active, an AI agent periodically scans the rendered page text and selects non-essential words or phrases to redact — wrapping them in a `[REDACTED]` black bar.

- Hover over any redacted word to reveal the original text via tooltip
- The selection of what gets redacted is intentionally arbitrary and slightly absurd (proper nouns, adjectives, the occasional article)
- Paranoia level is adjustable: `Low` / `Medium` / `MAXIMUM CLEARANCE`
- A small 🔒 badge in the top-right corner indicates Paranoia Mode is active

```js
// Sample redacted output (rendered)
"Today was a [REDACTED] day. I went to the [REDACTED] and had [REDACTED] for lunch.
Feeling [REDACTED] about the week ahead."
```

*Why? We don't know. The agent doesn't explain itself.*

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/habits` | List all habits for authenticated user |
| `POST` | `/api/habits` | Create a new habit |
| `PATCH` | `/api/habits/:id/complete` | Mark habit complete (or initiate proof upload) |
| `GET` | `/api/journal` | List journal entries |
| `POST` | `/api/journal` | Create journal entry (triggers mood analysis) |
| `PUT` | `/api/journal/:id` | Edit journal entry |
| `GET` | `/api/mood/dashboard` | Aggregated mood data for past N days |
| `GET` | `/api/coach/messages` | Retrieve accountability coach messages |
| `POST` | `/api/proof/verify` | Submit image for vision verification |
| `GET` | `/api/streaks/:habitId` | Get streak data for a habit |

---

## 🗄️ Database Schema

```prisma
model User {
  id             String         @id @default(cuid())
  email          String         @unique
  habits         Habit[]
  journalEntries JournalEntry[]
  coachMessages  CoachMessage[]
}

model Habit {
  id            String       @id @default(cuid())
  userId        String
  name          String
  description   String?
  proofRequired Boolean      @default(false)
  currentStreak Int          @default(0)
  longestStreak Int          @default(0)
  completions   Completion[]
  user          User         @relation(fields: [userId], references: [id])
}

model Completion {
  id        String   @id @default(cuid())
  habitId   String
  date      DateTime
  proofUrl  String?
  habit     Habit    @relation(fields: [habitId], references: [id])
}

model JournalEntry {
  id        String   @id @default(cuid())
  userId    String
  content   String
  date      DateTime @default(now())
  updatedAt DateTime @updatedAt
  sentiment String?
  themes    String[]
  user      User     @relation(fields: [userId], references: [id])
}

model CoachMessage {
  id        String   @id @default(cuid())
  userId    String
  habitName String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/habitmind"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."

# Storage (S3-compatible)
STORAGE_BUCKET="habitmind-proofs"
STORAGE_REGION="us-east-1"
STORAGE_ACCESS_KEY="..."
STORAGE_SECRET_KEY="..."
STORAGE_ENDPOINT="https://s3.amazonaws.com"  # or Cloudflare R2 URL

# App
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
CRON_SECRET="your-cron-secret"  # for securing the auditor endpoint
```

---

## 🤝 Contributing

Contributions are welcome. Please open an issue before submitting a pull request for anything beyond minor bug fixes.

```bash
# Run tests
npm test

# Lint
npm run lint

# Type check
npm run type-check
```

**Branching convention:**
- `main` — stable
- `dev` — integration branch
- `feature/your-feature-name` — feature branches

---

## 📄 License

MIT © HabitMind Contributors

---

<p align="center">
  Built with obsessive attention to streaks, occasional existential dread, and the Claude API.<br/>
  <em>Your journal entries are private. The AI reads them anyway (to help you, of course).</em>
</p>
