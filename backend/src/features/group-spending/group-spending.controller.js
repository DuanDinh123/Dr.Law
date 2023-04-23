import { error_500 } from "~/constant/error-handle";

import GroupSpendingService from "./group-spending.sevices";
class GroupSpendingController {
  async createGroupSpending(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await GroupSpendingService.createGroupSpending(
        userId,
        req.body
      );
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSpendings(req, res) {
    try {
      const response = await GroupSpendingService.getGroupSpendings(req.query);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSpending(req, res) {
    try {
      const { id } = req.params;
      const response = await GroupSpendingService.getGroupSpending(id);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateGroupSpending(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await GroupSpendingService.updateGroupSpending(
        userId,
        id,
        req.body
      );
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteGroupSpending(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await GroupSpendingService.deleteGroupSpending(
        userId,
        id
      );
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new GroupSpendingController();
