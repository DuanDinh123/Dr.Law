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
  FormText
} from "reactstrap";
import { currency } from "../../currencyPrice";
// ** Utils
import { selectThemeColors } from "@utils";

// ** Third Party Components
import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";

import Flatpickr from "react-flatpickr";

import { useNavigate, useParams } from "react-router-dom";
import { createPayment, getMedical } from "../../patient/store";

// ** Styles Imports
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";

import { useForm, Controller } from "react-hook-form";

// ** Third Party Components
import toast from 'react-hot-toast'
import { NumericFormat } from 'react-number-format';

const checkIsValid = (data) => {
  return Object.values(data).every((field) =>
    typeof field === "object" ? field !== null : field.length > 0
  );
};


function PaymentCreate() {
  const [picker, setPicker] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [medicalList, setMedicalList] = useState([])
  const [formSubmit, setFormSubmit] = useState(false)
  const [paid, setPaid] = useState(null)

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { id } = useParams();

  const store = useSelector((state) => state.patient.medicalSingle);
  const payment = useSelector((state) => state.patient.payment);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  useEffect(() => {
    dispatch(getMedical(id));
  }, [id]);

  // useEffect(() => {
  //     if(store.patient.medical.data.docs.length) {
  //         setMedicalList(store.patient.medical.data.docs)
  //     }
  // }, [store]);


  // const medicalOptions = medicalList && medicalList.map((item) => {
  //   return { value: item._id, label: item.tip_id ? item.tip_id.name_tip : 'Tip name đang null, check đi! ĐM cường' };
  // });

  //   const tipsOption = store.medical.tipList.map((item) => {
  //     return { value: item._id, label: item.name_tip }
  //   });

  //   const currentUser = store.auth.userData.name;

  const onSubmit = (data) => {

    const dataSubmit = {
      id: data.id,
      patient_id: data.patient_id,
      tip_id: data.tip_id,
      pay_status: Number(data.pay_status),
      paid: paid,
      pay_method: Number(data.pay_method),
    }
    dispatch(createPayment(dataSubmit))
    setFormSubmit(true)
    // const dataSubmit = {
    //   ...data,
    //   medical_examination_day: data.medical_examination_day[0],
    //   status: data.status.value,
    //   tip_id: data.tip_id.value,
    //   patient_id: id
    // }

    // if (checkIsValid(data)) {
    //   dispatch(
    //     addMedical(dataSubmit)
    //   )
    //   toast.success('Đăng kí khám thành công!')
    // }
    // createPayment
  };

  const defaultValues = {
    patient_id: "",
    tip_id: "",
    tip_name: "",
    id: "",
    pay_status: "",
    paid: "",
    modified_by: "",
    pay_method: null
  };

  const {
    control,
    setValue,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    if (store && store.data && !store.loading) {
      store.data.patient_id && setValue("patient_id", store.data.patient_id._id);
      setValue("id", store.data._id);
      store.data.tip_id && setValue("tip_id", store.data.tip_id._id);
      store.data.tip_id && setValue("tip_name", store.data.tip_id.name_tip);
      store.data.updated_by && setValue("modified_by", store.data.updated_by.name);
    }

  }, [store, store.data, store.loading])

  useEffect(() => {

    if (!payment.loading && payment.data && formSubmit) {
      toast.success("Thanh toán thành công!");
      setFormSubmit(false)
    }
  }, [payment.loading, payment.data])

  return (
    <>
      <div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Thanh toán</CardTitle>
            </CardHeader>


            <CardBody>
              <div className="mb-1">
                {/* <div className="mb-1">
                <Label className="form-label" for="phone">
                 Thời gian thanh toán <span className="text-danger">*</span>
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
              </div> */}


                <div className="mb-1 ">
                  <Label className="form-label" for="paid">
                    Số tiền thực thu <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    name="paid"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        customInput={Input}
                        thousandSeparator={true}
                        onValueChange={(v) => {
                          setPaid(v.value)
                        }}
                        invalid={errors.paid && true}
                        {...register("paid", { required: true })}
                        {...field}
                      />

                      // <Input
                      //   id="paid"

                      //   invalid={errors.paid && true}
                      //   {...register("paid", { required: true })}
                      //   {...field}
                      // />
                    )}
                  />
                </div>
                <p>Số tiền còn nợ:  <span className="text-danger">{currency(store.data && store.data.total - store.data.paid)}</span></p>

              </div>

              <div className="mb-1 ">
                <Label className="form-label" for="tip_name">
                  Thủ thuật điều trị <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="tip_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="tip_name"
                      invalid={errors.tip_name && true}
                      disabled
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="pay_method">
                  Phương thức thanh toán
                </Label>
                <Controller
                  name="pay_method"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        type="select"
                        {...field}
                      >
                        <option value={0}>Tiền mặt</option>
                        <option value={1}>Chuyển khoản</option>
                      </Input>
                    );
                  }}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="pay_status">
                  Trạng thái thanh toán
                </Label>
                <Controller
                  name="pay_status"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Input
                        type="select"
                        {...field}
                      >
                        <option value={0}> Chưa thanh toán</option>
                        <option value={1}> Đã thanh toán</option>
                        <option value={2}> Thanh toán 1 phần</option>
                      </Input>
                    );
                  }}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="modified_by">
                  Nguời cập nhật
                </Label>
                <Controller
                  name="modified_by"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="modified_by"
                      disabled
                      {...field}
                    />
                  )}
                />
              </div>

            </CardBody>

            <div className="d-flex mx-2 my-1">
              {
                payment.loading ? (
                  <Button color='secondary' className="me-1 mt-1">
                    <Spinner color='light' size='sm' />
                    <span className='ms-50'>Đang thanh toán...</span>
                  </Button>
                ) : (
                  <Button type="submit" className="me-1" color="primary">
                    Thanh toán
                  </Button>
                )
              }
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

export default PaymentCreate;
