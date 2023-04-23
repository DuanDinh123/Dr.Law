import { error_500 } from "~/constant/error-handle";

import SupplierService from "./supplier.service";
class SupplierController {
  async createSupplier(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await SupplierService.createSupplier(userId, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getSuppliers(req, res) {
    try {
      const response = await SupplierService.getSuppliers(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getSupplier(req, res) {
    try {
      const { id } = req.params;
      const response = await SupplierService.getSupplier(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateSupplier(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await SupplierService.updateSupplier(userId, id, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteSupplier(req, res) {
    try {
      const { id } = req.params;
      const response = await SupplierService.deleteSupplier(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new SupplierController();