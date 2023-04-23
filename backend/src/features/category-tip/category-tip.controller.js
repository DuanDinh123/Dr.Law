import { error_500 } from "~/constant/error-handle";

import CategoryTipService from "./category-tip.service";
class CategoryTipController {
  async createCategoryTip(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await CategoryTipService.createCategoryTip(userId, req.body);
      return res.status(response.code).send(response ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getCategoryTips(req, res) {
    try {
      const response = await CategoryTipService.getCategoryTips(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getCategoryTip(req, res) {
    try {
      const { id } = req.params;
      const response = await CategoryTipService.getCategoryTip(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateCategoryTip(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await CategoryTipService.updateCategoryTip(userId, id, req.body);
      return res.status(response.code).send(response ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteCategoryTip(req, res) {
    try {
      const { id } = req.params;
      const response = await CategoryTipService.deleteCategoryTip(id);
      return res.status(response.code).send(response ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new CategoryTipController();