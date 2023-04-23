import { error_500 } from "~/constant/error-handle";

import PrescriptionService from "./prescription.service";
class PrescriptionController {
  async createPrescription(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await PrescriptionService.createPrescription(userId, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getPrescriptions(req, res) {
    try {
      const response = await PrescriptionService.getPrescriptions(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getPrescription(req, res) {
    try {
      const { id } = req.params;
      const response = await PrescriptionService.getPrescription(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updatePrescription(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await PrescriptionService.updatePrescription(userId, id, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deletePrescription(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await PrescriptionService.deletePrescription(userId, id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new PrescriptionController();