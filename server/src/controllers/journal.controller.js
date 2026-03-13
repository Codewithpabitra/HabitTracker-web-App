import Journal from "../models/journal.model.js";
import { analyzeJournal } from "../services/AI.service.js";
import {
  createJournalSchema,
  updateJournalSchema
} from "../validators/journal.validator.js";



export const createEntry = async (req, res, next) => {
  try {
    const validatedData = createJournalSchema.parse(req.body);
    const { title, content, mood } = validatedData;

    // created the entry
    const entry = await Journal.create({
      userId: req.user,
      title,
      content,
      mood
    });

    // Generate the AI Sentiment
    const aiResult = await analyzeJournal(content);
    console.log("AI response received:", aiResult);

    // Save the AI insights in the document 
    entry.aiInsights = {
      sentiment: aiResult.sentiment,
      themes: aiResult.themes
    };

     await entry.save();

    res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      data: entry
    });

  } catch (e) {
    console.error("Error in creating journal : ",e);
    if (e.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: e.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    next(e);
  }
};



export const getEntries = async (req, res, next) => {
  try {
    const entries = await Journal
      .find({ userId: req.user })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message : "Journal entries fetched successfully",
      data: entries
    });

  } catch (e) {
    console.error("Error in fetching journal entries from DB: ",e);
    next(e);
  }
};



export const updateEntry = async (req, res, next) => {
  try {
    const validatedData = updateJournalSchema.parse(req.body);
    const entry = await Journal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user
      },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal entry updated",
      data: entry
    });

  } catch (e) {
    console.error("Error in updating journal entry :",e);
    if (e.name === "ZodError") {
      return res.status(400).json({
        success: false,
        errors: e.errors.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    next(e);
  }
};



export const deleteEntry = async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Journal entry deleted"
    });

  } catch (e) {
    console.error("Error in deleting journal entry :",e);
    next(e);
  }
};




/**
 * GET /api/journal/dashboard?days=7
 * Returns aggregated emotional trends for the past 7–14 days.
 * Query param: days (default 7, max 14)
 */
export const getEmotionalDashboard = async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 14);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const entries = await Journal.find({
      userId: req.user,
      createdAt: { $gte: since }
    })
      .sort({ createdAt: 1 })
      .select("title mood aiInsights createdAt");

    // Mood frequency
    const moodCounts = { happy: 0, neutral: 0, sad: 0, productive: 0, stressed: 0 };
    const sentimentCounts = { Positive: 0, Neutral: 0, Anxious: 0, Lethargic: 0 };
    const themeFrequency = {};

    const calendarMap = {}; // 

    entries.forEach(e => {
      // Mood counts
      if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;

      // Sentiment counts
      const sent = e.aiInsights?.sentiment;
      if (sent) sentimentCounts[sent] = (sentimentCounts[sent] || 0) + 1;

      // Theme frequency
      (e.aiInsights?.themes || []).forEach(t => {
        themeFrequency[t] = (themeFrequency[t] || 0) + 1;
      });

      // Calendar (latest mood per day)
      const dateKey = e.createdAt.toISOString().split("T")[0];
      calendarMap[dateKey] = {
        mood: e.mood,
        sentiment: e.aiInsights?.sentiment || "Neutral",
        count: (calendarMap[dateKey]?.count || 0) + 1
      };
    });

    // Top themes 
    const topThemes = Object.entries(themeFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([theme, count]) => ({ theme, count }));

    // Dominant mood 
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0];
    const dominantSentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0];

    // ── 5. Mood-over-time series (daily, last mood of each day) ────────
    const moodTimeline = Object.entries(calendarMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, val]) => ({ date, ...val }));

    // ── 6. Streak – consecutive days with positive/productive mood ─────
    const positiveSet = new Set(["happy", "productive"]);
    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      if (calendarMap[key] && positiveSet.has(calendarMap[key].mood)) {
        currentStreak++;
      } else {
        break;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        periodDays: days,
        totalEntries: entries.length,
        dominantMood,
        dominantSentiment,
        currentPositiveStreak: currentStreak,
        moodCounts,
        sentimentCounts,
        topThemes,
        moodTimeline,  
        calendarMap   
      }  
    });
  } catch (e) {
    console.error("Error in getEmotionalDashboard:", e);
    next(e);
  }
};