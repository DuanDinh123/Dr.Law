import bcrypt from "bcryptjs";

import Role from "~/features/role/role.model";
import RoleUser from "~/features/role-user/role-user.model";
import User from "~/features/user/user.model";

export const initDb = async () => {
    const [isSuperAdminRoleExist, isSuperAdminUserExist] = await Promise.all([
        await Role.findOne({ name: "superadmin" }),
        await User.findOne({ email: "superadmin@gmail.com" })
    ]);
    if (!isSuperAdminRoleExist && !isSuperAdminUserExist) {
        const role = new Role({
            created_at: Date.now(),
            name: "superadmin",
            description: "superadmin",
            permissions: ["super-admin"]
        });
        const user = new User({
            created_at: Date.now(),
            name: "superadmin",
            email: "superadmin@gmail.com",
            password: bcrypt.hashSync("superadmin", 15),
        });
        const [roleResult, userResult] = await Promise.all([
            await role.save(),
            await user.save(),
        ]);
        const roleUser = new RoleUser({
            user_id: userResult.id,
            role_id: roleResult.id
        });
        await roleUser.save();
    } else if (!isSuperAdminRoleExist && isSuperAdminUserExist) {
        const role = new Role({
            created_at: Date.now(),
            name: "superadmin",
            description: "superadmin",
            permissions: ["super-admin"]
        });
        const roleResult = await role.save();
        const roleUser = new RoleUser({
            user_id: isSuperAdminUserExist.id,
            role_id: roleResult.id
        });
        await roleUser.save();
    } else if (isSuperAdminRoleExist && !isSuperAdminUserExist) {
        const user = new User({
            created_at: Date.now(),
            name: "superadmin",
            email: "superadmin@gmail.com",
            password: bcrypt.hashSync("superadmin", 15),
        });
        const userResult = await user.save();
        const roleUser = new RoleUser({
            user_id: userResult.id,
            role_id: isSuperAdminRoleExist.id
        });
        await roleUser.save();
    } else {
        return;
    }
};