import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Root from "./root.model";

class RootService {
  async createRoot(userId, input) {
    try {
      const { name, description, active } = input;
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
      const isNameExist = await Root.findOne({ name });
      if (isNameExist) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "name",
            message: "Tên nguồn giới thiệu đã tồn tại!"
          }]
        };
      }

      const root = new Root({
        name,
        ...description && { description },
        active,
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });

      const result = await root.save().then(root => root.populate([
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
      };
    } catch (error) {
      return error_500();
    }
  }

  async getRoots(input) {
    try {
      const result = await Root.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
          { description: { $regex: new RegExp(input.search), $options: "i" } },
        ]
      }, {
        ...paginateOptions(input)
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

  async getRoot(id) {
    try {
      const result = await Root.findById(id).populate([
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
        message: "Nguồn giới thiệu không tồn tại trong hệ thống!"
      };
    }
  }

  async updateRoot(userId, id, input) {
    try {
      const { name, description, active } = input;
      const isExistName = await Root.findOne({ name, _id: { $ne: id } });
      if (isExistName) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "name",
            message: "Tên nguồn giới thiệu đã tồn tại!"
          }]
        };
      }
      const result = await Root.findByIdAndUpdate(id, {
        ...name && { name },
        ...description && { description },
        active,
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: true,
      }
      ).then((root) =>
        root.populate([
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
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy nguồn giới thiệu trong hệ thống!",
      };
    }
  }

  async deleteRoot(id) {
    try {
      const result = await Root.findByIdAndDelete({ _id: id });
      return {
        code: 200,
        result
      };
    } catch (error) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy nguồn giới thiệu trong hệ thống!",
      };
    }
  }
}

export default new RootService();