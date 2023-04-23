import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import validator from "validator";

import { BaseSchema } from "~/common/model/base.model";

const SupplierSchema = new mongoose.Schema({
    ...BaseSchema,
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        maxLength: 10,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, " Vui lòng nhập đúng định dạng"],
    },
    website: {
        type: String,
    },
    address: {
        type: String,
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

SupplierSchema.plugin(paginate);
const Supplier = mongoose.model("Supplier", SupplierSchema);
export default Supplier;