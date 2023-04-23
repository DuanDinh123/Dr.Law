import { error_500 } from "~/constant/error-handle";

import MedicalHistoryService from "./medical-history.service";

class MedicalHistoryController {
    async createMedicalHistory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await MedicalHistoryService.createMedicalHistory(userId, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getMedicalHistoies(req, res) {
        try {
            const response = await MedicalHistoryService.getMedicalHistories(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getMedicalHistory(req, res) {
        try {
            const { id } = req.params;
            const response = await MedicalHistoryService.getMedicalHistory(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateMedicalHistory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await MedicalHistoryService.updateMedicalHistory(userId, id, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteMedicalHistory(req, res) {
        try {
            const { id } = req.params;
            const response = await MedicalHistoryService.deleteMedicalHistory(id);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}
export default new MedicalHistoryController();