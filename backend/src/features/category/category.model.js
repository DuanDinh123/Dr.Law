import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, deleted_by, ...Base } = BaseSchema;

const CategorySchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    slug: {
        type: String,
        required: true,
        index: { unique: true, sparse: true }
    },
    description: {
        type: String,
    },
    supplies: [{ type: mongoose.Types.ObjectId, ref: "Supplie" }]
});

CategorySchema.plugin(paginate);
const Category = mongoose.model("Category", CategorySchema);
export default Category;