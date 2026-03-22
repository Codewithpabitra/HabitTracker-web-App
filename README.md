<div align="center">

<h1>🧠 HabitMind</h1>

<p><em>Track habits. Journal your life. Let AI hold you accountable.</em></p>

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini API](https://img.shields.io/badge/Powered%20by-Gemini%20API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<br />

> HabitMind is a full-stack personal productivity platform combining daily journaling, streak-based habit tracking, AI-powered mood analysis, a multi-agent accountability coach, and computer-vision habit verification — all in one cohesive experience.

<br />

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Core Features](#-core-features)
  - [Journaling Engine](#-journaling-engine)
  - [Habit Management & Streaks](#-habit-management--streaks)
  - [Progress Visualisation](#-progress-visualisation)
- [AI Features](#-ai-features)
  - [The Mood Ring](#-the-mood-ring)
  - [Accountability Coach](#-accountability-coach)
  - [Proof of Work](#-proof-of-work)
  - [Paranoia Mode](#️-paranoia-mode)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📓 **Journaling Engine** | Timestamped, editable daily long-form entries with rich text support |
| ✅ **Habit Tracker** | Create habits, mark completions, and track streaks with full history |
| 📊 **Progress Visualisation** | Calendar and history views colour-coded by completion status |
| 🎭 **The Mood Ring** | AI sentiment and theme extraction from every journal entry |
| 🤖 **Accountability Coach** | Dual-agent system that reads your journals and calls out your excuses |
| 📷 **Proof of Work** | Upload a photo to verify habit completion — or get roasted by AI |
| 🕵️ **Paranoia Mode** | Random words get `[REDACTED]`. Hover to reveal. The AI won't explain why. |

---

## 🛠️ Tech Stack

**Frontend**
- React 18 · Tailwind CSS · Recharts · React Calendar

**Backend**
- Node.js · Express · MongoDB · Mongoose

**AI / ML**
- Google Gemini API (`gemini-1.5-pro`) for mood analysis and multi-agent coaching
- Google Gemini Multimodal (`gemini-1.5-pro-vision`) for image-based habit verification and Paranoia redaction

**Infrastructure**
- AWS S3 / Cloudflare R2 for image uploads
- `node-cron` for scheduled Auditor agent background scans

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Google Gemini API key](https://ai.google.dev/)
- S3-compatible storage bucket (for photo uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/habitmind.git
cd habitmind

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Fill in your credentials (see Environment Variables below)

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🔑 Core Features

### 📓 Journaling Engine

A distraction-free editor for daily long-form entries.

- Entries are automatically timestamped on creation and fully editable afterwards
- Rich text support — bold, italic, lists
- Past entries accessible via the Calendar view
- Each save asynchronously triggers the **Mood Ring** analysis pipeline

### ✅ Habit Management & Streaks

Create and manage personal habits from your dashboard.

- Add habits with a name and optional description (e.g. "Read 20 pages", "Morning meditation")
- Daily checklist view to mark habits complete
- Streak logic calculates `currentStreak` and `longestStreak` per habit

**Streak Rules:**
- Completing habit on day D increments the streak only if day D−1 was also completed
- Missing a day resets `currentStreak` to 0
- `longestStreak` is only ever updated upward

### 📊 Progress Visualisation

- **Calendar View** — each date is colour-coded: green (all complete), yellow (partial), red (none)
- Click any date to view that day's journal entry and habit status
- **History Feed** — reverse-chronological list of past entries with mood tags

---

## 🤖 AI Features

### 🎭 The Mood Ring

Every time a journal entry is saved, it is passed asynchronously to the Gemini API. The model returns:

- **Sentiment** — a primary emotional tone (`Positive`, `Anxious`, `Reflective`, `Lethargic`, `Hopeful`, etc.)
- **Key Themes** — 2–5 thematic tags (`Work Stress`, `Good Sleep`, `Family`, `Exercise`, etc.)

These are stored back to the entry and surfaced in the **Emotional Dashboard** at `/mood`:

- **Sentiment Timeline** — line/bar chart showing mood over the past 7–14 days
- **Theme Frequency Cloud** — most common themes in the period
- **Weekly Summary** — a generated narrative paragraph describing your emotional arc for the week

```js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyseJournalEntry(entryId, text) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent(
    `You are a mood analysis engine. Return ONLY valid JSON.
     Analyse the following journal entry and extract:
     { "sentiment": string, "themes": string[] }

     Journal entry: ${text}`
  );

  const { sentiment, themes } = JSON.parse(result.response.text());
  await JournalEntry.findByIdAndUpdate(entryId, { sentiment, themes });
}
```

---

### 🤖 Accountability Coach

A two-agent pipeline that generates personalised, contextually targeted motivational messages.

#### Agent A — The Auditor

Runs on a cron job every 6 hours. Scans all habit completion records and fires a payload to Agent B for any habit missed for **2 or more consecutive days**, including:
- Habit name and days missed
- User's last 5 journal entries (raw text)

```js
cron.schedule('0 */6 * * *', async () => {
  const brokenStreaks = await Habit.find({ daysMissed: { $gte: 2 } })
    .populate({
      path: "userId",
      populate: { path: "journalEntries", options: { sort: { date: -1 }, limit: 5 } }
    });
  for (const habit of brokenStreaks) await invokeEnforcer(habit);
});
```

#### Agent B — The Enforcer

Receives the Auditor's payload, cross-references the user's journal entries, and generates a highly personalised message.

> *"You missed 'Morning Run' for the third day in a row. Interesting. Because two days ago you wrote — and I'm quoting directly here — 'I really want to finish that half-marathon before summer.' Bold of you. Very bold. The race is in 11 weeks. The couch you're on right now does not have a finish line."*

#### Delivery Modes

| Mode | Behaviour |
|---|---|
| `modal` | Full-screen takeover on next app load |
| `toast` | Persistent toast notification |
| `inbox` | Simulated email inbox UI at `/coach/inbox` |

---

### 📷 Proof of Work

Habits flagged as **Proof Required** replace the standard checkbox with a photo upload prompt.

1. User uploads a photo from their device or camera
2. Image is sent to the **Gemini Multimodal** endpoint alongside the habit name and description
3. Gemini evaluates whether the photo constitutes valid proof
4. **Verified** → habit marked complete, streak increments, image saved to storage
5. **Rejected** → habit not marked complete, AI returns a sarcastic rejection message

**Example interactions:**

| Habit | Upload | Result |
|---|---|---|
| "Eat a healthy meal" | Photo of a salad | ✅ *Verified. Streak continues.* |
| "Eat a healthy meal" | Photo of a pizza box | ❌ *"Bold choice submitting this as evidence…"* |
| "Read 20 pages" | Photo of open book | ✅ *Verified.* |
| "Read 20 pages" | Photo of Netflix | ❌ *"An open browser is not a book. Rejected."* |

```js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function verifyHabitProof(habitName, habitDescription, imageBase64, mimeType = "image/jpeg") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const result = await model.generateContent([
    {
      inlineData: { data: imageBase64, mimeType }
    },
    `Habit: "${habitName}". Description: "${habitDescription}".
     Does this image prove the habit was completed?
     Respond ONLY with JSON: { "verified": boolean, "message": string }
     If not verified, make the message sarcastic and specific to what you see in the image.`
  ]);

  return JSON.parse(result.response.text());
}
```

---

### 🕵️ Paranoia Mode

Enable from Settings. When active, an AI agent periodically scans the rendered page text and wraps selected words in a `[REDACTED]` black bar. Hover to reveal.

- The selection logic is intentionally arbitrary — proper nouns, adjectives, the occasional article
- Paranoia level: `Low` / `Medium` / `MAXIMUM CLEARANCE`
- A 🔒 badge in the top-right corner indicates Paranoia Mode is active

```
"Today was a [REDACTED] day. I went to the [REDACTED] and had [REDACTED] for lunch.
Feeling [REDACTED] about the week ahead."
```

*The agent does not explain its choices.*

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
| `GET` | `/api/streaks/:habitId` | Get streak data for a specific habit |

---

## 🗄️ Database Schema

```js
// User
const userSchema = new mongoose.Schema({
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true, select: false },
  habits:        [{ type: mongoose.Schema.Types.ObjectId, ref: "Habit" }],
  journalEntries:[{ type: mongoose.Schema.Types.ObjectId, ref: "JournalEntry" }],
  coachMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "CoachMessage" }],
}, { timestamps: true });

// Habit
const habitSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:          { type: String, required: true },
  description:   String,
  proofRequired: { type: Boolean, default: false },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  completions:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Completion" }],
}, { timestamps: true });

// Completion
const completionSchema = new mongoose.Schema({
  habitId:  { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
  date:     { type: Date, required: true },
  proofUrl: String,
});

// Journal Entry
const journalEntrySchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content:   { type: String, required: true },
  sentiment: String,
  themes:    [String],
}, { timestamps: true });

// Coach Message
const coachMessageSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  habitName: { type: String, required: true },
  message:   { type: String, required: true },
  read:      { type: Boolean, default: false },
}, { timestamps: true });
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI="mongodb+srv://user:password@cluster.mongodb.net/habitmind"

# Google Gemini
GEMINI_API_KEY="AIza..."

# Storage (S3-compatible — works with AWS S3 or Cloudflare R2)
STORAGE_BUCKET="habitmind-proofs"
STORAGE_REGION="us-east-1"
STORAGE_ACCESS_KEY="..."
STORAGE_SECRET_KEY="..."
STORAGE_ENDPOINT="https://s3.amazonaws.com"

# App
JWT_SECRET="your-jwt-secret"
PORT=5000
CLIENT_URL="http://localhost:3000"
CRON_SECRET="your-cron-secret"
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

**Branch conventions:**

| Branch | Purpose |
|---|---|
| `main` | Stable production code |
| `dev` | Integration branch |
| `feature/your-feature-name` | Individual feature branches |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built with obsessive attention to streaks and the [Gemini API](https://ai.google.dev/).<br/>
<em>Your journal entries are private. The AI reads them anyway — to help you, of course.</em>

<br />

⭐ Star this repo if HabitMind helped you build a better routine.

</div>
