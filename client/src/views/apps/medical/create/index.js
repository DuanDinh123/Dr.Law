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
  Spinner,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Store Import
import { addMedical, getCategoryTipList, getMedicalHistoryList, getStatusList, getTipList, getUserList, getUserSupport } from "../store";
import { getSupplieList } from "../../supplie/store";

// ** Styles Imports
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";

// ** Third Party Lib
import toast from 'react-hot-toast'
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";

function MedicalCreate() {
  const [picker, setPicker] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmited, setIsSubmited] = useState(false);
  const [dataSupplie, setDataSupplie] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { id } = useParams();

  const store = useSelector((state) => state);
  const storeSupplie = useSelector((state) => state.supplie);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
  }, [picker])
  useEffect(() => {
    dispatch(getStatusList());
    dispatch(getUserList());
    dispatch(getCategoryTipList());
    dispatch(getTipList());
    dispatch(getMedicalHistoryList());
    dispatch(getUserSupport())
    dispatch(getSupplieList({ page: 1, limit: 100 }));
  }, []);

  const statusOption = store.medical.status?.map((item) => {
    return { value: item._id, label: item.name };
  });

  const tipsOption = store.medical.tipList?.map((item) => {
    return { value: item._id, label: item.name_tip }
  });

  const userSupport = store.medical.userList?.map((item) => {
    return { value: item._id, label: item.name }
  });

  const renderMedicalHistory = () => {
    if (!store.medical.medicalHistoryList.loading && store.medical.medicalHistoryList.data.docs) {
      return store.medical.medicalHistoryList.data?.docs.map((medical) => {
        return {
          value: medical._id,
          label: medical.name,
        }
      })
    }
  }

  const currentUser = store.auth.userData.name;

  const onSubmit = (data) => {
    const permissions = Object.keys(data).filter(key => data[key] === true)
    const dataMedicalHistory = data.medicalHistory && data.medicalHistory.map(item => { return { id: item.value, name: item.label } })
    const dataUserSupport = data.userSupport && data.userSupport.map(item => { return { id: item.value, name: item.label } })
    const dataSupplies = data.supplies && data.supplies.map(item => { return { id: item.value.value, quantity: item.quantity } })
    const dataSubmit = {
      ...data,
      medical_examination_day: data.medical_examination_day && moment(data.medical_examination_day[0]).toISOString(),
      status: data.status && data.status.value,
      tip_id: data.tip_id.value,
      patient_id: id,
      medical_history: dataMedicalHistory,
      user: data.user && data.user.value,
      user_support: dataUserSupport,
      supplies: dataSupplies
    }

    dispatch(
      addMedical({ ...dataSubmit, permissions })
    )
    setIsSubmited(true)

  };

  const defaultValues = {
    patient_id: undefined,
    tip_id: undefined,
    symptom: undefined,
    diagnose: undefined,
    medical_examination_day: undefined,
    status: undefined,
    note: undefined,
    quantity_tip: undefined,
    pay_status: 0,
    medicalHistory: undefined,
    userSupport: undefined
  };

  const {
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplies",
  });

  useEffect(() => {
    if (tipsOption.length > 0) {
      setValue("tip_id", {
        value: tipsOption[0].value,
        label: tipsOption[0].label,
      });
    }
    if (statusOption.length > 0) {
      setValue("status", {
        value: statusOption[0].value,
        label: statusOption[0].label,
      });
    }
    if (userSupport.length > 0) {
      setValue("user", {
        value: userSupport[0].value,
        label: userSupport[0].label,
      });
    }
    setValue("medical_examination_day", [new Date()])

  }, [tipsOption, statusOption, userSupport])

  useEffect(() => {
    // ** Đăng kí khám
    if (!store.medical.createMedical.loading && isSubmited && !store.medical.createMedical.error) {
      setIsSubmited(false)
      toast.success("Đăng kí khám thành công!");
    }
    // ** Show error khi đăng kí khám
    if (!store.medical.createMedical.loading && store.medical.createMedical.error) {
      setIsSubmited(false)
      if (store.medical.createMedical.data?.isValidate) {
        store.medical.createMedical.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.medical.createMedical.data?.message)
      }
    }

  }, [
    id,
    store.medical.createMedical.loading,
    isSubmited,
    store.medical.createMedical.error,
    setIsSubmited,
    setError,
    navigate
  ])

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
        <Breadcrumb className='mb-1'>
          <BreadcrumbItem>
            <Link to='/'> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link > Thông tin khám </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> Tạo </span>
          </BreadcrumbItem>
        </Breadcrumb>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Đăng kí khám (CHECK IN)</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="row my-2">
                <div className="mb-1 col-3">
                  <Label className="form-label" for="medical_examination_day">
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
                          className="form-control"
                          onChange={(date) => setPicker(date)}
                          options={{
                            enableTime: true,
                            dateFormat: "Y-m-d H:i",
                            defaultDate: picker,
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
                          defaultValue={tipsOption}
                          options={tipsOption}
                          isClearable={false}
                          {...field}
                        />
                      );
                    }}
                  />
                </div>
                <div className="mb-1  col-4">
                  <Label className="form-label" for="quantity_tip">
                    Số lượng thủ thuật <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="quantity_tip"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="quantity_tip"
                        placeholder="Số lượng"
                        invalid={errors.quantity_tip && true}
                        style={{ marginBottom: '0.5rem' }}
                        {...field}
                      />
                    )}
                  />
                  {errors?.quantity_tip ? <span className="text-danger">{errors.quantity_tip?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.quantity_tip.message}</span> : null}
                </div>

              </div>

              <div className="row mb-1">
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
                        className='react-select'
                        classNamePrefix='select'
                        value={value}
                        {...other}
                      />
                    );
                  }}
                />
              </div>

              <div className="row">
                <div className="mb-1 col-6">
                  <Label className="form-label" for="symptom">
                    Chẩn đoán <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="symptom"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="textarea"
                          rows="3"
                          placeholder="Nội dung"
                          style={errors.symptom && { "border-color": "#ea5455", marginBottom: '0.5rem' }}
                          {...field}
                        />
                      );
                    }}
                  />
                  {errors?.symptom ? <span className="text-danger">{errors.symptom?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.symptom.message}</span> : null}
                </div>
                <div className="mb-1 col-6">
                  <Label className="form-label" for="diagnose">
                    Triệu chứng <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="diagnose"
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="textarea"
                          rows="3"
                          style={errors.diagnose && { "border-color": "#ea5455", marginBottom: '0.5rem' }}
                          placeholder="Nội dung"
                          {...field}
                        />
                      );
                    }}
                  />
                  {errors?.diagnose ? <span className="text-danger">{errors.diagnose?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.diagnose.message}</span> : null}
                </div>
              </div>
            </CardBody>
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
                        <Button type="button" color="danger" onClick={() => remove(index)}>
                          Xóa
                        </Button>
                      </div>

                    </div>
                  );
                })}
                <br />
                <Button
                  type="button"
                  color="primary"
                  onClick={() => {
                    dataSupplie.length > 0 ? append({ value:{value: dataSupplie[0].value, label: dataSupplie[0].label}, quantity: 1 }) :  append({ value: "iddd", quantity: 1 })
                  }}
                >
                  Thêm vật tư
                </Button>
              </div>
            </CardBody>
            <CardBody className="col-4">
              <Label className="form-label" for="Status">
                Trạng thái
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
                render={() => (
                  <Input
                    id="modified_by"
                    placeholder="bsphuong"
                    disabled
                    value={currentUser}
                  />
                )}
              />
            </CardBody>
            <div className="d-flex mx-2 my-1">
              {
                store.medical.createMedical.loading ? (
                  <Button color='secondary' className="me-1 mt-1">
                    <Spinner color='light' size='sm' />
                    <span className='ms-50'>Đang tạo mới...</span>
                  </Button>
                ) : (
                  <Button type="submit" className="me-1" color="primary">
                    Lưu
                  </Button>
                )
              }
            </div>
          </Card>
        </Form>
      </div>
    </>
  );
}

export default MedicalCreate;
