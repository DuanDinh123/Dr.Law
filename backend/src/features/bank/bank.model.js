import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

const BankSchema = new mongoose.Schema({
    ...BaseSchema,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String
    },
    account_number: {
        type: Number
    },
    bank_name: {
        type: String
    }
});

BankSchema.plugin(paginate);
const Bank = mongoose.model("Bank", BankSchema);
export default Bank;