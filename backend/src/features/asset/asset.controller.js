import { error_500 } from "~/constant/error-handle";

import AssetService from "./asset.service";
class AssetController {
    async createAssets(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await AssetService.createAssets(userId, req.headers.host, req.files);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteAsset(req, res) {
        try {
            const { id } = req.params;
            const response = await AssetService.deleteAsset(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getAsset(req, res) {
        try {
            const { id } = req.params;
            const response = await AssetService.getAsset(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getAssets(req, res) {
        try {
            const response = await AssetService.getAssets(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new AssetController();