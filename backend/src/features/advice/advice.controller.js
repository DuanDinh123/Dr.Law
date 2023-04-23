import { error_500 } from "~/constant/error-handle";

import AdviceService from "./advice.service";
class AdviceController {
  async createAdvice(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await AdviceService.createAdvice(userId, req.body);
      return res.status(response.code).send(response ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getAdvices(req, res) {
    try {
      const response = await AdviceService.getAdvices(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getAdvice(req, res) {
    try {
      const { id } = req.params;
      const response = await AdviceService.getAdvice(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateAdvice(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await AdviceService.updateAdvice(userId, id, req.body);
      return res.status(response.code).send(response ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteAdvice(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = req.decodedUser;
      const response = await AdviceService.deleteAdvice(userId, id);
      return res.status(response.code).send(response ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new AdviceController();