import { error_500 } from "~/constant/error-handle";

import BankService from "./bank.service";

class BankController {
    async createBank(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await BankService.createBank(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getBanks(req, res) {
        try {
            const response = await BankService.getBanks(req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateBank(req, res) {
        try {
            const { id } = req.params;
            const { id: userId } = req.decodedUser;
            const response = await BankService.updateBank(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteBank(req, res) {
        try {
            const { id } = req.params;
            const { id: userId } = req.decodedUser;
            const response = await BankService.deleteBank(id, userId);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getBankByUserId(req, res) {
        try {
            const { id } = req.params;
            const response = await BankService.getBankByUserId(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteBankByUserId(req, res) {
        try {
            const { id } = req.params;
            const response = await BankService.deleteBankByUserId(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new BankController();