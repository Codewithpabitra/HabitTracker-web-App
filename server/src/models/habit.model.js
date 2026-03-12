import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true
    },

    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"]
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: ""
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },

    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },

    completedDates: [
      {
        type: Date
      }
    ]
  },
  { timestamps: true }
);


// Prevent duplicate habit titles per user
habitSchema.index({ userId: 1, title: 1 }, { unique: true });

export default mongoose.model("Habit", habitSchema);