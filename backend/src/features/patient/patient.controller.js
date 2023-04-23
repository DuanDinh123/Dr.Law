import { error_500 } from "~/constant/error-handle";

import PatientService from "./patient.sevice";
class PatientController {
  async createPatient(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const response = await PatientService.createPatient(userId, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getPatients(req, res) {
    try {
      const response = await PatientService.getPatients(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getPatient(req, res) {
    try {
      const { id } = req.params;
      const response = await PatientService.getPatient(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updatePatient(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await PatientService.updatePatient(userId, id, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deletePatient(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await PatientService.deletePatient(userId, id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getPotential(req, res) {
    try {
      const response = await PatientService.getPotential(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new PatientController();