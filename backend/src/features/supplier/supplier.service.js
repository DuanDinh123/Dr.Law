import validator from "validator";

import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Supplier from "./supplier.model";

export default new class SupplierService {
  async createSupplier(userId, input) {
    try {
      const { name, phone, email, website, address, description, active } = input;

      if (!name || !phone || !email) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ... !name ? [{
              fieldError: "name",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ... !phone ? [{
              fieldError: "phone",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ...!email ? [{
              fieldError: "email",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : []
          ]
        };
      }
      if (email && !validator.isEmail(email)) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "email",
            message: "Hãy nhập đúng định dạng Email!"
          }]
        };
      }
      if (!validator.matches(phone, /^\d{10}$/)) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "phone",
            message: "Số điện thoại phải có 10 chữ số!"
          }]
        };
      }

      const isExistEmail = await Supplier.findOne({ email });
      if (isExistEmail) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "email",
            message: "Email đã tồn tại trong hệ thống!"
          }]
        };
      }

      const supplier = new Supplier({
        name,
        phone,
        email,
        ...website && { website },
        ...address && { address },
        ...description && { description },
        active,
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });

      const result = await supplier.save(supplier).then(supplier => supplier.populate([
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
    } catch (error) {
      return error_500();
    }
  }

  async getSuppliers(input) {
    const { active } = input;
    try {
      const result = await Supplier.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
          { phone: { $regex: new RegExp(input.search), $options: "i" } },
          { email: { $regex: new RegExp(input.search), $options: "i" } },
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
          {
            path: "deleted_by",
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
    } catch (error) {
      return error_500();
    }
  }

  async getSupplier(id) {
    try {
      const result = await Supplier.findById(id).populate([
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
        type: "supplier",
        message: "Không tìm thấy nhà cung cấp trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updateSupplier(userId, id, input) {
    try {
      const { name, phone, email, website, address, description, active } = input;
      if (!name || !phone || !email) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ... !name ? [{
              fieldError: "name",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ... !phone ? [{
              fieldError: "phone",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : [],
            ...!email ? [{
              fieldError: "email",
              message: "Vui lòng nhập đầy đủ dữ liệu!"
            }] : []
          ]
        };
      }
      if (email && !validator.isEmail(email)) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "email",
            message: "Hãy nhập đúng định dạng Email!"
          }]
        };
      }
      if (!validator.matches(phone, /^\d{10}$/)) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "phone",
            message: "Số điện thoại phải có 10 chữ số!"
          }]
        };
      }
      const isExistEmail = await Supplier.findOne({ name, email: { $ne: email } });
      if (isExistEmail) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "email",
            message: "Email đã tồn tại trong hệ thống!"
          }]
        };
      }
      const result = await Supplier.findByIdAndUpdate(id, {
        ...name && { name },
        ...phone && { phone },
        ...email && { email },
        ...website && { website },
        ...address && { address },
        ...description && { description },
        active,
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
        message: "Không tìm thấy nhà cung cấp trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async deleteSupplier(id) {
    try {
      const result = await Supplier.findByIdAndRemove(id);
      if (result) {
        return {
          code: 200,
          result
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy nhà cung cấp trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }
};