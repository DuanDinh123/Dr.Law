import mongoose from "mongoose";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { _deleted_at, ...Base } = BaseSchema;
const SessionSchema = new mongoose.Schema({
    ...Base,
    token: {
        type: String,
        required: true,
        index: { unique: true, sparse: true }
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }
});

const Session = mongoose.model("Session", SessionSchema);
export default Session;