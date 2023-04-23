import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Status from "./status.model";

class StatusService {
  async createStatus(userId, input) {
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
      const isNameExist = await Status.findOne({ name });
      if (isNameExist) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "name",
            message: "Trạng thái đã tồn tại!"
          }]
        };
      }

      const status = new Status({
        name,
        ...description && { description },
        active,
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });

      const result = await status.save().then(status => status.populate([
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

  async getStatuses(input) {
    const { active } = input;
    try {
      const result = await Status.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
          { description: { $regex: new RegExp(input.search), $options: "i" } },
        ],
        ...active && { active }
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

  async getStatus(id) {
    try {
      const result = await Status.findById(id).populate([
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
        message: "Trạng thái không tồn tại trong hệ thống!"
      };
    }
  }

  async updateStatus(userId, id, input) {
    try {
      const { name, description, active } = input;
      const isExistName = await Status.findOne({ name, _id: { $ne: id } });
      if (isExistName) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "name",
            message: "Trạng thái đã tồn tại!"
          }]
        };
      }
      const result = await Status.findByIdAndUpdate(id, {
        ...name && { name },
        ...description && { description },
        active,
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: true,
      }
      ).then((status) =>
        status.populate([
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
        message: "Không tìm thấy trạng thái trong hệ thống!",
      };
    }
  }

  async deleteStatus(id) {
    try {
      const result = await Status.findByIdAndDelete({ _id: id });
      return {
        code: 200,
        result
      };
    } catch (error) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy trạng thái trong hệ thống!",
      };
    }
  }
}

export default new StatusService();