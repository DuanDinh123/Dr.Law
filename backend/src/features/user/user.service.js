import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Role from "../role/role.model";
import RoleUser from "../role-user/role-user.model";
import User from "./user.model";

export default new class UserService {
  async getUsers(input) {
    const { active } = input;
    try {
      const result = await User.paginate(
        {
          deleted_at: null,
          $or: [
            { name: { $regex: new RegExp(input.search), $options: "i" } },
            { email: { $regex: new RegExp(input.search), $options: "i" } },
            { cardID: { $regex: new RegExp(input.search), $options: "i" } },
            { phone: { $regex: new RegExp(input.search), $options: "i" } },
          ],
          ...active && { active}
        },
        {
          select: "created_at name email active updated_at _id",
          ...paginateOptions(input),
        }
      );
      if (result) {
        return {
          code: 200,
          result,
        };
      }
    } catch (error) {
      return error_500();
    }
  }

  async getUser(id) {
    try {
      const user = await User.findById(id);
      const result = { ...user }._doc;
      delete result.password;
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tồn tại người dùng này!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async deleteUser(id) {
    try {
      const result = await User.findByIdAndDelete({ _id: id });
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy nhân viên trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateUser(id, userId, input) {
    try {
      const { name, address, email, image_id, cardID, phone, note, active, date_of_birth } = input;
      const [isEmailExist, isCardIDExist] = await Promise.all([
        await User.findOne({ email, _id: { $ne: id } }),
        await User.findOne({ cardID, _id: { $ne: id } }),
      ]);
      if (isEmailExist || isCardIDExist) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ...isEmailExist ? [{
              fieldError: "email",
              message: "Email đã tồn tại trong hệ thống!"
            }] : [],
            ...isCardIDExist ? [{
              fieldError: "cardID",
              message: "CMT đã tồn tại trong hệ thống!"
            }] : [],
          ]
        };
      }
      const result = await User.findByIdAndUpdate(id, {
        ...name && { name },
        ...address && { address },
        ...email && { email },
        ...image_id && { image_id },
        ...cardID && { cardID },
        ...phone && { phone },
        ...note && { note },
        active,
        ...date_of_birth && { date_of_birth },
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: false
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

  async assignRolesToUser(id, input) {
    try {
      const { roleIds } = input;
      if (!roleIds) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "roleIds",
            message: "Vui lòng cung cấp các vai trò cho người dùng!"
          }]
        };
      }
      if (!Array.isArray(roleIds)) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "roleIds",
            message: "Định dạng đầu vào cung cấp sai!"
          }]
        };
      }
      const user = await User.findById(id);
      if (!user) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "id",
            message: "Người dùng không có trong hệ thống!",
          }]
        };
      }
      if (!roleIds.length) {
        await RoleUser.deleteMany({ user_id: id });
        return {
          code: 200,
          message: "Ủy quyền các vai trò cho người dùng thành công!",
        };
      }
      await RoleUser.deleteMany({ user_id: id });
      for (const roleId of roleIds) {
        const isExistRoleId = await Role.findById(roleId);
        if (!isExistRoleId) {
          return {
            code: 400,
            isValidate: false,
            message: "Vai trò không tồn tại trong hệ thống!"
          };
        }
        const roleUser = new RoleUser({
          user_id: id,
          role_id: isExistRoleId.id
        });
        await roleUser.save();
      }
      return {
        code: 200,
        message: "Ủy quyền các vai trò cho người dùng thành công!"
      };
    } catch (error) {
      return error_500();
    }
  }
};


