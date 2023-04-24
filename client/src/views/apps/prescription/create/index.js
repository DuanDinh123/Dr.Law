import React, { useEffect, useState, Fragment } from "react";

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
  FormGroup,
  Spinner,
  CardTitle,
} from "reactstrap";

// ** Store & Actions
import { createPrescription, getPrescription, updatePrescription } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAdviceList, getAdvice, updateAdvice } from "../../advice/store";

// ** Third Party
import { toast } from "react-hot-toast";
import makeAnimated from 'react-select/animated'
import Select from 'react-select'

// ** Utility Import
import { selectThemeColors } from '@utils'

const defaultValues = {
  name: undefined,
  prescription_content: undefined,
  active: true,
  note: undefined,
  advice: undefined,
  adviceContent: undefined
};

const animatedComponents = makeAnimated()

const AdviceSelected = ({ advice, control, setValue }) => {
  // ** Store Vars
  const { value } = advice
  const dispatch = useDispatch();
  const store = useSelector((state) => state.advice);

  useEffect(() => {
    if (value) {
      dispatch(getAdvice(value))
    }
  }, [value]);

  useEffect(() => {
    if (value && !store.single.loading && store.single?.data) {
      setValue('adviceContent', store.single?.data?.sample_content)
    }
  }, [value, store.single?.data])

  return (
    <div className="mt-1">
      <Controller
        name="adviceContent"
        control={control}
        render={({ field: { value, ...other } }) => (
          <Input
            id="adviceContent"
            type="textarea"
            value={value || ''}
            {...other}
          />
        )}
      />
    </div>
  )
}

