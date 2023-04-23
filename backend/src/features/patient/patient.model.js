import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import validator from "validator";

import { BaseSchema } from "~/common/model/base.model";

const PatientSchema = new mongoose.Schema({
  ...BaseSchema,
  name: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    validate: [validator.isDate],
  },
  gender: {
    type: Boolean
  },
  cardID: {
    type: String
  },
  address: {
    type: String
  },
  address_text: {
    type: String
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
    maxLength: 10,
  },
  // tổng tiền
  total_money: {
    type: Number,
    default: 0
  },
  // tiền nợ
  debt: {
    type: Number,
    default: 0
  },
  root: { type: mongoose.Types.ObjectId, ref: "Root", require: true },
  root_description: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  }
});

PatientSchema.plugin(paginate);
const Patient = mongoose.model("Patient", PatientSchema);
export default Patient;