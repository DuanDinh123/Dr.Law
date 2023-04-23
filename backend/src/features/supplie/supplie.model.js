import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

// eslint-disable-next-line no-unused-vars
const { deleted_at, deleted_by, ...Base } = BaseSchema;

const SupplieSchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
    },
    assets: [{ type: mongoose.Types.ObjectId, ref: "Asset" }],
    featured_asset: { type: mongoose.Types.ObjectId, ref: "Asset" },
    group_supplie: { type: mongoose.Types.ObjectId, ref: "GroupSupplie", require: true },
    sku: {
        type: String,
        required: true,
    },
    price_attrition: {
        type: Number
    },
    price: {
        type: Number,
        default: 0
    },
    unit: {
        type: String
    },
    quantity: {
        type: Number,
        default: 0,
    },
    warning: {
      type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

SupplieSchema.plugin(paginate);
const Supplie = mongoose.model("Supplie", SupplieSchema);
export default Supplie;