import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";

const SalarySchema = new mongoose.Schema({
    ...BaseSchema,
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    // tổng doanh thu
    total_revenue: {
        type: Number
    },
    // lương
    wage: {
        type: Number,
    },
    //ngày làm việc
    work_day: {
        type: Number,
    },
    // thưởng doanh số
    bonus_sale: {
        type: Number,
    },
    //thưởng doanh thu
    bonus_revenue: {
        type: Number,
        default: 0
    },
    // phụ cấp
    allowance: {
        type: Number,
    },
    // tạm ứng
    advance: {
        type: Number,
    },
    // tổng tiền nhận được
    total_salary: {
        type: Number,
    }
});

SalarySchema.plugin(paginate);
const Salary = mongoose.model("Salary", SalarySchema);
export default Salary;

