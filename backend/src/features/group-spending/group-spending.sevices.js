import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import GroupSpending from "./group-spending.model";

class GroupSpendingService {
  async createGroupSpending(userId, input) {
    try {
      const { name, clause, group, note, active } = input;
      if (!name) {
        return {
          code: 400,
          isValidate: true,
          errors: [
              ... !name ? [{
                fieldError: "name",
                message: "Vui lòng nhập đầy đủ dữ liệu!"
              }] : []
            ]
        };
      }
      const groupSpending = new GroupSpending({
        name,
        ...(clause && { clause }),
        ...(group && { group }),
        ...(note && { note }),
        ...(active && { active }),
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await groupSpending.save().then((groupSpending) =>
        groupSpending.populate([
          {
            path: "created_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "updated_by",
            select: ["_id", "name", "email"],
          },
        ])
      );
      return {
        code: 200,
        result,
      };
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSpending(id) {
    try {
      const result = await GroupSpending.findById(id).populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        }
      ]);
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy nhóm thu chi trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateGroupSpending(userId, id, input) {
    try {
      const { name, clause, group, note, active } = input;
      const result = await GroupSpending.findByIdAndUpdate(
        id,
        {
          ...(name && { name }),
          ...(clause && { clause }),
          ...(group && { group }),
          ...(note && { note }),
          ...(active && { active }),
          updated_by: userId,
        },
        {
          useFindAndModify: false,
          new: true,
        }
      ).then((groupSpending) =>
        groupSpending.populate([
          {
            path: "created_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "updated_by",
            select: ["_id", "name", "email"],
          },
        ])
      );
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 401,
        isValidate: false,
        message: "không tìm thấy nhóm thu chi",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSpendings(input) {
    const { active } = input;
    try {
      const result = await GroupSpending.paginate(
        {
          deleted_at: null,
          $or: [
            { name: { $regex: new RegExp(input.search) } },
          ],
          ...active && { active }
        },
        {
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
              path: "deleted_by",
              select: ["_id", "name", "email"],
            },
          ],
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

  async deleteGroupSpending(userId, id) {
    try {
      const GroupSpending = await GroupSpending.findById(id);
      if (GroupSpending.deleted_at) {
        return {
          code: 400,
          isValidate: false,
          message: "Nhóm thu chi đã xóa trong hệ thống!",
        };
      }
      const result = await GroupSpending.findByIdAndUpdate(id, {
        deleted_by: userId,
        deleted_at: Date.now(),
        updated_by: userId,
      });
      return {
        code: 200,
        result,
      };
    } catch (error) {
      return error_500();
    }
  }
}
export default new GroupSpendingService();
