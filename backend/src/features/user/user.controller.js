import { error_500 } from "~/constant/error-handle";

import UserService from "./user.service";

export default new class UserController {
  async getUsers(req, res) {
    try {
      const response = await UserService.getUsers(req.query);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const response = await UserService.getUser(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const response = await UserService.deleteUser(id);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async updateUser(req, res) {
    try {
      const { id: userId } = req.decodedUser;
      const { id } = req.params;
      const response = await UserService.updateUser(id, userId, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async assignRolesToUser(req, res) {
    try {
      const { id } = req.params;
      const response = await UserService.assignRolesToUser(id, req.body);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
};