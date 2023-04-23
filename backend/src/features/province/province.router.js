import express from "express";

import ProvinceController from "./province.controller";

const provinceRouter = express.Router();
provinceRouter.get("/", ProvinceController.getProvinces);
provinceRouter.get("/p/:provinceId", ProvinceController.getProvincesById);
provinceRouter.get("/dbp/:provinceId/:districtId", ProvinceController.getDistrictById);
provinceRouter.get("/wbd/:provinceId/:districtId/:wardId", ProvinceController.getWardById);
provinceRouter.get("/d/:provinceId", ProvinceController.getDistrictsByProvince);
provinceRouter.get("/w/:provinceId/:districtId", ProvinceController.getWardsByDistrict);

export default provinceRouter;
