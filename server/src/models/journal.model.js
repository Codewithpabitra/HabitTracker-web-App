import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true
    },

    title: {
      type: String,
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
      default: ""
    },

    content: {
      type: String,
      required: [true, "Journal content is required"],
      trim: true,
      minlength: [10, "Journal entry must be at least 10 characters"],
      maxlength: [5000, "Journal entry cannot exceed 5000 characters"]
    },

    mood: {
      type: String,
      enum: ["happy", "neutral", "sad", "productive", "stressed"],
      default: "neutral"
    },
    aiInsights: {
  sentiment: {
    type: String,
    default: "Neutral",
    enum: ["Positive", "Anxious", "Lethargic", "Neutral"]
  },
  themes: [String]
}
  },
  { timestamps: true }
);


// Fast query 
journalSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Journal", journalSchema);