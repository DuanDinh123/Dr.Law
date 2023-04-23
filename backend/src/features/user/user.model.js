// import UserInformationBanks from '../../models/user_information_banks.model';
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import validator from "validator";

import { BaseSchema } from "~/common/model/base.model";

const UserSchema = new mongoose.Schema({
    ...BaseSchema,
    name: {
        type: String,
        required: [true, "Name required!"],
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email required!"],
        index: { unique: true, sparse: true },
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password required!"],
    },
    image: { type: mongoose.Types.ObjectId, ref: "Assets" },
    date_of_birth: {
        type: Date,
    },
    cardID: {
        type: String,
        index: { unique: true, sparse: true },
    },
    phone: {
        type: String,
        maxLength: 10,
    },
    note: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

UserSchema.plugin(paginate);
const User = mongoose.model("User", UserSchema);
export default User;