import _ from "lodash";

import { error_500 } from "~/constant/error-handle";
import RoleUser from "~/features/role-user/role-user.model";

export const updatePatientMiddleware = async (req, res, next) => {
    try {
        const { id: userId } = req.decodedUser;
        const roles = await RoleUser.find({ user_id: userId }).populate(["role_id"]);
        const permissions = _.union(roles.map((role) => {
            if (!role.role_id) {
                return res.status(400).json({
                    code: 400,
                    isValidate: false,
                    message: "Bạn không có quyền để thực hiện hành động này!",
                });
            }
            return role.role_id.permissions;
        }).flat(1));
        if (permissions.includes("super-admin")) {
            next();
        } else if (permissions.includes("update-patient")) {
            next();
        } else {
            return res.status(400).json({
                code: 400,
                isValidate: false,
                message: "Bạn không có quyền để thực hiện hành động này!",
            });
        }
    } catch (error) {
        return error_500();
    }
};