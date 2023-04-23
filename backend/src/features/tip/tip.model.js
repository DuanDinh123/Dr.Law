import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

const TipSchema = new mongoose.Schema({
    ...BaseSchema,
    name_tip: {
        type: String,
        required: true,
    },
    symptom: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    discount: {
        type: Number,
    },
    position: {
        type: String,
    },
    note: {
        type: String,
    },
    category_tip: {
        type: mongoose.Types.ObjectId,
        ref: "CategoryTip",
        required: true
    }
});

TipSchema.plugin(paginate);
const Tip = mongoose.model("Tip", TipSchema);
export default Tip;