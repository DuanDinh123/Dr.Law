import { error_500 } from "~/constant/error-handle";

import FundService from "./fund.sevice";
class FundController {
  async createFund(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await FundService.createFund(userId, req.body);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getFunds(req, res) {
    try {
      const response = await FundService.getFunds(req.query);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getFund(req, res) {
    try {
      const { id } = req.params;
      const response = await FundService.getFund(id);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateFund(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await FundService.updateFund(userId, id, req.body);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteFund(req, res) {
    try {
      const { id } = req.params;
      const response = await FundService.deleteFund(id);
      return res
        .status(response.code)
        .send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new FundController();