function PrescriptionCreate() {
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("userData")).name;
  const { id } = useParams();

  // ** State Vars
  const [switchActive, setSwitchActive] = useState(true);
  const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() => {
    dispatch(getAdviceList({
      page: 1,
      limit: 999,
      active: true
    }))
    if (id) {
      dispatch(getPrescription(id));
    }
  }, [id]);
  

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** Function to handle form submit
  const onSubmit = async (data) => {
    if (!id) {
      await Promise.all([
        dispatch(createPrescription({
          name: data.name,
          prescription_content: data.prescription_content,
          active: data.is_active,
          note: data.note,
          ...data.advice && { advice: data.advice.value }
        })),
        ...data.advice ? [
          dispatch(updateAdvice({
            id: data.advice.value,
            advice: {
              sample_content: data.adviceContent,
            }
          }))
        ] : [],
      ])
    } else {
      await Promise.all([
        dispatch(updatePrescription({
          id,
          prescription: {
            name: data.name,
            prescription_content: data.prescription_content,
            active: data.is_active,
            note: data.note,
            ...data.advice && { advice: data.advice.value }
          }
        })),
        ...data.advice ? [
          dispatch(updateAdvice({
            id: data.advice.value,
            advice: {
              sample_content: data.adviceContent,
            }
          }))
        ] : [],
      ])
    }
    setIsSubmited(true)
  };

  useEffect(() => {
    // ** Cập nhật mẫu đơn thuốc
    if (!store.prescription.update.loading && isSubmited && id && !store.prescription.update.error) {
      setIsSubmited(false)
      navigate('/apps/prescription/list')
      toast.success('Cập nhật mẫu đơn thuốc thành công!')
    }
    // ** Check cập nhật mẫu đơn thuốc nếu có lỗi
    if (!store.prescription.update.loading && isSubmited && id && store.prescription.update.error) {
      setIsSubmited(false)
      if (store.prescription.update.data?.isValidate) {
        store.prescription.update.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.prescription.update.data?.message)
      }
    }
    // ** Tạo mẫu đơn thuốc
    if (!store.prescription.create.loading && isSubmited && !id && !store.prescription.create.error) {
      setIsSubmited(false);
      navigate("/apps/prescription/list");
      toast.success("Tạo mẫu đơn thuốc thành công");
    }
    // ** Check tạo mẫu đơn thuốc nếu có lỗi
    if (!store.prescription.create.loading && isSubmited && !id && store.prescription.create.error) {
      setIsSubmited(false)
      if (store.prescription.create.data?.isValidate) {
        store.prescription.create.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.prescription.create.data?.message)
      }
    }
  }, [
    id,
    isSubmited,
    store.prescription.update.loading,
    store.prescription.create.loading,
    store.prescription.create.error,
    store.prescription.update.error
  ]);

  useEffect(() => {
    setValue("is_active", switchActive)
  }, [switchActive])

  useEffect(() => {
    if (!store.prescription.single.loading && id && store.prescription.single.data) {
      const { name, prescription_content, active, note, advice } = store.prescription.single.data;
      setValue("name", name);
      setValue("prescription_content", prescription_content);
      setValue("active", active);
      setValue("note", note);
      if (advice) {
        setValue("advice", { value: advice._id, label: advice.name })
        setValue("adviceContent", advice.sample_content)
      }
      setSwitchActive(active)
    }
  }, [id, setValue, store.prescription.single.loading, store.prescription.single.data, dispatch])

  const renderAdvice = () => {
    if (!store.advice.list.loading && store.advice.list?.data?.docs?.length > 0) {
      return store.advice.list?.data?.docs.map((advice) => {
        return {
          value: advice._id,
          label: advice.name,
        }
      })
    }
  }

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className="mb-1">
          <BreadcrumbItem>
            <Link to="/dashboard/analytics"> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/apps/prescription/list"> Mẫu đơn thuốc </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> {id ? "Sửa" : "Tạo mới"} </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {id ? "Cập nhật mẫu đơn thuốc" : "Tạo mẫu đơn thuốc"}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 col-5">
              <Label className="form-label" for="name">Tên mẫu <span className="text-danger">*</span></Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      id="name"
                      placeholder="Tesmorita"
                      style={{ marginBottom: '0.5rem' }}
                      invalid={errors?.name && true}
                      value={value || ''}
                      {...other}
                    />
                    {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                  </Fragment>
                )}
              />
            </div>
            <div className="mb-1 col-5">
              <Label className="form-label" for="prescription_content">Nội dung mẫu <span className="text-danger">*</span></Label>
              <Controller
                name="prescription_content"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      id="prescription_content"
                      type="textarea"
                      placeholder="Ngày 1v 1 viên, ngày 2v 2 viên"
                      style={{ marginBottom: '0.5rem' }}
                      value={value || ''}
                      invalid={errors?.prescription_content && true}
                      {...other}
                    />
                    {errors?.prescription_content ? <span className="text-danger">{errors.prescription_content?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.prescription_content.message}</span> : null}
                  </Fragment>
                )}
              />
            </div>
            <div className="mb-1 col-5">
              <Label className="form-label" for="note">Ghi chú</Label>
              <Controller
                name="note"
                control={control}
                render={({ field: { value, ...other } }) => (
                  <Input
                    id="note"
                    type="textarea"
                    value={value || ''}
                    placeholder="Thuốc này không dành cho trẻ em dưới 5 tuổi"
                    {...other}
                  />
                )}
              />
            </div>
            <div className="mb-1 col-5">
              <Label className="form-label" for="is_active">Trạng thái</Label>
              <Controller
                name="is_active"
                control={control}
                render={({ field: { value, ...other } }) => (
                  <FormGroup switch>
                    <Input
                      type="switch"
                      style={{ cursor: "pointer" }}
                      checked={switchActive}
                      onClick={() => {
                        setSwitchActive(!switchActive);
                      }}
                      value={value || true}
                      {...other}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="mb-1">
              <Label className='form-label'>Lời dặn</Label>
              <Controller
                name="advice"
                control={control}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Select
                      isClearable={false}
                      theme={selectThemeColors}
                      closeMenuOnSelect={true}
                      components={animatedComponents}
                      options={renderAdvice()}
                      className='react-select'
                      classNamePrefix='select'
                      value={value}
                      {...other}
                    />
                    {value && <AdviceSelected advice={value} control={control} setValue={setValue} />}
                  </Fragment>
                )}
              />
            </div>
            <div className="mb-1 col-2">
              <Label className="form-label" for="modified_by">Nguời cập nhật</Label>
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
            </div>
            {
              id && store.prescription.update.loading ? (
                <Button color='secondary' className="me-1 mt-1">
                  <Spinner color='light' size='sm' />
                  <span className='ms-50'>Đang cập nhật mới...</span>
                </Button>
              ) : store.prescription.create.loading ? (
                <Button color='secondary' className="me-1 mt-1">
                  <Spinner color='light' size='sm' />
                  <span className='ms-50'>Đang tạo mới...</span>
                </Button>
              ) : id ? <Button type="submit" className="me-1 mt-1" color="primary">Cập nhật</Button> : <Button type="submit" className="me-1 mt-1" color="primary">Tạo mới</Button>}
            <Button
              type="reset"
              color="secondary"
              className="me-1 mt-1"
              outline
              onClick={() => navigate("/apps/prescription/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default PrescriptionCreate;
