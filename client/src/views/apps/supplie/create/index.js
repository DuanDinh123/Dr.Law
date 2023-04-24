// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { getSupplie, createSupplie, updateSupplie } from '../store'
import { getGroupSupplieList } from '../../group-supplie/store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Col,
  Input,
  Card,
  Table,
  CardHeader,
  CardBody,
  Breadcrumb,
  Spinner,
  BreadcrumbItem,
  FormGroup,
  CardTitle
} from "reactstrap"

// ** Third Party
import { useForm, Controller } from "react-hook-form"
import toast from 'react-hot-toast'

// ** Third Party Components
import Select from 'react-select'

// ** Utils
import { selectThemeColors } from '@utils'
import { currency } from "../../currencyPrice"

const defaultValues = {
  name: undefined,
  group_supplie: undefined,
  featured_asset: undefined,
  sku: undefined,
  price_attrition: undefined,
  price: undefined,
  unit: undefined,
  quantity: 0,
  assets: undefined,
  active: true
}

const SupplieCreate = () => {
  // ** States
  const [isSubmited, setIsSubmited] = useState(false)
  const [switchActive, setSwitchActive] = useState(true)
  const [dataGroupSupplie, setDataGroupSupplie] = useState()

  // ** Store Vars
  const store = useSelector((state) => state.supplie);
  const storeGroupSupplie = useSelector((state) => state.groupSupplie);
  const currentUser = JSON.parse(localStorage.getItem("userData")).name;
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    dispatch(getGroupSupplieList({ page: 1, limit: 100, active: true }))
    if (id) {
      dispatch(getSupplie(id))
    }
  }, [id])

  const {
    control,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = (data) => {
    if (!id) {
      dispatch(
        createSupplie({
          name: data.name,
          sku: data.sku,
          featured_asset: data.featured_asset,
          price_attrition: Number(data.price_attrition),
          price: Number(data.price),
          unit: data.unit,
          quantity: Number(data.quantity),
          active: data.active,
          group_supplie: data.group_supplie.value,
          assets: data.assets,
        })
      );
    } else {
      dispatch(updateSupplie({
        id,
        supplie: {
          name: data.name,
          sku: data.sku,
          price_attrition: Number(data.price_attrition),
          price: Number(data.price),
          unit: data.unit,
          quantity: Number(data.quantity),
          assets: data.assets,
          group_supplie: data.group_supplie.value,
          active: data.active
        }
      }))
    }
    setIsSubmited(true)
  };

  useEffect(() => {
    // ** Tạo vật tư
    if (!store.create.loading && isSubmited && !id && !store.create.error) {
      setIsSubmited(false)
      navigate('/apps/supplie/list')
      toast.success('Tạo vật tư thành công!')
    }

    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/supplie/list')
      toast.success('Cập nhật vật tư thành công!')
    }

    // ** Check tạo vật tư nếu có lỗi
    if (!store.create.loading && store.create.error && !id) {
      setIsSubmited(false)
      if (store.create.data?.isValidate) {
        store.create.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.create.data?.message)
      }
    }

    if (!store.update.loading && store.update.error && id) {
      setIsSubmited(false)
      if (store.update.data?.isValidate) {
        store.update.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.update.data?.message)
      }
    }

  }, [
    store.create.loading,
    store.update.loading,
    isSubmited,
    store.create.error,
    store.update.error,
    setIsSubmited,
    setError,
    navigate
  ])

  useEffect(() => {
    setValue("active", switchActive)
  }, [switchActive])

  useEffect(() => {
    if (!store.single.loading && id && store.single.data && dataGroupSupplie) {
      const { name, sku, active, price_attrition, price, unit, quantity, assets, group_supplie } = store.single.data;
      const optionSupplie = dataGroupSupplie?.filter(item => item.value == group_supplie?._id)[0]
      setValue("name", name)
      setValue("sku", sku)
      setValue("price_attrition", price_attrition)
      setValue("price", price)
      setValue("group_supplie", optionSupplie)
      setValue("unit", unit)
      setValue("quantity", quantity)
      setValue("assets", assets)
      setSwitchActive(active)
    }
  }, [id, store.single.loading, store.single.data, dataGroupSupplie])

  useEffect(() => {
    if (!storeGroupSupplie?.list.loading && storeGroupSupplie?.list.data) {
      const groupSupplieOption = storeGroupSupplie?.list?.data?.docs?.map((item) => {
        return { value: item._id, label: item.name };
      });

      setDataGroupSupplie(groupSupplieOption)
    }
  }, [storeGroupSupplie])

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className='mb-1'>
          <BreadcrumbItem>
            <Link to='/dashboard/analytics'> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to='/apps/supplie/list'> Vật tư </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> {id ? `Sửa` : `Tạo mới`}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {
              !id ? "Tạo vật tư" : "Chỉnh sửa"
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className='mb-1 col-6'>
                <Label className='form-label' for='name'>
                  Tên vật tư <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Input
                        id='name'
                        placeholder='Kim nhỏ'
                        invalid={errors?.name && true}
                        style={{ marginBottom: '0.5rem' }}
                        value={value || ''}
                        {...other}
                      />
                      {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
              <div className='mb-1 col-3'>
                <Label className='form-label' for='sku'>
                  Mã vật tư <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='sku'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Input
                        type='text'
                        id='sku'
                        placeholder='sku-01'
                        invalid={errors?.sku && true}
                        style={{ marginBottom: '0.5rem' }}
                        value={value || ''}
                        {...other}
                      />
                      {errors?.sku ? <span className="text-danger">{errors.sku?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.sku.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
              <div className='mb-1 col-3'>
                <Label className='form-label' for='group_supplie'>
                  Nhóm vật tư <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='group_supplie'
                  rules={{ required: true }}
                  control={control}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Select
                        theme={selectThemeColors}
                        className='react-select'
                        classNamePrefix='select'
                        options={dataGroupSupplie}
                        isClearable={false}
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors?.group_supplie ? '#ea5455' : '#d8d6de',
                            marginBottom: '0.5rem'
                          }),
                        }}
                        value={value || ''}
                        {...other}
                      />
                      {errors?.group_supplie ? <span className="text-danger">{errors.group_supplie?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.group_supplie.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
            </div>

            <div className="row">
              <div className='mb-1 col-3'>
                <Label className='form-label' for='price'>
                  Đơn giá <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='price'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Input
                        type='number'
                        id='price'
                        placeholder={currency(100000)}
                        invalid={errors?.price && true}
                        style={{ marginBottom: '0.5rem' }}
                        value={value || ''}
                        {...other}
                      />
                      {errors?.price ? <span className="text-danger">{errors.price?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.price.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
              <div className='mb-1 col-3'>
                <Label className='form-label' for='price_attrition'>
                  Tiêu hao
                </Label>
                <Controller
                  name='price_attrition'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='number'
                      id='price_attrition'
                      placeholder='2'
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="row">
              <div className='mb-1 col-3'>
                <Label className='form-label' for='unit'>
                  Đơn vị
                </Label>
                <Controller
                  name='unit'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='text'
                      id='unit'
                      placeholder='Cái, Chiếc, ...'
                      {...field}
                    />
                  )}
                />
              </div>
              <div className='mb-1 col-3'>
                <Label className='form-label' for='quantity'>
                  Số lượng
                </Label>
                <Controller
                  name='quantity'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='number'
                      id='quantity'
                      placeholder='1'
                      invalid={errors.quantity && true}
                      {...register("quantity")}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className='mb-1'>
              <Label className='form-label' for='active'>
                Trạng thái
              </Label>
              <Controller
                name='active'
                control={control}
                render={({ field }) => (
                  <FormGroup switch {...field}>
                    <Input
                      type="switch"
                      style={{ cursor: 'pointer' }}
                      checked={switchActive}
                      {...field}
                      onClick={() => {
                        setSwitchActive(!switchActive);
                      }}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="mb-1 col-2">
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
            </div>
            {
              id && store.update.loading ? (
                <Button color='secondary' className="me-1 mt-1">
                  <Spinner color='light' size='sm' />
                  <span className='ms-50'>Đang cập nhật...</span>
                </Button>
              ) : store.create.loading ? (
                <Button color='secondary' className="me-1 mt-1">
                  <Spinner color='light' size='sm' />
                  <span className='ms-50'>Đang tạo mới...</span>
                </Button>
              ) : id ? <Button type="submit" className="me-1" color="primary">Cập nhật</Button> : <Button type="submit" className="me-1" color="primary">Tạo mới</Button>
            }
            <Button
              type="reset"
              color="secondary"
              outline
              onClick={() => navigate("/apps/supplie/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default SupplieCreate
