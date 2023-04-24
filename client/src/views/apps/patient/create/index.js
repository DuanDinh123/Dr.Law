import React, { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";

// ** Reactstrap Imports
import {
  Button,
  Label,
  FormText,
  Form,
  Input,
  Card,
  CardBody,
  CardHeader,
  BreadcrumbItem,
  Breadcrumb,
  Spinner,
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import {
  createPatient,
  deleteMedical,
  getDistrict,
  getMedicalList,
  getPatient,
  getProvince,
  getRootList,
  getWards,
  updatePatient,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { toast } from "react-hot-toast";
import makeAnimated from "react-select/animated";
import Select from "react-select";

// ** Utility Import
import { selectThemeColors } from "@utils";
import NoDataFound from "../../../components/NoDataFound";

import DataTable from "react-data-table-component";

// ** Styles
import "@styles/react/libs/tables/react-dataTable-component.scss";
import {
  Archive,
  DollarSign,
  MoreVertical,
  Trash2,
  Settings,
} from "react-feather";

const animatedComponents = makeAnimated();

function PatientCreate() {
  const [countrySelect, setCountrySelect] = useState({
    choose: "province",
    id: null,
  });
  const [isSubmited, setIsSubmited] = useState(false);
  const { id } = useParams();

  // ** Store Vars
  const store = useSelector((state) => state.patient);

  const basicColumns = () => [
    {
      name: "TT",
      maxWidth: "15px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Giờ khám",
      maxWidth: "80px",
      selector: (row) => moment(row.medical_examination_day).format("HH:MM"),
    },
    {
      name: "Ngày",
      maxWidth: "120px",
      selector: (row) =>
        moment(row.medical_examination_day).format("DD/MM/YYYY"),
    },
    {
      name: "Triệu chứng/Chẩn đoán",
      minWidth: "225px",
      selector: (row) => (
        <div>
          <div className="font-weight-bold text-truncate">
            Triệu chứng: {row.symptom}
          </div>
          <div className="font-weight-bold text-danger text-truncate">
            Chẩn đoán: {row.diagnose}
          </div>
        </div>
      ),
    },
    {
      name: "Thủ thuật điều trị",
      minWidth: "220px",
      selector: (row) => row.tip_id && row.tip_id.name_tip,
    },
    {
      name: "Ghi chú",
      minWidth: "200px",
      selector: (row) => row.note,
    },
    {
      name: "Trạng thái",
      minWidth: "100px",
      selector: (row) => row.status && row.status.name,
    },
    {
      name: "Thanh toán",
      minWidth: "100px",
      selector: (row) => row.pay_status,
    },
    {
      name: "Chức năng",
      allowOverflow: true,
      minWidth: "175px",
      selector: (row) => (
        <div className="column-action">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" className="btn btn-sm">
              <MoreVertical size={14} className="cursor-pointer" />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                tag="a"
                href={`/apps/medical/detail/${row._id}`}
                className="w-100"
              >
                <Settings size={14} className="me-50" />
                <span className="align-middle">Chi tiết</span>
              </DropdownItem>
              {row.pay_status === "Đã thanh toán" ? null : (
                <DropdownItem
                  tag="a"
                  href={`/apps/payment/create/${row._id}`}
                  className="w-100"
                >
                  <DollarSign size={14} className="me-50" />
                  <span className="align-middle">Thanh toán</span>
                </DropdownItem>
              )}

              <DropdownItem
                tag="a"
                href={`/apps/medical/edit/${row._id}`}
                className="w-100"
              >
                <Archive size={14} className="me-50" />
                <span className="align-middle">Sửa</span>
              </DropdownItem>
              <DropdownItem
                tag="a"
                href="/"
                className="w-100"
                onClick={(e) => {
                  dispatch(
                    deleteMedical({ medicalId: row._id, patientid: id })
                  );
                  // toggle()
                  e.preventDefault();
                }}
              >
                <Trash2 size={14} className="me-50" />
                <span className="align-middle">Xóa</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ),
    },
  ];

  const defaultValues = {
    name: undefined,
    date_of_birth: undefined,
    gender: undefined,
    address: undefined,
    address_text: undefined,
    email: undefined,
    root: undefined,
    root_description: undefined,
    phone: undefined,
    detailAddress: undefined,
    province: undefined,
    district: undefined,
    wards: undefined,
    cardID: undefined,
    field: undefined,
  };

  const renderRole = () => {
    if (!store.rootList.loading && store.rootList.data.docs) {
      return store.rootList.data?.docs.map((root) => {
        return {
          value: root._id,
          label: root.name,
        };
      });
    }
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProvince());
    dispatch(getRootList());
  }, []);

  useEffect(() => {
    console.log("id", id)
    if(id) {
      dispatch(getPatient(id));
      dispatch(getMedicalList(id));
    }
  }, [id]);

  const {
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Function to handle form submit
  const onSubmit = (data) => {
    const permissions = Object.keys(data)?.filter((key) => data[key] === true);
    const { province, district, wards, detailAddress } = data;
    const provinceName = store.province.data?.find(
      (country) => country.code.toString() === province
    );
    const districtName = store.district.data?.find(
      (country) => country.code.toString() === district
    );
    const wardsName = store.wards.data?.find(
      (country) => country.code.toString() === wards
    );
    const fomatDate = moment(data.date_of_birth).toISOString();

    let addressText = `${detailAddress} ${wardsName?.name} ${districtName?.name} ${provinceName?.name}`;
    if (addressText?.includes("undefined")) {
      addressText = addressText.replaceAll("undefined", "");
    }

    if (!id) {
      dispatch(
        createPatient({
          name: data.name,
          address: `${data?.detailAddress}-${data?.wards}-${data?.district}-${data?.province}`,
          address_text: addressText,
          email: data.email,
          phone: data.phone,
          date_of_birth: fomatDate,
          cardID: data.cardID,
          gender: Boolean(data.gender),
          root: data.root.value,
          root_description: data.root_description,
          permissions,
        })
      );
    } else {
      dispatch(
        updatePatient({
          id: id,
          patient: {
            name: data.name,
            date_of_birth: data.date_of_birth,
            gender: data.gender,
            cardID: data.cardID,
            address: `${data?.detailAddress}-${data?.ward}-${data?.district}-${data?.province}`,
            address_text: addressText,
            email: data.email,
            phone: data.phone,
            root: data.root.value,
            root_description: data.root_description,
            permissions,
          },
        })
      );
    }

    setIsSubmited(true);
  };

  const handleChangeProvince = (provinceId) => {
    setValue("district", "");
    setValue("wards", "");
    dispatch(getDistrict(provinceId));
    if (provinceId) {
      setCountrySelect(provinceId);
    }
  };

  const handleChangeDistrict = (districtId) => {
    setValue("wards", "");
    dispatch(getWards({ districtId: districtId, provinceId: countrySelect }));
  };

  // ** Bảng thủ thuật
  const dataToRender = () => {
    if (!store.medical.loading && store.medical.data?.docs) {
      console.log("store.medical.data?.docs", store.medical.data?.docs)
      return store.medical.data.docs;
    } else {
      return [];
    }
  };

  useEffect(() => {
    // ** Tạo bệnh nhân
    if (
      !store.createPatient.loading &&
      isSubmited &&
      !store.createPatient.error &&
      !id
    ) {
      setIsSubmited(false);
      navigate("/apps/patient/list");
      toast.success("Thêm bệnh nhân thành công!");
    }
    // ** Check tạo bệnh nhân nếu có lỗi
    if (!store.createPatient.loading && store.createPatient.error) {
      setIsSubmited(false);
      if (store.createPatient.data.isValidate) {
        store.createPatient.data.errors.forEach((error) => {
          setError(error.fieldError, { message: error.message });
        });
      } else {
        toast.error(store.createPatient.data.message);
      }
    }
  }, [isSubmited, store.createPatient.loading, store.createPatient.error, id]);

  useEffect(() => {
    // ** Cập nhật bệnh nhân
    if (
      !store.updatePatient.loading &&
      isSubmited &&
      id &&
      !store.updatePatient.error &&
      id
    ) {
      setIsSubmited(false);
      toast.success("Cập nhật hồ sơ bệnh nhân thành công!");
    }
    // ** Check cập nhật bệnh nhân nếu có lỗi
    if (!store.updatePatient.loading && store.updatePatient.error && id) {
      setIsSubmited(false);
      if (store.updatePatient.data?.isValidate) {
        store.updatePatient.data?.errors.forEach((error) => {
          setError(error.fieldError, { message: error.message });
        });
      } else {
        toast.error(store.updatePatient.data?.message);
      }
    }
  }, [
    store.updatePatient.loading,
    isSubmited,
    store.updatePatient.error,
    setIsSubmited,
    setError,
    id,
  ]);

  useEffect(() => {
    if (store.getPatient.data && !store.getPatient.loading && id) {
      const {
        name,
        date_of_birth,
        gender,
        cardID,
        address,
        email,
        phone,
        root,
        root_description,
      } = store.getPatient.data;
      const fomatDate = moment(date_of_birth).locale("en").format("YYYY-MM-DD");
      const arrayAddress = address ? address.split("-") : null;
      const detailAddress = arrayAddress ? arrayAddress[0] : null;
      const province = arrayAddress ? arrayAddress[3] : "";
      const district = arrayAddress ? arrayAddress[2] : "";
      const ward = arrayAddress ? arrayAddress[1] : "";

      dispatch(getDistrict(province));
      if (province) {
        setCountrySelect(province);
      }

      dispatch(getWards({ districtId: district, provinceId: province }));

      setValue("name", name);
      setValue("date_of_birth", fomatDate);
      setValue("gender", gender);
      setValue("province", province == "undefined" ? "" : province);
      setValue("district", district);
      setValue("wards", ward);
      setValue("cardID", cardID);
      setValue(
        "detailAddress",
        detailAddress != "undefined" ? detailAddress : ""
      );
      setValue("email", email);
      setValue("phone", phone);
      root && setValue("root", { value: root._id, label: root.name });
      setValue("root_description", root_description);
    }
  }, [store.getPatient.data, store.getPatient.loading]);

  useEffect(() => {
    if (
      store?.rootList?.data &&
      store?.rootList?.data?.docs &&
      store?.rootList?.data?.docs.length > 0
    ) {
      setValue("root", {
        value: store.rootList?.data?.docs[0]._id,
        label: store.rootList?.data?.docs[0].name,
      });
    }
  }, []);

  console.log("store", store);

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className="mb-1">
          <BreadcrumbItem>
            <Link to="/dashboard/analytics"> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/apps/patient/list"> Danh sách bệnh nhân </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> {!id ? "Tạo mới" : "Sửa"} </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {!id ? "Đăng kí hồ sơ bệnh nhân" : "Sửa hồ sơ bệnh nhân"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="mb-1 col-7 mr-2">
                <Label className="form-label" for="name">
                  Tên khách hàng {!id && <span className="text-danger">*</span>}
                </Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="John Doe"
                      invalid={errors.name && true}
                      style={{ marginBottom: "0.5rem" }}
                      {...field}
                    />
                  )}
                />
                {errors?.name ? (
                  <span className="text-danger mt-1">
                    {errors.name?.type === "required"
                      ? "Trường này bắt buộc nhập!"
                      : errors.name.message}
                  </span>
                ) : null}
              </div>
              <div className="mb-1 col-5">
                <Label className="form-label" for="date_of_birth">
                  Ngày sinh
                </Label>
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="date_of_birth"
                      type="date"
                      invalid={errors.date_of_birth && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-1 col-7 mr-2">
                <Label className="form-label" for="root">
                  Nguồn {!id && <span className="text-danger">*</span>}
                </Label>
                <Controller
                  name="root"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => (
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      options={renderRole()}
                      className="react-select"
                      classNamePrefix="select"
                      value={value}
                      {...other}
                    />
                  )}
                />
                {errors?.root ? (
                  <span className="text-danger mt-1">
                    {errors.root?.type === "required"
                      ? "Trường này bắt buộc nhập!"
                      : errors.root.message}
                  </span>
                ) : null}
              </div>
              <div className="mb-1 col-5">
                <Label className="form-label" for="root_description">
                  Ghi chú nguồn
                </Label>
                <Controller
                  name="root_description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      row="1"
                      invalid={errors.root_description && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-1 col-4">
                <Label className="form-label" for="phone">
                  Di động
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="0938479328"
                      invalid={errors.phone && true}
                      style={{ marginBottom: "0.5rem" }}
                      {...field}
                    />
                  )}
                />
                {errors?.phone ? (
                  <span className="text-danger">
                    {errors.phone?.type === "required"
                      ? "Trường này bắt buộc nhập!"
                      : errors.phone.message}
                  </span>
                ) : null}
              </div>
              <div className="mb-1 col-4">
                <Label className="form-label" for="gender">
                  Giới tính
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="gender"
                      type="select"
                      placeholder="28374982234"
                      invalid={errors.gender && true}
                      {...field}
                    >
                      <option value={true}>Nam</option>
                      <option value={false}>Nữ</option>
                    </Input>
                  )}
                />
              </div>
              <div className="mb-1 col-4">
                <Label className="form-label" for="cardID">
                  Số CMT/CCCD (12 số)
                </Label>
                <Controller
                  name="cardID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="cardID"
                      type="number"
                      placeholder="28374982234"
                      style={{ marginBottom: "0.5rem" }}
                      invalid={errors.cardID && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-1 col-4">
                <Label className="form-label" for="province">
                  Thành phố
                </Label>
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="province"
                      type="select"
                      invalid={errors.province && true}
                      {...register("province", {
                        onChange: (e) => handleChangeProvince(e.target.value),
                      })}
                      {...field}
                    >
                      <option value="" selected disabled hidden>
                        Chọn
                      </option>
                      {!store.province.loading &&
                        store.province.data &&
                        store.province.data.map((item) => {
                          return (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          );
                        })}
                    </Input>
                  )}
                />
              </div>
              <div className="mb-1  col-4">
                <Label className="form-label" for="district">
                  Quận
                </Label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={
                        store.district?.data && store.district?.data.length > 0
                          ? false
                          : true
                      }
                      id="district"
                      type="select"
                      invalid={errors.district && true}
                      {...register("district", {
                        onChange: (e) => handleChangeDistrict(e.target.value),
                      })}
                      {...field}
                    >
                      <option value="" selected disabled hidden>
                        Chọn
                      </option>
                      {store.district.data &&
                        store.district.data.map((item) => {
                          return (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          );
                        })}
                    </Input>
                  )}
                />
              </div>
              <div className="mb-1  col-4">
                <Label className="form-label" for="wards">
                  Phường
                </Label>
                <Controller
                  name="wards"
                  control={control}
                  render={({ field }) => (
                    <Input
                      disabled={
                        store.wards?.data && store.wards?.data.length > 0
                          ? false
                          : true
                      }
                      id="wards"
                      type="select"
                      invalid={errors.wards && true}
                      {...field}
                    >
                      <option value="" selected disabled hidden>
                        Chọn
                      </option>
                      {store.wards.data &&
                        store.wards.data.map((item) => {
                          return (
                            <option key={item.code} value={item.code}>
                              {item.name}
                            </option>
                          );
                        })}
                    </Input>
                  )}
                />
              </div>
            </div>

            <div className="mb-1">
              <Label className="form-label" for="detailAddress">
                Địa chỉ cụ thể
              </Label>
              <Controller
                name="detailAddress"
                control={control}
                render={({ field }) => (
                  <Input
                    id="detailAddress"
                    placeholder="Số 1, Phố Quang Trung"
                    invalid={errors.detailAddress && true}
                    {...field}
                  />
                )}
              />
            </div>

            <div className="mb-1">
              <Label className="form-label" for="email">
                Email
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    type="email"
                    id="userEmail"
                    placeholder="john.doe@example.com"
                    invalid={errors.email && true}
                    style={{ marginBottom: "0.5rem" }}
                    {...field}
                  />
                )}
              />
              {errors?.email ? (
                <span className="text-danger">
                  {errors.email?.type === "required"
                    ? "Trường này bắt buộc nhập!"
                    : errors.email.message}
                </span>
              ) : null}
            </div>
            {errors.field && (
              <p className="text-danger">{errors.field.message}</p>
            )}
            {store.createPatient.loading || store.updatePatient.loading ? (
              <Button color="secondary" className="me-1 mt-1">
                <Spinner color="light" size="sm" />
                <span className="ms-50">
                  {!id ? "Đang tạo mới..." : "Đang cập nhật"}
                </span>
              </Button>
            ) : (
              <Button type="submit" className="me-1" color="primary">
                {!id ? "Tạo" : "Cập nhật"}
              </Button>
            )}
          </Form>
        </CardBody>
      </Card>
      {id && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle tag="h4">Thủ thuật điều trị</CardTitle>
            <Button className="me-1" color="primary">
              <Link to={`/apps/medical/create/${id}`} className="text-light">
                Đăng kí khám
              </Link>
            </Button>
          </CardHeader>
          {/* {
              !store.medical.loading && !store.deleteMedical.loading && store.medical.data.docs ? (
                <div className='react-dataTable'>
                  <DataTable
                    noHeader
                    pagination
                    responsive
                    progressPending={store.medical.loading}
                    progressComponent={<Spinner color='secondary' className="m-5" />}
                    customStyles={{
                      tableWrapper: {
                        style: {
                          minHeight: "300px",
                        }
                      }
                    }}
                    data={store.medical.data.docs}
                    columns={basicColumns()}
                    className='react-dataTable'
                    noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
                    // sortIcon={<ChevronDown size={10} />}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </div>
              ) : (<Spinner size={"small"} />)
            } */}
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              responsive
              progressPending={store.medical.loading}
              progressComponent={<Spinner color="secondary" className="m-5" />}
              customStyles={{
                tableWrapper: {
                  style: {
                    minHeight: "300px",
                  },
                },
              }}
              data={dataToRender()}
              columns={basicColumns()}
              className="react-dataTable"
              noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
              // sortIcon={<ChevronDown size={10} />}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />
          </div>
        </Card>
      )}
    </Fragment>
  );
}

export default PatientCreate;
