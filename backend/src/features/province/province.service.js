
import { error_500 } from "~/constant/error-handle";

import Provinces from "./province.model";

class ProvinceService {
  async getProvinces() {
    try {
      const result = [];
      Provinces?.map(item => {
        const newProvince = {
          name: item.name,
          code: item.code,
          codename: item.codename,
          division_type: item.division_type,
          phone_code: item.phone_code,
        };
        // delete item.districts;
        result.push(newProvince);
      });

      if (result) {
        return {
          code: 200,
          result
        };
      }
    } catch (error) {
      return error_500();
    }
  }

  async getProvincesById(provincesId) {
    try {
      const data = Provinces.filter(item => item.code == provincesId);

      if (data.length > 0) {
        const result = {
          name: data[0].name,
          code: data[0].code,
          codename: data[0].codename,
          division_type: data[0].division_type,
          phone_code: data[0].phone_code,
        };
        return {
          code: 200,
          result
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy"
      };
    } catch (error) {
      return error_500();
    }
  }

  async getDistrictById(provincesId, districtsId) {
    try {
      const province = Provinces.filter(item => item.code == provincesId);

      if (province.length > 0) {
        const data = province[0].districts.filter(item => item.code == districtsId);
        if (data.length > 0) {
          const result = {
            name: data[0].name,
            code: data[0].code,
            codename: data[0].codename,
            division_type: data[0].division_type,
            short_codename: data[0].short_codename,
          };
          return {
            code: 200,
            result
          };
        }
        return {
          code: 400,
          isValidate: false,
          message: "Không tìm thấy"
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy"
      };
    } catch (error) {
      return error_500();
    }
  }

  async getWardById(provinceId, districtId, wardId) {
    try {
      let districts;
      let wards;
      const provinces = Provinces.filter(item => item.code == provinceId);

      if (provinces.length > 0) {
        districts = provinces[0].districts.filter(item => item.code == districtId);
      }

      if (districts.length > 0) {
        wards = districts[0].wards.filter(item => item.code == wardId);
      }
      
      if(wards.length > 0) {
        return {
          code: 200,
          result: wards[0]
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy"
      };
    } catch (error) {
      return error_500();
    }
  }

  async getDistrictsByProvince(provinceId) {
    try {
      const result = [];
      const provincesData = [...Provinces];
      const provinces = provincesData.filter(item => item.code == provinceId);

      if (provinces.length > 0 && provinces[0].districts) {
        provinces[0].districts.forEach(item => {
          const newDistrict = {
            name: item.name,
            code: item.code,
            codename: item.codename,
            division_type: item.division_type,
            short_codename: item.short_codename,
          };
          result.push(newDistrict);
        });
      }

      if (result.length > 0) {
        return {
          code: 200,
          result
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy"
      };
    } catch (error) {
      return error_500();
    }
  }

  async getWardsByDistrict(provinceId, districtId) {
    try {
      const districts = [];
      let wards;
      const provinces = Provinces.filter(item => item.code == provinceId);

      if (provinces.length > 0) {
        provinces[0].districts.forEach(item => {
          districts.push(item);
        });
      }

      if (districts.length > 0) {
        wards = districts.filter(item => item.code == districtId);
      }

      if (wards.length > 0) {
        return {
          code: 200,
          result: wards[0].wards
        };
      }
      return {
        code: 400,
        isValidate: false,
        message: "Không tìm thấy"
      };
    } catch (error) {
      return error_500();
    }
  }
}

export default new ProvinceService();