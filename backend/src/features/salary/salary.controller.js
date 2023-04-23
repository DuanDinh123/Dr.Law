import { error_500 } from "~/constant/error-handle";

import SalaryService from "./salary.service";
class SalaryController {
    async revenueStatistics(req, res) {
        try {
            const response = await SalaryService.revenueStatistics(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async revenueByUser(req, res) {
        try {
            const response = await SalaryService.revenueByUser(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async createSalary(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await SalaryService.createSalary(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteSalary(req, res) {
        try {
            const { id } = req.params;
            const response = await SalaryService.deleteSalary(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getSalary(req, res) {
        try {
            const { id } = req.params;
            const response = await SalaryService.getSalary(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getSalaries(req, res) {
        try {
            const response = await SalaryService.getSalaries(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }

    async updateSalary(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await SalaryService.updateSalary(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    }

    async getSalaryByUserId(req, res) {
        try {
            const { id } = req.params;
            const response = await SalaryService.getSalaryByUserId(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteSalaryByUserId(req, res) {
        try {
            const { id } = req.params;
            const response = await SalaryService.deleteSalaryByUserId(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new SalaryController();