import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const GroupSupplieSchema = new mongoose.Schema({
  ...BaseSchema,
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String
  },
  active: {
    type: Boolean,
    default: true,
  },
});
GroupSupplieSchema.plugin(paginate);

const GroupSupplie = mongoose.model("GroupSupplie", GroupSupplieSchema);
export default GroupSupplie;