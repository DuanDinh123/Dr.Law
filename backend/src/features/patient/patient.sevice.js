import validator from "validator";

import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Patient from "./patient.model";

class PatientService {
  async createPatient(userId, input) {
    try {
      const {
        name,
        cardID,
        phone,
        address,
        address_text,
        date_of_birth,
        gender,
        email,
        note,
        root,
        root_description,
      } = input;
      if (!name || !date_of_birth || !root) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            ...(!name
              ? [
                {
                  fieldError: "name",
                  message: "Vui lòng nhập đầy đủ dữ liệu!",
                },
              ]
              : []),
            ...(!date_of_birth
              ? [
                {
                  fieldError: "date_of_birth",
                  message: "Vui lòng nhập đầy đủ dữ liệu!",
                },
              ]
              : []),
            ...(!root
              ? [
                {
                  fieldError: "root",
                  message: "Vui lòng nhập đầy đủ dữ liệu!",
                },
              ]
              : []),
          ],
        };
      }

      if (email && !validator.isEmail(email)) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            {
              fieldError: "email",
              message: "Hãy nhập đúng định dạng email",
            },
          ],
        };
      }
      if (phone && !validator.matches(phone, /^\d{10}$/)) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            {
              fieldError: "phone",
              message: "Số điện thoại phải có 10 chữ số",
            },
          ],
        };
      }
      const patient = new Patient({
        name,
        ...(phone && { phone }),
        ...(address && { address }),
        ...(address_text && { address_text }),
        date_of_birth,
        ...(gender && { gender }),
        ...(cardID && { cardID }),
        ...(email && { email }),
        ...(note && { note }),
        root,
        ...(root_description && { root_description }),
        total_money: 0,
        debt: 0,
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await patient.save().then((patient) =>
        patient.populate([
          {
            path: "created_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "updated_by",
            select: ["_id", "name", "email"],
          },
          {
            path: "root",
            select: ["_id", "name", "description", "active"],
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

  async getPatients(input) {
    try {
      const result = await Patient.paginate(
        {
          deleted_at: null,
          $or: [
            { name: { $regex: new RegExp(input.search), $options: "i" } },
            { cardID: { $regex: new RegExp(input.search), $options: "i" } },
            { email: { $regex: new RegExp(input.search), $options: "i" } },
          ],
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
            {
              path: "root",
              select: ["_id", "name", "description", "active"],
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

  async getPatient(id) {
    try {
      const result = await Patient.findById(id).populate([
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
          path: "root",
          select: ["_id", "name", "description", "active"],
        },
      ]);
      if (result.deleted_at) {
        return {
          code: 400,
          isValidate: false,
          message: "Không tìm thấy bệnh nhân trong hệ thống!",
        };
      }
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy bệnh nhân trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async updatePatient(userId, id, input) {
    try {
      const {
        name,
        cardID,
        phone,
        address,
        address_text,
        date_of_birth,
        gender,
        email,
        note,
        root,
        root_description,
      } = input;
      if (email && !validator.isEmail(email)) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            {
              fieldError: "email",
              message: "Hãy nhập đúng định dạng email",
            },
          ],
        };
      }
      if (!validator.matches(phone, /^\d{10}$/)) {
        return {
          code: 400,
          isValidate: true,
          errors: [
            {
              fieldError: "phone",
              message: "Số điện thoại phải có 10 chữ số",
            },
          ],
        };
      }

      const result = await Patient.findByIdAndUpdate(
        id,
        {
          name: name,
          cardID: cardID,
          phone: phone,
          address: address,
          address_text: address_text,
          date_of_birth: date_of_birth,
          gender: gender,
          email: email,
          note: note,
          root: root,
          root_description: root_description,
          updated_by: userId,
        },
        {
          useFindAndModify: false,
          new: false,
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
          {
            path: "root",
            select: ["_id", "name", "description", "active"],
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
        message: "Không tìm thấy bệnh nhân trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async deletePatient(userId, id) {
    try {
      const patient = await Patient.findById(id);
      if (patient.deleted_at) {
        return {
          code: 400,
          isValidate: false,
          message: "Bệnh nhân đã xóa trong hệ thống!",
        };
      }
      const result = await Patient.findByIdAndUpdate(id, {
        deleted_by: userId,
        deleted_at: Date.now(),
        updated_by: userId,
      });
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy bệnh nhân trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getPotential(input) {
    try {
      const { limit, value } = input;
      const result = await Patient.find({
        $and: [{ "active": true }, { "total_money": { $gte: +value } }],
      })
        .sort({ "total_money": -1 })
        .limit(+limit);
      return {
        code: 200,
        result,
      };
    } catch (err) {
      return error_500();
    }
  }
}

export default new PatientService();
