import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

const SpendingSchema = new mongoose.Schema({
  ...BaseSchema,
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  funds_id: {
    type: String,
    required: true,
  },
  group_spendings_id: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  type: {
    type: Boolean,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  submitter: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    maxLength: 10,
  },
  address: {
    type: String,
    trim: true,
  },
  content: {
    type: String,
  },
  note: {
    type: String,
  },
  group_spending: { type: mongoose.Types.ObjectId, ref: "GroupSpending" },
});

SpendingSchema.plugin(paginate);
const Spending = mongoose.model("Spending", SpendingSchema);
export default Spending;
