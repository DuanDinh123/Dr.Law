import { error_500 } from "~/constant/error-handle";

import GroupSupplieService from "./group-supplie.sevices";
class GroupSupplieController {
  async createGroupSupplie(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await GroupSupplieService.createGroupSupplie(
        userId,
        req.body
      );
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSupplies(req, res) {
    try {
      const response = await GroupSupplieService.getGroupSupplies(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getGroupSupplie(req, res) {
    try {
      const { id } = req.params;
      const response = await GroupSupplieService.getGroupSupplie(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateGroupSupplie(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await GroupSupplieService.updateGroupSupplie(
        userId,
        id,
        req.body
      );
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteGroupSupplie(req, res) {
    try {
      const { id } = req.params;
      const response = await GroupSupplieService.deleteGroupSupplie(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new GroupSupplieController();
