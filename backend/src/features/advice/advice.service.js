import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Advice from "./advice.model";

class AdviceService {
  async createAdvice(userId, input) {
    const { name, sample_content, active, note } = input;
    if (!name || !sample_content) {
      return {
        code: 400,
        isValidate: true,
        errors: [
          ... !name ? [{
            fieldError: "name",
            message: "Vui lòng nhập đầy đủ dữ liệu!"
          }] : [],
          ... !sample_content ? [{
            fieldError: "sample_content",
            message: "Vui lòng nhập đầy đủ dữ liệu!"
          }] : []
        ]
      };
    }

    const advice = new Advice({
      name,
      sample_content,
      ...note && { note },
      active,
      created_by: userId,
      updated_by: userId,
      created_at: Date.now(),
    });

    try {
      const result = await advice.save().then(advice => advice.populate([
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
        message: "Tạo lời dặn thành công"
      };
    } catch (err) {
      return error_500();
    }
  }

  async getAdvices(input) {
    const { active } = input;
    try {
      const result = await Advice.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search) } },
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
          },
        ]
      });
      if (result) {
        return {
          code: 200,
          result
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy lời dặn trong hệ thống!"
      };
    } catch (err) {
      return error_500();
    }
  }

  async getAdvice(id) {
    try {
      const result = await Advice.findById(id).populate([
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
          result
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm lời dặn trong hệ thống!"
      };
    } catch (err) {
      return error_500();
    }
  }

  async updateAdvice(userId, id, input) {
    try {
      const { name, sample_content, active, note } = input;
      const result = await Advice.findByIdAndUpdate(id, {
        ...name && { name },
        ...sample_content && { sample_content },
        ...note && { note },
        active,
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: true
      }).then(advice => advice.populate([
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
      return error_500();
    }
  }

  async deleteAdvice(userId, id) {
    try {
      const result = await Advice.findByIdAndRemove(id);
      if (result) {
        return {
          code: 200,
          result,
        };
      }
    } catch (err) {
      return error_500();
    }
  }
}

export default new AdviceService();