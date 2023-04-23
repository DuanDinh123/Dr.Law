import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, deleted_by, ...Base } = BaseSchema;

const CategoryTipSchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

CategoryTipSchema.plugin(paginate);
const CategoryTip = mongoose.model("CategoryTip", CategoryTipSchema);
export default CategoryTip;