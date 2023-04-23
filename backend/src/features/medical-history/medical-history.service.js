import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import MedicalHistory from "./medical-history.model";

class MedicalHistoryService {
  async createMedicalHistory(userId, input) {
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
      const isNameExist = await MedicalHistory.findOne({ name });
      if (isNameExist) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "name",
            message: "Tiểu sử bệnh đã tồn tại!"
          }]
        };
      }
      const medicalHistory = new MedicalHistory({
        name,
        ...description && { description },
        active,
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await medicalHistory.save().then(medicalHistory => medicalHistory.populate([
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

  async getMedicalHistories(input) {
    try {
      const result = await MedicalHistory.paginate({
        $or: [
          { name: { $regex: new RegExp(input.search), $options: "i" } },
          { note: { $regex: new RegExp(input.search), $options: "i" } },
          { active: Boolean(input.search) },
        ]
      }, paginateOptions(input));
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

  async getMedicalHistory(id) {
    try {
      const result = await MedicalHistory.findById(id).populate([
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
        message: "Tiểu sử bệnh không tồn tại trong hệ thống!"
      };
    }
  }

  async updateMedicalHistory(userId, id, input) {
    try {
      const { name, description, active } = input;
      const isExistName = await MedicalHistory.findOne({ name, _id: { $ne: id } });
      if (isExistName) {
        return {
          code: 400,
          isValidate: true,
          errors: [{
            fieldError: "name",
            message: "Tiểu sử bệnh đã tồn tại!"
          }]
        };
      }
      const result = await MedicalHistory.findByIdAndUpdate(id, {
        ...name && { name },
        ...description && { description },
        active,
        updated_by: userId,
      }, {
        useFindAndModify: false,
        new: true,
      }
      ).then((patient) =>
        patient.populate([
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
        message: "Không tìm thấy tiểu sử bệnh trong hệ thống!",
      };
    }
  }

  async deleteMedicalHistory(id) {
    try {
      const result = await MedicalHistory.findByIdAndDelete({ _id: id });
      return {
        code: 200,
        result
      };
    } catch (error) {
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy tiểu sử bệnh trong hệ thống!",
      };
    }
  }
}

export default new MedicalHistoryService();