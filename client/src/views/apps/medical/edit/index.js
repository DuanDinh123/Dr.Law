import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Input,
  Button,
  Form,
  Label,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
} from "reactstrap";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Third Party Components
import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";

import Flatpickr from "react-flatpickr";

import {
  addMedical,
  getCategoryTipList,
  getMedical,
  getMedicalHistoryList,
  getStatusList,
  getTipList,
  getUserList,
  getUserSupport,
  updateMedical,
} from "../store";

// ** Styles Imports
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";

import { useForm, Controller, useFieldArray } from "react-hook-form";

// ** Third Party Components
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { getSupplieList } from "../../supplie/store";



function MedicalEdit() {
  const [picker, setPicker] = useState(new Date());
  const [formSubmit, setFormSubmit] = useState(false);
  const [dataSupplie, setDataSupplie] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { id } = useParams();

  const store = useSelector((state) => state);
  const storeSupplie = useSelector((state) => state.supplie);

  const currentUser = store.auth.userData.name;

  useEffect(() => {
    dispatch(getStatusList());
    dispatch(getUserList());
    dispatch(getCategoryTipList());
    dispatch(getTipList());
    dispatch(getMedicalHistoryList());
    dispatch(getUserSupport());
    dispatch(getSupplieList({ page: 1, limit: 100 }));
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getMedical(id));
    }
  }, [id]);

  const statusOption = store.medical.status.map((item) => {
    return { value: item._id, label: item.name };
  });

  const tipsOption = store.medical.tipList.map((item) => {
    return { value: item._id, label: item.name_tip };
  });

  const userSupport = store.medical.userList.map((item) => {
    return { value: item._id, label: item.name };
  });

  const renderMedicalHistory = () => {
    if (
      !store.medical.medicalHistoryList.loading &&
      store.medical.medicalHistoryList.data.docs
    ) {
      return store.medical.medicalHistoryList.data?.docs.map((medical) => {
        return {
          value: medical._id,
          label: medical.name,
        };
      });
    }
  };

  const onSubmit = (data) => {
    console.log("dataa", data)
    const dataMedicalHistory = data.medicalHistory.map((item) => {
      return { id: item.value, name: item.label };
    });
    const dataUserSupport = data.userSupport && data.userSupport.map(item => { return { id: item.value, name: item.label } })
    const dataSupplies = data.supplies && data.supplies.map(item => { return { id: item.value.value, quantity: item.quantity } })
    
    const dataSubmit = {
      ...data,
      medical_examination_day: moment(
        data.medical_examination_day[0]
      ).toISOString(),
      status: data.status.value,
      tip_id: data.tip_id.value,
      patient_id: id,
      medical_history: dataMedicalHistory,
      user: data.user.value,
      userSupport: dataUserSupport,
      supplies: dataSupplies
    };

    dispatch(
      updateMedical({
        medical_id: id,
        medical: dataSubmit,
      })
    );
    setFormSubmit(true);
  };

  const defaultValues = {
    patient_id: undefined,
    tip_id: undefined,
    symptom: undefined,
    diagnose: undefined,
    medical_examination_day: undefined,
    quantity_tip: undefined,
    status: undefined,
    note: undefined,
    modified_by: undefined,
    medicalHistory: undefined,
    user: undefined,
    userSupport: undefined,
  };

  const {
    control,
    setValue,
    setError,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplies",
  });

  useEffect(() => {
    const {
      quantity_tip,
      symptom,
      diagnose,
      note,
      status,
      updated_by,
      tip_id,
      medical_examination_day,
      medical_history,
      user,
      user_support,
      supplies,
    } = store.medical.single.data;
    const fomatDate = moment(medical_examination_day).format(
      "YYYY-MM-DD HH:mm"
    );
    tip_id && setValue("tip_id", { label: tip_id.name_tip, value: tip_id._id });
    setValue("medical_examination_day", fomatDate);
    setValue("quantity_tip", quantity_tip);
    setValue("diagnose", diagnose);
    setValue("symptom", symptom);
    user_support &&
      setValue(
        "userSupport",
        user_support.map((item) => {
          return { label: item.name, value: item._id };
        })
      );
      medical_history &&
      setValue(
        "medicalHistory",
        medical_history.map((item) => {
          return { label: item.name, value: item._id };
        })
      );
    setValue("note", note);
    status && setValue("status", { label: status.name, value: status._id });
    user &&
      setValue("user", {
        label: user.name,
        value: user._id,
      });
    setValue("modified_by", updated_by);
    supplies &&
      setValue(
        "supplies",
        supplies.map((item) => {
          return {
            value: {
              value: item.id._id,
              label: item.id.name,
            },
            quantity: item.quantity,
           
          };
        })
      );
  }, [store.medical.single]);

  useEffect(() => {
    if (
      !store.medical.updateMedical.loading &&
      store.medical.updateMedical.data &&
      formSubmit
    ) {
      toast.success("Chỉnh sửa thành công!");
      setFormSubmit(false);
    }
  }, [store.medical.updateMedical.loading, store.medical.updateMedical.data]);

  useEffect(() => {
    if (!storeSupplie?.list.loading && storeSupplie?.list.data) {
      const supplieOption = storeSupplie?.list?.data?.docs?.map((item) => {
        return { value: item._id, label: item.name };
      });

      setDataSupplie(supplieOption);
    }
  }, [storeSupplie, dispatch]);

  return (
    <>
      <div>
        <Breadcrumb className="mb-1">
          <BreadcrumbItem>
            <Link to="/"> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link> Thông tin khám </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> Sửa </span>
          </BreadcrumbItem>
        </Breadcrumb>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex-column align-items-start">
              <CardTitle tag="h4">Thông tin khám</CardTitle>
            </CardHeader>
            <div className="row mx-1 my-2">
              <div className="mb-1 col-3">
                <Label className="form-label" for="phone">
                  Hẹn ngày khám <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="medical_examination_day"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Flatpickr
                        value={picker}
                        data-enable-time
                        id="date-time-picker"
                        className="form-control"
                        onChange={(date) => setPicker(date)}
                        options={{
                          enableTime: true,
                          dateFormat: "Y-m-d H:i",
                        }}
                        {...field}
                      />
                    );
                  }}
                />
              </div>

              <div className="mb-1 col-5">
                <Label className="form-label" for="gender">
                  Thủ thuật điều trị <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="tip_id"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        defaultValue={tipsOption[0]}
                        options={tipsOption}
                        isClearable={false}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
              <div className="mb-1  col-2">
                <Label className="form-label" for="quantity_tip">
                  Số lượng thủ thuật <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="quantity_tip"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="quantity_tip"
                      placeholder="Số lượng"
                      invalid={errors.quantity_tip && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div
              className="row mb-1"
              style={{ marginRight: "15px", marginLeft: "15px" }}
            >
              <Label className="form-label" for="medicalHistory">
                Tiểu sử bệnh
              </Label>
              <Controller
                name="medicalHistory"
                control={control}
                render={({ field: { value, ...other } }) => {
                  return (
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      defaultValue={[]}
                      isMulti
                      options={renderMedicalHistory()}
                      className="react-select"
                      classNamePrefix="select"
                      value={value}
                      {...other}
                    />
                  );
                }}
              />
            </div>

            <div className="row mx-1">
              <div className="mb-1 col-6">
                <Label className="form-label" for="phone">
                  Chẩn đoán <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="symptom"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        type="textarea"
                        name="date"
                        id="data"
                        rows="3"
                        placeholder="Nội dung"
                        {...field}
                      />
                    );
                  }}
                />
              </div>
              <div className="mb-1 col-6">
                <Label className="form-label" for="phone">
                  Triệu chứng <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="diagnose"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        type="textarea"
                        name="date"
                        id="data"
                        rows="3"
                        placeholder="Nội dung"
                        {...field}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <CardHeader>
              <CardTitle tag="h4">Nội dung khám</CardTitle>
            </CardHeader>

            <CardBody>
              <Controller
                name="note"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="textarea"
                      name="date"
                      id="data"
                      rows="3"
                      placeholder="Nội dung"
                      {...field}
                    />
                  );
                }}
              />
            </CardBody>
            <CardBody>
              <div className="mb-1 col-12">
                <Label className="form-label" for="supplies">
                  Vật tư <span className="text-danger">*</span>
                </Label>
                {fields.map((item, index) => {
                  return (
                    <div key={item.id} className="row">
                      <div className="mb-1 col-6">
                        <Controller
                          name={`supplies.${index}.value`}
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <Select
                              style={{ color: "black" }}
                              {...register(`supplies.${index}.value`)}
                              className="react-select"
                              classNamePrefix="select"
                              options={dataSupplie}
                              isClearable={false}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="mb-1 col-2">
                        <Controller
                          name={`supplies.${index}.quantity`}
                          rules={{ required: true }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              id="quantity"
                              placeholder="Số lượng"
                              invalid={errors.quantity && true}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="mb-1 col-4">
                        <Button
                          type="button"
                          color="danger"
                          onClick={() => remove(index)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  );
                })}
                <Button
                  type="button"
                  color="primary"
                  onClick={() => {
                    append({ value: "iddd", quantity: 1 });
                  }}
                >
                  Thêm vật tư
                </Button>
              </div>
            </CardBody>
            <CardBody className="col-4">
              <Label className="form-label" for="Status">
                Trạng thái <span className="text-danger">*</span>
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      defaultValue={statusOption[0]}
                      options={statusOption}
                      isClearable={false}
                      {...field}
                    />
                  );
                }}
              />
            </CardBody>
            <CardBody className="col-4">
              <Label className="form-label" for="user">
                Bác sĩ
              </Label>
              <Controller
                name="user"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      // defaultValue={userSupport[0]}
                      options={userSupport}
                      isClearable={false}
                      {...field}
                    />
                  );
                }}
              />
            </CardBody>
            <CardBody className="col-4">
              <Label className="form-label" for="userSupport">
                Bác sĩ hỗ trợ
              </Label>
              <Controller
                name="userSupport"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      theme={selectThemeColors}
                      className="react-select"
                      classNamePrefix="select"
                      isMulti
                      // defaultValue={userSupport[0]}
                      options={userSupport}
                      isClearable={false}
                      {...field}
                    />
                  );
                }}
              />
            </CardBody>
            <CardBody className="col-2">
              <Label className="form-label" for="modified_by">
                Nguời cập nhật
              </Label>
              <Controller
                name="modified_by"
                control={control}
                render={(field) => (
                  <Input
                    id="modified_by"
                    disabled
                    {...field}
                    value={currentUser}
                  />
                )}
              />
            </CardBody>
            <div className="d-flex mx-2 my-1">
              {store.medical.updateMedical.loading ? (
                <Button color="secondary" className="me-1 mt-1">
                  <Spinner color="light" size="sm" />
                  <span className="ms-50">Đang chỉnh sửa...</span>
                </Button>
              ) : (
                <Button type="submit" className="me-1" color="primary">
                  Lưu
                </Button>
              )}
              <Button type="reset" className="me-1" color="primary">
                Thoát
              </Button>
            </div>
          </Card>
        </Form>
      </div>
    </>
  );
}

export default MedicalEdit;
