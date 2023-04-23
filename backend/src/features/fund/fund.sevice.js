import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Fund from "./fund.model";

class FundService {
  async createFund(userId, input) {
    try {
      const { name, note, act } = input;
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
      const fund = new Fund({
        name,
        ...(note && { note }),
        ...(act && { act }),
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await fund.save().then((fund) =>
        fund.populate([
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

  async getFund(id) {
    try {
      const result = await Fund.findById(id).populate([
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
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy quỹ trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateFund(userId, id, input) {
    try {
      const { name, note, act } = input;
      const result = await Fund.findByIdAndUpdate(
        id,
        {
          ...(name && { name }),
          ...(note && { note }),
          ...(act && { act }),
          updated_by: userId,
        },
        {
          useFindAndModify: false,
          new: true,
        }
      ).then((fund) =>
        fund.populate([
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
        message: "Không tìm thấy quỹ trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getFunds(input) {
    try {
      const result = await Fund.paginate(
        {
          name: { $regex: new RegExp(input.search) },
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

  async deleteFund(id) {
    try {
      const result = await Fund.findByIdAndRemove(id);
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Quỹ đã xóa trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }
}
export default new FundService();
