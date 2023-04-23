import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

const MedicalSchema = new mongoose.Schema({
  ...BaseSchema,
  //id bệnh nhân
  patient_id: {
    type: mongoose.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  tip_id: {
    type: mongoose.Types.ObjectId,
    ref: "Tip",
    required: true
  },
  quantity_tip: {
    type: Number,
  },
  pay_method: {
    type: String
  },
  //triệu chứng
  symptom: {
    type: String
  },
  // chuẩn doán
  diagnose: {
    type: String
  },
  //hẹn ngày đến khám khám
  medical_examination_day: {
    type: String,
  },
  // thanh toán trạng thái
  pay_status: {
    type: String,
  },
  // tổng
  total: {
    type: Number
  },
  // đã trả
  paid: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true
  },
  user_support: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String
      }
    }
  ],
  status: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
  },
  note: {
    type: String
  },
  // tiền sử bệnh
  medical_history: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "MedicalHistory",
      },
      name: {
        type: String
      }
    }
  ],
  // vật tư
  supplies: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Supplie",
      },
      quantity: Number
    }
  ],
  // đơn thuốc
  prescription: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Prescription",
      },
      note_prescription: {
        type: String
      }
    }
  ],
  // lời dặn
  advice: [
    {
      id: {
        type: mongoose.Types.ObjectId,
        ref: "Advice",
      }
    }
  ],
});

MedicalSchema.plugin(paginate);
const Medical = mongoose.model("Medical", MedicalSchema);
export default Medical;