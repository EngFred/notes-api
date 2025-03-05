import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    content: { type: String, required: true },
    color: { type: String, default: "#FFFFFF" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPinned: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
