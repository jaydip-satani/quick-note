import mongoose, { Schema, Document } from "mongoose";

export interface INotes extends Document {
    userId: mongoose.Types.ObjectId;
    noteTitle: string;
    noteData: string;
    pinned: boolean;
}

const NoteSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        noteTitle: {
            type: String,
            required: true
        },
        noteData: {
            type: String,
            required: true
        },
        pinned: {
            type: Boolean,
            required: true,
            default: false
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Note || mongoose.model<INotes>("Notes", NoteSchema);
