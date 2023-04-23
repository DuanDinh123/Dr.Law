import mongoose from "mongoose";

export const BaseSchema = {
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
    updated_by: { type: mongoose.Types.ObjectId, ref: "User" },
    created_by: { type: mongoose.Types.ObjectId, ref: "User" },
    deleted_by: { type: mongoose.Types.ObjectId, ref: "User" }
};

