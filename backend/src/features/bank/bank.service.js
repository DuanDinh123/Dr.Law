import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Bank from "./bank.model";

class BankService {
    async createBank(userId, input) {
        try {
            const { user, name, account_number, bank_name } = input;
            if (user) {
                const isCardNumberExist = await Bank.findOne({ user });
                if (isCardNumberExist) {
                    return {
                        code: 400,
                        isValidate: false,
                        message: "Thông tin ngân hàng của người dùng đã tồn tại trong hệ thống!",
                    };
                }
            }
            const bank = new Bank({
                user,
                ...name && { name },
                ...account_number && { account_number },
                ...bank_name && { bank_name },
                created_at: Date.now(),
                created_by: userId,
                updated_by: userId,
            });
            const result = await bank.save().then(bank => bank.populate([
                {
                    path: "user",
                    select: ["_id", "name", "email"],
                }
            ]));
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
        } catch (err) {
            return error_500();
        }
    }

    async updateBank(userId, id, input) {
        try {
            const { name, account_number, bank_name } = input;
            const result = await Bank.findByIdAndUpdate(id, {
                ...name && { name },
                ...account_number && { account_number },
                ...bank_name && { bank_name },
                updated_by: userId,
            }, {
                useFindAndModify: false,
                new: true
            });
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
        } catch (err) {
            return error_500();
        }
    }

    async deleteBank(id) {
        try {
            const result = await Bank.findByIdAndDelete({ _id: id });
            if (result) {
                return {
                    code: 200,
                    result,
                };
            }
            return {
                code: 401,
                message: "Không tìm thấy thông tin ngân hàng trong hệ thống!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async getBanks(input) {
        try {
            const result = await Bank.paginate({}, {
                ...paginateOptions(input),
                populate: [
                    {
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "user",
                        select: ["_id", "name", "email"],
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

    async getBankByUserId(id) {
        try {
            const result = await Bank.findOne({ user: id }).populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
            ]);
            if (result) {
                return {
                    code: 200,
                    result,
                };
            }
            return {
                code: 400,
                message: "Không tìm thấy thông tin ngân hàng của người dùng này trong hệ thống!",
            };
        } catch (error) {
            return error_500();
        }
    }

    async deleteBankByUserId(id) {
        try {
            const result = await Bank.findOneAndRemove({ user: id }).populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
            ]);
            if (result) {
                return {
                    code: 200,
                    result,
                };
            }
            return {
                code: 400,
                message: "Không tìm thấy thông tin ngân hàng của người dùng này trong hệ thống!",
            };
        } catch (error) {
            return error_500();
        }
    }
}

export default new BankService();