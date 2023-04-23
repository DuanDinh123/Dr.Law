import { error_500 } from "~/constant/error-handle";

import StatusService from "./status.service";

class StatusController {
    async createStatus(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await StatusService.createStatus(userId, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getStatuses(req, res) {
        try {
            const response = await StatusService.getStatuses(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getStatus(req, res) {
        try {
            const { id } = req.params;
            const response = await StatusService.getStatus(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateStatus(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await StatusService.updateStatus(userId, id, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteStatus(req, res) {
        try {
            const { id } = req.params;
            const response = await StatusService.deleteStatus(id);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new StatusController();