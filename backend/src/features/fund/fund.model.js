import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, deleted_by, ...Base } = BaseSchema;

const FundSchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
    },
    note: {
        type: String,
    },
    act: {
        type: String,
        required: true,
    },
    spending: { type: mongoose.Types.ObjectId, ref: "Spending" },
});
FundSchema.plugin(paginate);
const Fund = mongoose.model("Fund", FundSchema);
export default Fund;