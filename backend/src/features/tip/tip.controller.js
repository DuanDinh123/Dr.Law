import { error_500 } from "~/constant/error-handle";

import TipService from "./tip.service";
class TipController {
  async createTip(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await TipService.createTip(userId, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getTips(req, res) {
    try {
      const response = await TipService.getTips(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getTip(req, res) {
    try {
      const { id } = req.params;
      const response = await TipService.getTip(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateTip(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await TipService.updateTip(userId, id, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteTip(req, res) {
    try {
      const { id } = req.params;
      const { id: userId } = req.decodedUser;
      const response = await TipService.deleteTip(userId, id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new TipController();

