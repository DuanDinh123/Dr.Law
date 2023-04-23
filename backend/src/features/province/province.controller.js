import { error_500 } from "~/constant/error-handle";

import ProvinceService from "./province.service";
class ProvinceController {
  async getProvinces(req, res) {
    try {
      const response = await ProvinceService.getProvinces();
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getProvincesById(req, res) {
    try {
      const { provinceId } = req.params;
      const response = await ProvinceService.getProvincesById(provinceId);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getDistrictsByProvince(req, res) {
    try {
      const { provinceId } = req.params;
      const response = await ProvinceService.getDistrictsByProvince(provinceId);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getWardsByDistrict(req, res) {
    try {
      const { provinceId, districtId } = req.params;
      const response = await ProvinceService.getWardsByDistrict(provinceId, districtId);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getDistrictById(req, res) {
    try {
      const { provinceId, districtId } = req.params;
      const response = await ProvinceService.getDistrictById(provinceId, districtId);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }

  async getWardById(req, res) {
    try {
      const { provinceId, districtId, wardId } = req.params;
      const response = await ProvinceService.getWardById(provinceId, districtId, wardId);
      return res.status(response.code).send(response.result ?? { ...response });
    } catch (error) {
      return error_500();
    }
  }
}

export default new ProvinceController();