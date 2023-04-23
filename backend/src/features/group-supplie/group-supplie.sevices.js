import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import GroupSupplie from "./group-supplie.model";

class GroupSupplieService {
  async createGroupSupplie(userId, input) {
    try {
      const { name, note, active } = input;
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
      const groupSupplie = new GroupSupplie({
        name,
        active,
        ...(note && { note }),
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await groupSupplie.save().then((groupSupplie) =>
        groupSupplie.populate([
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

  async getGroupSupplie(id) {
    try {
      const result = await GroupSupplie.findById(id).populate([
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
        message: "Không tìm thấy nhóm vật tư trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateGroupSupplie(userId, id, input) {
    try {
      const { name, active, note } = input;
      if (!name) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ... !name ? [{
              fieldError: "name",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
          ]
        };
      }
      const result = await GroupSupplie.findByIdAndUpdate(
        id,
        {
          ...(name && { name }),
          active,
          ...(note && { note }),
          updated_by: userId,
        },
        {
          useFindAndModify: false,
          new: true,
        }
      ).then((groupSupplie) =>
        groupSupplie.populate([
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
        code: 400,
        isValidate: false,
        message: "không tìm thấy nhóm vật tư chi",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSupplies(input) {
    const { active } = input;
    try {
      const result = await GroupSupplie.paginate({
        deleted_at: null,
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
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

  async deleteGroupSupplie(id) {
    try {
      const result = await GroupSupplie.findByIdAndRemove(id);
      return {
        code: 200,
        result,
      };
    } catch (error) {
      return error_500();
    }
  }
}
export default new GroupSupplieService();
