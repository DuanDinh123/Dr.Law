import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, updated_at, deleted_by, updated_by, ...Base } = BaseSchema;

const GroupSpendingSchema = new mongoose.Schema({
    ...BaseSchema,
    name: {
        type: String,
        required: true,
    },
    clause: {
        type: String,
        required: true,
    },
    group: {
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
GroupSpendingSchema.plugin(paginate);

const GroupSpending = mongoose.model("GroupSpending", GroupSpendingSchema);
export default GroupSpending;