import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Medical from "../medical-information-register/medical.model";
import Supplie from "../supplie/supplie.model";
import Tip from "../tip/tip.model";
import User from "../user/user.model";
import Salary from "./salary.model";
class SalaryService {
  async revenueStatistics(input) {
    try {
      const { startDate, endDate } = input;
      let startDateFormat;
      let endDateFormat;
      if (startDate && endDate) {
        if (startDate === endDate) {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          startDateFormat = startDate;
          endDateFormat = endDate;
        } else {
          startDateFormat = startDate;
          endDateFormat = endDate;
        }
      } else {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDateFormat = startDate;
        endDateFormat = endDate;
      }
      const list_medical = await Medical.find({
        created_at: {
          $gte: startDateFormat,
          $lt: endDateFormat
        }
      });
      let total_revenue_statistics = 0;
      const list_supplies = [];
      if (list_medical) {
        for (let x = 0; x < list_medical.length; x++) {
          const tip_value = await Tip.findOne({
            _id: list_medical[x].tip_id
          });
          if (tip_value) {
            total_revenue_statistics += tip_value.price;
            for (let y = 0; y < list_medical[x].supplies.length; y++) {
              list_supplies.push(list_medical[x].supplies[y]);
            }
          }
        }
      }
      let total_expenditure_statistics = 0;
      for (let i = 0; i < list_supplies.length; i++) {
        const result_supplie = await Supplie.findOne({ _id: list_supplies[i].id });
        if (result_supplie && result_supplie.price) {
          total_expenditure_statistics += result_supplie.price * list_supplies[i].quantity;
        } else {
          total_expenditure_statistics = 0;
        }
      }
      return {
        code: 200,
        result: {
          "total_revenue_statistics": total_revenue_statistics,//thu
          "total_expenditure_statistics": total_expenditure_statistics,//chi
        }
      };
    } catch (err) {
      return error_500();
    }
  }

  async revenueByUser(input) {
    try {
      const { startDate, endDate } = input;
      let startDateFormat;
      let endDateFormat;
      if (startDate && endDate) {
        startDateFormat = startDate;
        endDateFormat = endDate;
      } else {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDateFormat = startDate;
        endDateFormat = endDate;
      }
      const list_user = await User.find();
      const list_revenue_user = [];
      for (let i = 0; i < list_user.length; i++) {
        let total_reveue = 0;
        let collected = 0;
        const list_medical = await Medical.find({
          created_by: list_user[i].id,
          created_at: {
            $gte: startDateFormat,
            $lt: endDateFormat
          }
        });
        if (list_medical) {
          for (let x = 0; x < list_medical.length; x++) {
            const tip_value = await Tip.findOne({
              _id: list_medical[x].tip_id
            });
            if (tip_value) {
              let total = Number(tip_value.price) * Number(list_medical[x].quantity_tip);
              total_reveue += total;
              let value_supplie = list_medical[x].supplies;
              for (let y = 0; y < value_supplie.length; y++) {
                const result_supplie = await Supplie.findById(value_supplie[y].id);
                if (result_supplie) {
                  const price_attrition = result_supplie.price - result_supplie.price_attrition;
                  collected += price_attrition * value_supplie[y].quantity;
                } else {
                  collected = 0;
                }
              }
            }
          }
        }
        const result_salary = await Salary.findOne({ user: list_user[i].id, deleted_at: null });
        let ratio = 0;
        if (result_salary) {
          ratio = result_salary.bonus_revenue / 100;
        }
        let total_collected = total_reveue - collected;
        let attrition = total_reveue - total_collected;
        let total_money = total_collected - attrition;
        list_revenue_user.push({
          "user": {
            "id": list_user[i].id,
            "name": list_user[i].name,
            "email": list_user[i].email,
            "cardID": list_user[i].cardID,
          },
          "revenue": total_reveue, //tong doanh thu
          "total_collected": total_collected,//da thu
          "attrition": attrition,//tieu hao
          "total_money": total_money,//tong tien
          "percentage_bonus": result_salary ? result_salary.bonus_revenue : 0,//phần trăm thưởng
          "revenue_bonus": Math.floor(total_money * ratio),//thưởng doanh thu
        });
      }
      return {
        code: 200,
        result: list_revenue_user,
      };
    } catch (err) {
      return error_500();
    }
  }

  async createSalary(userId, input) {
    try {
      const { user, wage, work_day, bonus_sale, bonus_revenue, allowance } = input;
      if (user) {
        const isCardNumberExist = await Salary.findOne({ user });
        if (isCardNumberExist) {
          return {
            code: 400,
            isValidate: false,
            message: "Lương của người dùng đã tồn tại trong hệ thống!",
          };
        }
      }
      const salary = new Salary({
        user,
        ...(wage && { wage }),
        ...(work_day && { work_day }),
        ...(bonus_sale && { bonus_sale }),
        ...(bonus_revenue && { bonus_revenue }),
        ...(allowance && { allowance }),
        created_at: Date.now(),
        created_by: userId,
        updated_by: userId,
      });
      const result = await salary.save().then((salary) =>
        salary.populate([
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
    } catch (err) {
      return error_500();
    }
  }

  async getSalaries(input) {
    try {
      const result = await Salary.paginate(
        {
          deleted_at: null,
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
    } catch (err) {
      return error_500();
    }
  }

  async deleteSalary(id) {
    try {
      const result = await Salary.findByIdAndRemove(id);
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy lương trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getSalary(id) {
    try {
      const result = await Salary.findById(id).populate([
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
        message: "Không tìm thấy lương của người dùng trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }
  async updateSalary(userId, id, input) {
    try {
      const { wage, work_day, bonus_sale, bonus_revenue, allowance } = input;

      const result = await Salary.findByIdAndUpdate(
        id,
        {
          wage,
          ...(work_day && { work_day }),
          ...(bonus_sale && { bonus_sale }),
          ...(bonus_revenue && { bonus_revenue }),
          ...(allowance && { allowance }),
          updated_by: userId,
        },
        {
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
      if (result) {
        return {
          code: 200,
          result,
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy Luong trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async getSalaryByUserId(id) {
    try {
      const result = await Salary.findOne({ user: id }).populate([
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
        message: "Không tìm lương của người dùng này trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }

  async deleteSalaryByUserId(id) {
    try {
      const result = await Salary.findOneAndRemove({ user: id }).populate([
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
        message: "Không tìm thấy lương người dùng này trong hệ thống!",
      };
    } catch (error) {
      return error_500();
    }
  }
}

export default new SalaryService();
