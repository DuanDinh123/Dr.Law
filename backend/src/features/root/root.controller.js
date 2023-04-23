import { error_500 } from "~/constant/error-handle";

import RootService from "./root.service";

class RootController {
    async createRoot(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await RootService.createRoot(userId, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getRoots(req, res) {
        try {
            const response = await RootService.getRoots(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getRoot(req, res) {
        try {
            const { id } = req.params;
            const response = await RootService.getRoot(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateRoot(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await RootService.updateRoot(userId, id, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteRoot(req, res) {
        try {
            const { id } = req.params;
            const response = await RootService.deleteRoot(id);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new RootController();