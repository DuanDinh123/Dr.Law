import mongoose from "mongoose";

import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import FundSpending from "../fund-spending/fund-spending.model";
import SpendingGroup from "../spending-group/spending-group.model";
import Spending from "./spending.model";

class SpendingService {
  async createSpending(userId, input) {
    try {
      const {
        name,
        sku,
        user,
        funds_id,
        group_spendings_id,
        date,
        type,
        receiver,
        submitter,
        phone,
        address,
        content,
        note,
      } = input;
      const isExistSpendings = await Spending.findOne({ sku });
      if (isExistSpendings) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "sku",
            message: "Thu chi đã tồn tại"
          }]
        };
      }
      if (!name || !sku || !user) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ... !name ? [{
              fieldError: "name",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ... !sku ? [{
              fieldError: "sku",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ...!user ? [{
              fieldError: "user",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : []
          ]
        };
      }
      
      const spending = new Spending({
        _id: new mongoose.Types.ObjectId(),
        name,
        sku,
        funds_id,
        group_spendings_id,
        date,
        type,
        receiver,
        user,
        ...submitter && { submitter },
        ...phone && { phone },
        ...address && { address },
        ...content && { content },
        ...note && { note },
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const resultCreateSpending = await spending.save();

      const spendingfund = new FundSpending({
        spendings_id: spending._id,
        funds_id: spending.funds_id,
      });
      const resultCreateSpendingFund = await spendingfund.save();


      const spendingGroup = new SpendingGroup({
        spendings_id: spending._id,
        group_spendings_id: spending.group_spendings_id,
      });
      const resultCreateSpendingGroup = await spendingGroup.save();

      if (
        resultCreateSpending &&
        resultCreateSpendingGroup &&
        resultCreateSpendingFund
      ) {
        return {
          code: 200,
          message: "bạn đã tạo thành công thu chi",
        };
      }
    } catch (error) {
      return error_500();
    }
  }

  async getSpending(id) {
    try {
      const result = await Spending.findById(id).populate([
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
        message: "Không tìm thấy thu chi trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateSpending(userId, id, input) {
    try {
      const {
        name,
        sku,
        user,
        funds_id,
        group_spendings_id,
        date,
        type,
        receiver,
        submitter,
        phone,
        address,
        content,
        note,
      } = input;
      const result = await Spending.findByIdAndUpdate(
        id,
        {

          ...(name && { name }),
          ...(user && { user }),
          ...(sku && { sku }),
          ...(funds_id && { funds_id }),
          ...(group_spendings_id && { group_spendings_id }),
          ...(date && { date }),
          ...(type && { type }),
          ...(receiver && { receiver }),
          ...(submitter && { submitter }),
          ...(phone && { phone }),
          ...(address && { address }),
          ...(content && { content }),
          ...(note && { note }),
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
        message: "không tìm thấy thu chi",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getSpendings(input) {
    try {
      const result = await Spending.paginate(
        {
          deleted_at: null,
          $or: [
            { name: { $regex: new RegExp(input.search), $options: "i" } },
            { sku: { $regex: new RegExp(input.search), $options: "i" } },
          ]
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

  async deleteSpending(userId, id) {
    try {
      const Spending = await Spending.findById(id);
      if (Spending.deleted_at) {
        return {
          code: 400,
          isValidate: false,
          message: "Thu chi đã xóa trong hệ thống!",
        };
      }
      const result = await Spending.findByIdAndUpdate(id, {
        deleted_by: userId,
        deleted_at: Date.now(),
        updated_by: userId,
      });
      if (result) {
        return {
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      return error_500();
    }
  }
}
export default new SpendingService();
