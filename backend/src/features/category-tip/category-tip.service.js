import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import CategoryTip from "./category-tip.model";

class CategoryTipService {
  async createCategoryTip(userId, input) {
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
      const categoryTip = new CategoryTip({
        name: name,
        ...note && { note },
        active: active,
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await categoryTip.save().then(categoryTip => categoryTip.populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        },
      ]));
      return {
        code: 200,
        result,
        message: "Tạo nhóm thủ thuật thành công"
      };
    } catch (error) {
      return error_500();
    }
  }

  async getCategoryTips(input) {
    const { active } = input;
    try {
      const result = await CategoryTip.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
        ],
        ...active && { active }
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

  async getCategoryTip(id) {
    try {
      const result = await CategoryTip.findById(id).populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        }
      ]);
      return {
        code: 200,
        result
      };
    } catch (error) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy danh mục thủ thuật trong hệ thống!",
      };
    }
  }

  async updateCategoryTip(userId, id, input) {
    try {
      const { name, note, active } = input;
      const result = await CategoryTip.findByIdAndUpdate(id, {
        updated_by: userId,
        ...name && { name },
        ...note && { note },
        active,
      }, {
        useFindAndModify: false,
        new: true
      }).then(categoryTip => categoryTip.populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        }
      ]));
      return {
        code: 200,
        result,
        message: "Cập nhật thành công"
      };
    } catch (err) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy danh mục thủ thuật trong hệ thống!",
      };
    }
  }

  async deleteCategoryTip(id) {
    try {
      const result = await CategoryTip.findByIdAndDelete({ _id: id });
      return {
        code: 200,
        result,
      };
    } catch (error) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy danh mục thủ thuật trong hệ thống!",
      };
    }
  }
}

export default new CategoryTipService();