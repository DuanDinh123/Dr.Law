import { error_500 } from "~/constant/error-handle";

import CategoryService from "./category.service";
class CategoryController {
    async createCategory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const response = await CategoryService.createCategory(userId, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const response = await CategoryService.deleteCategory(id);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getCategory(req, res) {
        try {
            const { id } = req.params;
            const response = await CategoryService.getCategory(id);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async getCategories(req, res) {
        try {
            const response = await CategoryService.getCategories(req.query);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async updateCategory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await CategoryService.updateCategory(userId, id, req.body);
            return res.status(response.code).send(response ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async assignSuppliesToCategory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await CategoryService.assignSuppliesToCategory(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async removeSuppliesToCategory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await CategoryService.removeSuppliesToCategory(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async assignSupplieToCategory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await CategoryService.assignSupplieToCategory(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }

    async removeSupplieToCategory(req, res) {
        try {
            const { id: userId } = req.decodedUser;
            const { id } = req.params;
            const response = await CategoryService.removeSupplieToCategory(userId, id, req.body);
            return res.status(response.code).send(response.result ?? { ...response });
        } catch (error) {
            return error_500();
        }
    }
}

export default new CategoryController();