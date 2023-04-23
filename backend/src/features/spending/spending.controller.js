import { error_500 } from "~/constant/error-handle";

import SpendingService from "./spending.sevices";
class SpendingController {
  async createSpending(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await SpendingService.createSpending(userId, req.body);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getSpendings(req, res) {
    try {
      const response = await SpendingService.getSpendings(req.query);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getSpending(req, res) {
    try {
      const { id } = req.params;
      const response = await SpendingService.getSpending(id);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateSpending(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await SpendingService.updateSpending(
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

  async deleteSpending(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await SpendingService.deleteSpending(userId, id);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new SpendingController();
