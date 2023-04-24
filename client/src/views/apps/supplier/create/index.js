// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { getSupplier, createSupplier, updateSupplier } from '../store'
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

const defaultValues = {
  name: undefined,
  phone: undefined,
  email: undefined,
  website: undefined,
  address: undefined,
  description: undefined,
  active: true
}

const SupplierCreate = () => {
  // ** States
  const [isSubmited, setIsSubmited] = useState(false)
  const [switchActive, setSwitchActive] = useState(true)

  const currentUser = JSON.parse(localStorage.getItem("userData")).name;

  // ** Store Vars
  const store = useSelector((state) => state.supplier);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getSupplier(id))
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
        createSupplier({
          name: data.name,
          phone: data.phone,
          email: data.email,
          website: data.website,
          address: data.address,
          description: data.description,
          active: data.active,
          note: data.note,
          modified_by: currentUser
        })
      );
    } else {
      dispatch(updateSupplier({
        id,
        supplier: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          website: data.website,
          address: data.address,
          description: data.description,
          active: data.active,
          note: data.note,
          modified_by: currentUser
        }
      }))
    }
    setIsSubmited(true)

  };

  useEffect(() => {
    if (!store.create.loading && isSubmited && !id && !store.create.error) {
      setIsSubmited(false)
      navigate('/apps/supplier/list')
      toast.success('Tạo nhà cung cấp thành công!')
    }

    if (!store.create.loading && isSubmited && !id && store.create.error) {
      setIsSubmited(false)
      if (store.create.data?.isValidate) {
        store.create.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.create.data?.message)
      }
    }
    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/supplier/list')
      toast.success('Cập nhật nhà cung cấp thành công!')
    }
    if (!store.update.loading && isSubmited && id && store.update.error) {
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
    id,
    isSubmited,
    store.create.loading,
    store.create.error,
    store.update.loading,
    store.update.error,
    setIsSubmited,
    navigate,
    setError
  ])

  useEffect(() => {
    setValue("active", switchActive)
  }, [switchActive])

  useEffect(() => {
    if (!store.single.loading && id && store.single.data) {
      const { name, phone, active, email, website, address, description } = store.single.data;
      setValue("name", name)
      setValue("phone", phone)
      setValue("active", active)
      setValue("description", description)
      setValue("email", email)
      setValue("website", website)
      setValue("address", address)
      // setValue("modified_by", modified_by);
      setSwitchActive(active)
    }
  }, [id, setValue, store.single.loading, store.single.data, dispatch])

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className='mb-1'>
          <BreadcrumbItem>
            <Link to='/dashboard/analytics'> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to='/apps/supplier/list'> Nhà cung cấp </Link>
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
              !id ? "Tạo nhà cung cấp" : "Chỉnh sửa"
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className='mb-1 col-6'>
                <Label className='form-label' for='name'>
                  Tên nhà cung cấp <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Input
                        id='name'
                        placeholder='Tên nhà cung cấp ...'
                        invalid={errors.name && true}
                        value={value || ''}
                        style={{ marginBottom: '0.5rem' }}
                        {...other}
                      />
                      {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
              <div className='mb-1 col-6'>
                <Label className='form-label' for='address'>
                  Địa chỉ
                </Label>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='text'
                      id='address'
                      placeholder='Đông Tiều, Quảnh Ninh...'
                      invalid={errors.address && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div className="row">
              <div className='mb-1 col-4'>
                <Label className='form-label' for='phone'>
                  Điện thoại <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: true, pattern: /^\d{10}$/ }}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Input
                        type='text'
                        id='phone'
                        placeholder='0123456789'
                        invalid={errors.phone && true}
                        style={{ marginBottom: '0.5rem' }}
                        value={value || ''}
                        {...other}
                      />
                      {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
              <div className='mb-1 col-4'>
                <Label className='form-label' for='email'>
                  Email <span className='text-danger'>*</span>
                </Label>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, ...other } }) => (
                    <Fragment>
                      <Input
                        type='text'
                        id='email'
                        placeholder='abc@gmail.com'
                        style={{ marginBottom: '0.5rem' }}
                        invalid={errors?.email && true}
                        value={value || ''}
                        {...other}
                      />
                      {errors?.email ? <span className="text-danger">{errors.email?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.email.message}</span> : null}
                    </Fragment>
                  )}
                />
              </div>
              <div className='mb-1 col-4'>
                <Label className='form-label' for='website'>
                  Website
                </Label>
                <Controller
                  name='website'
                  control={control}
                  render={({ field }) => (
                    <Input
                      type='text'
                      id='website'
                      placeholder='website.com.vn'
                      invalid={errors.website && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className='mb-1'>
              <Label className='form-label' for='description'>
                Ghi chú
              </Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Input
                    type='textarea'
                    id='description'
                    placeholder='Ghi chú'
                    invalid={errors.description && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-1 col-2'>
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
              onClick={() => navigate("/apps/supplier/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default SupplierCreate
