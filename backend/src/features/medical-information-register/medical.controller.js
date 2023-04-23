import { error_500 } from "~/constant/error-handle";

import MedicalService from "./medical.service";

class MedicalController {
    async addPrescription(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await MedicalService.addPrescription(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (err) {
            return error_500();
        }
    }
    async payment(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await MedicalService.payment(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (err) {
          
            return error_500();
        }
    }
    async createMedical(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await MedicalService.createMedical(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getMedicals(req, res) {
        try {
            const response = await MedicalService.getMedicals(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getMedical(req, res) {
        try {
            const { id } = req.params;
            const response = await MedicalService.getMedical(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
    async detailTipByUser(req, res) {
        try {
            const response = await MedicalService.detailTipByUser(req.query);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
    async updateMedical(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await MedicalService.updateMedical(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteMedical(req, res) {
        try {
            const { id } = req.params;
            const { id: userId } = req.decodedUser;
            const response = await MedicalService.deleteMedical(userId, id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new MedicalController();