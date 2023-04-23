import { error_500 } from "~/constant/error-handle";

import AuthService from "./auth.service";
class AuthController {
    async register(req, res) {
        try {
            const response = await AuthService.register(req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async login(req, res) {
        try {
            const response = await AuthService.login(req.body, res);
            return res.status(response.code).send(response.result ?? { ...response, ...response.type && { type: response.type } });
        } catch (error) {
            return error_500();
        }
    }

    async logout(req, res) {
        try {
            const response = await AuthService.logout(req, res);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async refreshToken(req, res) {
        try {
            const response = await AuthService.refreshToken(req, res);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new AuthController();