import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Patient from "../patient/patient.model";
import Supplie from "../supplie/supplie.model";
import Tip from "../tip/tip.model";
import User from "../user/user.model";
import Medical from "./medical.model";
class MedicalService {
    async addPrescription(userId, input) {
        try {
            const { medical_id, prescription, advice } = input;
            const result = await Medical.findByIdAndUpdate(medical_id, {
                prescription: prescription,
                advice: advice,
                updated_by: userId,
            });
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
        } catch (error) {
            return error_500();
        }
    }
    async payment(userId, input) {
        try {
            const { id, patient_id, pay_status, paid, pay_method } = input;
            const result_medical = await Medical.findOne({ _id: id, deleted_at: null }).then(medical => medical.populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "patient_id"
                },
                {
                    path: "tip_id"
                },
                {
                    path: "status",
                    select: ["_id", "name"]
                },
                {
                    path: "medical_history",
                    select: ["_id", "name", "description"]
                },
                {
                    path: "supplies",
                    select: ["_id", "name", "price", "quantity"]
                }
            ]));
            const result_tip = await Tip.findOne({ _id: result_medical.tip_id });
            let price_tip = result_tip ? result_tip.price : 0;
            const total_price_tip = Number(price_tip) * Number(result_medical.quantity_tip);
            let debt = total_price_tip - paid;
            const result_patient = await Patient.findOne({ _id: patient_id, deleted_at: null });
            let total = Number(result_patient.total_money) + Number(total_price_tip);
            let total_debt = debt + Number(result_patient.debt);
            const list_supplie = result_medical.supplies;
            if (list_supplie.length > 0) {
                for (let i = 0; i < list_supplie.length; i++) {
                    const supplie_res = await Supplie.findOne({ _id: list_supplie[i].id, deleted_at: null });
                    if (supplie_res) {
                        let new_quantity = Number(supplie_res.quantity) - Number(list_supplie[i].quantity);
                        if (supplie_res.quantity > 0) {
                            await Supplie.findByIdAndUpdate({ _id: list_supplie[i].id }, {
                                quantity: new_quantity
                            });
                        }
                    }
                }
            }

            const result = await Patient.findByIdAndUpdate({ _id: patient_id }, {
                total_money: total,
                debt: total_debt,
                updated_by: userId,
            });
            const pay_method_format = pay_method === 1 ? "Thanh toán qua ngân hàng" : "Thanh toán tiền mặt";
            let pay_status_format;
            if (pay_status === 1) {
                pay_status_format = "Đã thanh toán";
            }
            if (pay_status === 0) {
                pay_status_format = "Chưa thanh toán";
            }
            if (pay_status === 2) {
                pay_status_format = "Thanh toán một phần";
            }
            if (result) {
                const result = await Medical.findByIdAndUpdate(id, {
                    pay_status: pay_status_format,
                    pay_method: pay_method_format,
                    total: total_price_tip,
                    paid: Number(result_medical.paid) + Number(paid),
                    updated_by: userId,
                }).then(medical => medical.populate([
                    {
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "updated_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "patient_id"
                    },
                    {
                        path: "tip_id"
                    },
                    {
                        path: "status",
                        select: ["_id", "name"]
                    },
                    {
                        path: "medical_history",
                        select: ["_id", "name", "note"]
                    },
                    {
                        path: "supplies",
                        select: ["_id", "name", "price", "quantity"]
                    }
                ]));
                if (result) {
                    return {
                        code: 200,
                        result
                    };
                }
            }
        } catch (err) {
            return error_500();
        }
    }
    async createMedical(userId, input) {
        try {
            const { medical_history, supplies, patient_id, user_support, tip_id, pay_status, symptom, quantity_tip, diagnose, medical_examination_day, status, note } = input;
            const result_tip = await Tip.findById(tip_id);
            if (result_tip) {
                let total = Number(result_tip.price) * Number(quantity_tip);
                let pay_status_format;
                if (pay_status === 1) {
                    pay_status_format = "Đã thanh toán";
                }
                if (pay_status === 0) {
                    pay_status_format = "Chưa thanh toán";
                }
                if (pay_status === 2) {
                    pay_status_format = "Thanh toán một phần";
                }
                const medical = new Medical({
                    patient_id: patient_id,
                    tip_id: tip_id,
                    symptom: symptom,
                    user: userId,
                    user_support: user_support,
                    quantity_tip: quantity_tip,
                    pay_status: pay_status_format,
                    total: total,
                    diagnose: diagnose,
                    medical_examination_day: medical_examination_day,
                    status: status,
                    note: note,
                    medical_history: medical_history,
                    supplies: supplies,
                    created_at: Date.now(),
                    created_by: userId,
                    updated_by: userId,
                });
                if (!symptom || !quantity_tip || !diagnose || !medical_examination_day) {
                    return {
                        code: 400,
                        isValidate: true,
                        errors: [
                            ... !symptom ? [{
                                fieldError: "symptom",
                                message: "Vui lòng nhập đầy đủ dữ liệu!"
                            }] : [],
                            ... !quantity_tip ? [{
                                fieldError: "quantity_tip",
                                message: "Vui lòng nhập đầy đủ dữ liệu!"
                            }] : [],
                            ...!diagnose ? [{
                                fieldError: "diagnose",
                                message: "Vui lòng nhập đầy đủ dữ liệu!"
                            }] : [],
                            ...!medical_examination_day ? [{
                                fieldError: "medical_examination_day",
                                message: "Vui lòng nhập đầy đủ dữ liệu!"
                            }] : []
                        ]
                    };
                }
                const result = await medical.save().then(medical => medical.populate([
                    {
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "updated_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "patient_id"
                    },
                    {
                        path: "tip_id"
                    },
                    {
                        path: "status",
                        select: ["_id", "name"]
                    },
                    {
                        path: "user",
                        select: ["_id", "name", "email", "image", "date_of_birth", "cardID", "phone"],
                    },
                    {
                        path: "user_support",
                        select: ["_id", "name", "email", "image", "date_of_birth", "cardID", "phone"],
                    },
                    {
                        path: "medical_history",
                        select: ["_id", "name", "description"]
                    },
                    {
                        path: "supplies",
                        select: ["_id", "name", "price", "quantity"]
                    }
                ]));
                if (result) {
                    return {
                        code: 200,
                        result
                    };
                }
            }

        } catch (err) {
            return error_500();
        }
    }

    async getMedicals(input) {
        try {
            const result = await Medical.paginate({
                deleted_at: null,
                patient_id: input.patient_id,
            }, {
                ...paginateOptions(input),
                populate: [
                    {
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "updated_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "patient_id"
                    },
                    {
                        path: "tip_id"
                    },
                    {
                        path: "status",
                        select: ["_id", "name"]
                    },
                    {
                        path: "user",
                        select: ["_id", "name", "email", "image", "date_of_birth", "cardID", "phone"],
                    },
                    {
                        path: "user_support",
                        select: ["_id", "name", "email", "image", "date_of_birth", "cardID", "phone"],
                    },
                    {
                        path: "medical_history",
                        select: ["_id", "name", "description"]
                    },
                    {
                        path: "supplies",
                        select: ["_id", "name", "price", "quantity"]
                    }
                ]
            });
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
        } catch (error) {
            return error_500();
        }
    }
    async detailTipByUser(input) {
        try {
            const { startDate, endDate } = input;
            let startDateFormat;
            let endDateFormat;
            if (startDate && endDate) {
                startDateFormat = startDate;
                endDateFormat = endDate;
            } else {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                startDateFormat = startDate;
                endDateFormat = endDate;
            }
            const result_user = await User.find({ deleted_at: null });
            const result = [];
            for (let i = 0; i < result_user.length; i++) {
                const result_medical = await Tip.find({
                    deleted_at: null,
                    created_by: result_user[i].id,
                    created_at: {
                        $gte: startDateFormat,
                        $lt: endDateFormat
                    }
                });
                const list_user = {
                    "user": {
                        "id": result_user[i]["id"],
                        "name": result_user[i]["name"],
                        "email": result_user[i]["email"],
                    },
                    "tip": []
                };
                if (result_medical.length > 0) {
                    for (let y = 0; y < result_medical.length; y++) {
                        list_user.tip.push(result_medical[y]);
                    }
                }
                result.push(list_user);
            }
            return {
                code: 200,
                result
            };
        } catch (error) {
            return error_500();
        }
    }
    async getMedical(id) {
        try {
            const result = await Medical.findById(id).populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "patient_id"
                },
                {
                    path: "tip_id"
                },
                {
                    path: "status",
                    select: ["_id", "name"]
                },
                {
                    path: "user",
                    select: ["_id", "name", "email", "image", "date_of_birth", "cardID", "phone"],
                },
                {
                    path: "user_support",
                    select: ["_id", "name", "email", "image", "date_of_birth", "cardID", "phone"],
                },
                {
                    path: "medical_history",
                    select: ["_id", "name", "description"]
                },
                {
                    path: "prescription",
                    populate: {
                        path: "id",
                        select: ["_id", "name", "prescription_content", "note"]
                    },
                },
                {
                    path: "advice",
                    populate: {
                        path: "id",
                        select: ["_id", "name", "sample_content", "note"]
                    },
                },
                {
                  path: "supplies",
                  populate: {
                    path: "id",
                    select: ["_id", "name"]
                }
                }
            ]);
            if (result.deleted_at) {
                return {
                    code: 400,
                    isValidate: false,
                    message: "Không tìm thấy thông tin khám!",
                };
            }
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy thông tin khám!!",
            };
        } catch (error) {
            return error_500();
        }
    }
    async updateMedical(userId, id, input) {
        try {
            const { medical_history, supplies, tip_id, user, user_support, symptom, quantity_tip, diagnose, medical_examination_day, status, note } = input;
            const result = await Medical.findByIdAndUpdate(id, {
                tip_id: tip_id,
                symptom: symptom,
                user: user,
                user_support: user_support,
                quantity_tip: quantity_tip,
                diagnose: diagnose,
                medical_examination_day: medical_examination_day,
                status: status,
                note: note,
                medical_history: medical_history,
                supplies: supplies,
                created_at: Date.now(),
                created_by: userId,
                updated_by: userId,
            }, {
                useFindAndModify: false,
                new: true
            }).then(medical => medical.populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "patient_id"
                },
                {
                    path: "tip_id"
                },
                {
                    path: "status",
                    select: ["_id", "name"]
                },
                {
                    path: "medical_history",
                    select: ["_id", "name", "description"]
                },
                {
                    path: "supplies",
                    select: ["_id", "name", "price", "quantity"]
                }
            ]));
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy thông tin trong hệ thống!",
            };
        } catch (error) {
            return error_500();
        }
    }

    async deleteMedical(userId, id) {
        try {
            const result = await Medical.findByIdAndUpdate(id, { deleted_by: userId, deleted_at: Date.now(), updated_by: userId });
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tồn tại!",
            };
        } catch (error) {
            return error_500();
        }
    }
}

export default new MedicalService();

