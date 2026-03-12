import Journal from "../models/journal.model.js";
import {
  createJournalSchema,
  updateJournalSchema
} from "../validators/journal.validator.js";



export const createEntry = async (req, res, next) => {
  try {
    const validatedData = createJournalSchema.parse(req.body);
    const { title, content, mood } = validatedData;

    const entry = await Journal.create({
      userId: req.user,
      title,
      content,
      mood
    });

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