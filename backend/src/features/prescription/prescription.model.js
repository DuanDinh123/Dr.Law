// ** Server Imports
// ** Third Party Import
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";


const PrescriptionSchema = new mongoose.Schema({
  ...BaseSchema,
  name: {
    type: String,
    required: true
  },
  prescription_content: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true,
  },
  note: {
    type: String,
  },
  advice: {
    type: mongoose.Types.ObjectId, ref: "Advice"
  }
});

PrescriptionSchema.plugin(paginate);
const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;