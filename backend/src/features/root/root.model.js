import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, deleted_by, ...Base } = BaseSchema;

const RootSchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        index: { unique: true, sparse: true }
    },
    active: {
        type: Boolean,
        default: true,
    },
    description: {
        type: String
    }
});

RootSchema.plugin(paginate);
const Root = mongoose.model("Root", RootSchema);
export default Root;