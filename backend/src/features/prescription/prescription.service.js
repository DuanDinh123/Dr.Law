import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Prescription from "./prescription.model";

class PrescriptionService {
  async createPrescription(userId, input) {
    const { name, active, note, advice, prescription_content } = input;

    if (!name || !prescription_content) {
      return {
        code: 400,
        isValidate: true,
        errors: [
          ... !name ? [{
            fieldError: "name",
            message: "Vui lòng nhập đầy đủ dữ liệu!"
          }] : [],
          ... !prescription_content ? [{
            fieldError: "prescription_content",
            message: "Vui lòng nhập đầy đủ dữ liệu!"
          }] : []
        ]
      };
    }

    const prescription = new Prescription({
      name,
      prescription_content,
      ...note && { note },
      active,
      ...advice && { advice },
      created_by: userId,
      updated_by: userId,
      created_at: Date.now(),
    });

    try {
      const result = await prescription.save(prescription).then(prescription => prescription.populate([
        {
          path: "created_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "updated_by",
          select: ["_id", "name", "email"],
        },
        {
          path: "advice",
          select: { _id: 1, sample_content: 1, active: 1, name: 1 }
        }
      ]));
      return {
        code: 200,
        result
      };
    } catch (err) {
      return error_500();
    }
  }

  async getPrescriptions(input) {
    const { active } = input;
    try {
      const result = await Prescription.paginate({
        deleted_at: null,
        $or: [
          { name: { $regex: new RegExp(input.search) } },
        ],
        ...active && { active}
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
            path: "advice",
            select: { _id: 1, sample_content: 1, active: 1, name: 1 }
          }
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
        message: "Không tìm thấy đơn thuốc trong hệ thống!"
      };
    } catch (err) {
      return error_500();
    }
  }

  async getPrescription(id) {
    try {
      const result = await Prescription.findById(id, {}, {
        deleted_at: null,
      }).populate([
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
          path: "advice",
          select: { _id: 1, sample_content: 1, active: 1, name: 1 }
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
        message: "Không tìm thấy đơn thuốc trong hệ thống!"
      };
    } catch (err) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy đơn thuốc trong hệ thống!",
      };
    }
  }

  async updatePrescription(userId, id, input) {
    try {
      const { name, prescription_content, active, note } = input;

      const result = await Prescription.findByIdAndUpdate(id, {
        name,
        prescription_content,
        ...note && { note },
        active,
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: true
      }).then(Prescription => Prescription.populate([
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
    } catch (err) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy đơn thuốc trong hệ thống!",
      };
    }
  }

  async deletePrescription(userId, id) {
    try {
      const prescription = await Prescription.findById(id);
      if (prescription.deleted_at) {
        return {
          code: 400,
          isValidate: false,
          message: "Đơn thuốc đã xóa trong hệ thống!",
        };
      }
      const result = await Prescription.findByIdAndUpdate(id, { deleted_by: userId, deleted_at: Date.now(), updated_by: userId });
      if (result) {
        return {
          code: 200,
          result
        };
      }
    } catch (err) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy đơn thuốc trong hệ thống!",
      };
    }
  }
}

export default new PrescriptionService();