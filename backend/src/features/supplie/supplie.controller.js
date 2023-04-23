import { error_500 } from "~/constant/error-handle";

import SupplieService from "./supplie.service";
class SupplieController {
    async createSupplie(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await SupplieService.createSupplie(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteSupplie(req, res) {
        try {
            const { id } = req.params;
            const response = await SupplieService.deleteSupplie(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateSupplie(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await SupplieService.updateSupplie(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getSupplie(req, res) {
        try {
            const { id } = req.params;
            const response = await SupplieService.getSupplie(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getSupplies(req, res) {
        try {
            const response = await SupplieService.getSupplies(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
    
    async getSuppliesByGroupSupplie(req, res) {
      try {
        const response = await SupplieService.getSuppliesByGroupSupplie(req.query);
        return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
        return error_500();
    }
    }
}

export default new SupplieController();