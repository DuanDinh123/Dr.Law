import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Tip from "./tip.model";

class TipService {
  async createTip(userId, input) {
    try {
      const { category_tip, name_tip, symptom, price, discount, position, note } = input;

      if (!name_tip || !symptom || !price || !category_tip) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ... !name_tip ? [{
              fieldError: "name_tip",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ... !symptom ? [{
              fieldError: "symptom",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ...!price ? [{
              fieldError: "price",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ...!category_tip ? [{
              fieldError: "category_tip",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : []
          ]
        };
      }

      const tips = new Tip({
        category_tip: category_tip,
        name_tip: name_tip,
        symptom: symptom,
        price: price,
        ...discount && { discount },
        ...position && { position },
        ...note && { note },
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });

      const result = await tips.save().then(tips => tips.populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "category_tip"
        }
      ]));
      if (result) {
        return {
          code: 200,
          result,
          message: "Tạo thủ thuật thành công"
        };
      }
    } catch (err) {
      return error_500();
    }
  }

  async getTips(input) {
    try {
      const result = await Tip.paginate({
        deleted_at: null,
        $or: [
          { name_tip: { $regex: new RegExp(input.search), $options: "i" } },
          { symptom: { $regex: new RegExp(input.search), $options: "i" } },
        ],
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
          {
            path: "deleted_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "category_tip"
          }
        ]
      });
      if (result) {
        return {
          code: 200,
          result
        };
      }
    } catch (err) {
      return error_500();
    }
  }

  async getTip(id) {
    try {
      const result = await Tip.findById(id).populate([
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
        {
          path: "category_tip"
        }
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
        message: "Thủ thuật không tồn tại trong hệ thống!"
      };
    } catch (err) {
      return error_500();
    }
  }

  async updateTip(userId, id, input) {
    try {
      const { category_tip, name_tip, symptom, price, discount, position, note } = input;

      if (!name_tip || !symptom || !price || !category_tip) {
        return {
          code: 400,
          isValidate: false,
          message: "Phải nhập đầy đủ trường dữ liệu"
        };
      }

      const result = await Tip.findByIdAndUpdate(id, {
        category_tip: category_tip,
        name_tip: name_tip,
        symptom: symptom,
        price: price,
        ...discount && { discount },
        ...position && { position },
        ...note && { note },
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: true
      }).then(patient => patient.populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "category_tip",
        }
      ]));

      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy thủ thuật trong hệ thống!"
      };
    } catch (err) {
      return error_500();
    }
  }

  async deleteTip(userId, id) {
    try {
      const tip = await Tip.findOne({ _id: id, deleted_at: null });
      if (!tip) {
        return {
          code: 400,
          isValidate: false,
          message: "Không tìm thấy thủ thuật trong hệ thống!"
        };
      }
      const result = await Tip.findByIdAndUpdate(id, { deleted_by: userId, deleted_at: Date.now(), updated_by: userId });
      if (result) {
        return {
          code: 200,
          result
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy vật tư trong hệ thống!"
      };
    } catch (err) {
      return error_500();
    }
  }
}

export default new TipService();