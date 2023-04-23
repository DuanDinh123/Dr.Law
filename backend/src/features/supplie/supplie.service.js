
import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Supplie from "./supplie.model";

class SupplieService {
  async createSupplie(userId, input) {
    try {
      const { name, assets, price_attrition, sku, price, unit, quantity, active, featured_assets, group_supplie } = input;
      if (!name || !sku || !price || !group_supplie) {
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
            ...!price ? [{
              fieldError: "price",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ...!group_supplie ? [{
              fieldError: "group_supplie",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : []
          ]
        };
      }
      const isExistSupplieSku = await Supplie.findOne({ sku });
      if (isExistSupplieSku) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "sku",
            message: "Sku đã tồn tại trong hệ thống!"
          }]
        };
      }
      const supplie = new Supplie({
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
        group_supplie: group_supplie,
        name,
        price_attrition,
        ...assets && { assets },
        ...featured_assets && { featured_assets },
        sku,
        price,
        unit,
        ...quantity && { quantity },
        active,
      });
      const result = await supplie.save().then(patient => patient.populate([
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
        result
      };
    } catch (error) {
      return error_500();
    }
  }

  async getSupplie(id) {
    try {
      const result = await Supplie.findById(id).populate([
        {
          path: "assets",
        },
        {
          path: "featured_asset",
        },
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "group_supplie",
          select: ["_id", "name", "note"],
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
        message: "Vật tư không tồn tại trong hệ thống!"
      };
    } catch (error) {
      return error_500();
    }
  }
  async getSupplies(input) {
    const { active } = input;
    try {
      const result = await Supplie.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
          { sku: { $regex: new RegExp(input.search), $options: "i" } },
        ],
        ...active && { active }
      }, {
        ...paginateOptions(input),
        populate: [
          {
            path: "assets",
          },
          {
            path: "featured_asset",
          },
          {
            path: "created_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "updated_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "group_supplie",
            select: ["_id", "name", "note"],
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

  async getSuppliesByGroupSupplie(input) {
    try {
      const result = await Supplie.paginate({
        // group_supplie: input.groupSupplie
        group_supplie: input.groupSupplie ? input.groupSupplie : null
      }, {
        ...paginateOptions(input),
        populate: [
          {
            path: "assets",
          },
          {
            path: "featured_asset",
          },
          {
            path: "created_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "updated_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "group_supplie",
            select: ["_id", "name", "note"],
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

  async deleteSupplie(id) {
    try {
      const result = await Supplie.findByIdAndDelete({ _id: id });
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy vật tư trong hệ thống!"
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateSupplie(userId, id, input) {
    try {
      const { name, assets, price_attrition, sku, price, unit, quantity, active, featured_assets, group_supplie } = input;
      const isExistSupplieSku = await Supplie.findOne({ id, sku: { $ne: sku } });
      if (isExistSupplieSku) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "sku",
            message: "Sku đã tồn tại trong hệ thống!"
          }]
        };
      }
      const result = await Supplie.findByIdAndUpdate(id, {
        ...name && { name },
        ...group_supplie && { group_supplie },
        ...assets && { assets },
        ...price && { price },
        ...sku && { sku },
        ...price_attrition && { price_attrition },
        ...quantity && { quantity },
        ...unit && { unit },
        active,
        ...featured_assets && { featured_assets },
        updated_by: userId
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
        }
      ]));
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
    } catch (error) {
      return error_500();
    }
  }
}
export default new SupplieService();