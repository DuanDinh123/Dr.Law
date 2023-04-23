import { error_500 } from "~/constant/error-handle";

import RoleService from "./role.service";
class RoleController {
    async createRole(req, res) {
        try {
            const response = await RoleService.createRole(req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteRole(req, res) {
        try {
            const { id } = req.params;
            const response = await RoleService.deleteRole(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getRole(req, res) {
        try {
            const { id } = req.params;
            const response = await RoleService.getRole(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getRoles(req, res) {
        try {
            const response = await RoleService.getRoles(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const response = await RoleService.updateRole(id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getRolesByUserId(req, res) {
        try {
            const { id } = req.params;
            const response = await RoleService.getRolesByUserId(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new RoleController();