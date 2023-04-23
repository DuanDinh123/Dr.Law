
import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import RoleUser from "../role-user/role-user.model";
import Role from "./role.model";

class RoleService {
    async createRole(input) {
        try {
            const { name, description, permissions } = input;
            if (!name) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [{
                        fieldError: "name",
                        message: "Vui lòng nhập đầy đủ dữ liệu!"
                    }]
                };
            }
            const isNameExist = await Role.findOne({ name });
            if (isNameExist) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [{
                        fieldError: "name",
                        message: "Tên quyền đã được dùng trong hệ thống!"
                    }]
                };
            }
            const role = new Role({
                created_at: Date.now(),
                name,
                description,
                permissions
            });
            const error = role.validateSync();
            if (error) {
                return error_500();
            }
            const result = await role.save();
            return {
                code: 200,
                result
            };
        } catch (error) {
            return error_500();
        }
    }

    async deleteRole(id) {
        try {
            const result = await Role.findByIdAndDelete({ _id: id });
            await RoleUser.deleteMany({ role_id: result.id });
            return {
                code: 200,
                result
            };
        } catch (error) {
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy vai trò trong hệ thống hoặc hệ thống lỗi vui lòng thử lại sau!",
            };
        }
    }

    async getRole(id) {
        try {
            const result = await Role.findById(id);
            return {
                code: 200,
                result
            };
        } catch (error) {
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy vai trò trong hệ thống hoặc hệ thống lỗi vui lòng thử lại sau!",
            };
        }
    }

    async getRoles(input) {
        try {
            const result = await Role.paginate({
                // write more filter with condition here.
                name: { $regex: new RegExp(input.search) },
            }, paginateOptions(input));
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

    async updateRole(id, input) {
        try {
            const { name, description, permissions } = input;
            const isNameExist = await Role.findOne({ name, _id: { $ne: id } });
            if (isNameExist) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [{
                        fieldError: "name",
                        message: "Tên quyền đã được dùng trong hệ thống!"
                    }]
                };
            }
            const result = await Role.findByIdAndUpdate(id, {
                ...name && { name },
                ...description && { description },
                permissions
            }, {
                useFindAndModify: false,
                new: true
            });
            return {
                code: 200,
                result
            };
        } catch (error) {
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy vai trò trong hệ thống hoặc hệ thống lỗi vui lòng thử lại sau!"
            };
        }
    }

    async getRolesByUserId(id) {
        try {
            const result = await RoleUser.find({ user_id: id }).populate([
                {
                    path: "user_id",
                    select: ["_id", "name","email"],
                },
                {
                    path: "role_id",
                    select: ["_id", "name"],
                },
            ]);
            return {
                code: 200,
                result
            };
        } catch (error) {
            return error_500();
        }
    }
}

export default new RoleService();