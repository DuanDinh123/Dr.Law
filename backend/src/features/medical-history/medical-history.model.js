import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, deleted_by, ...Base } = BaseSchema;

const MedicalHistorySchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
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

MedicalHistorySchema.plugin(paginate);
const MedicalHistory = mongoose.model("MedicalHistory", MedicalHistorySchema);
export default MedicalHistory;