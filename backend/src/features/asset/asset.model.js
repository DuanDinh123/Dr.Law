import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, updated_at, deleted_by, updated_by, ...Base } = BaseSchema;

const AssetSchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
    },
    mimetype: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    src: {
        type: String,
        required: true,
    }
});

AssetSchema.plugin(paginate);
const Asset = mongoose.model("Asset", AssetSchema);
export default Asset;