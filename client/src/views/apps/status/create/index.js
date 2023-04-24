// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { getStatus, createStatus, updateStatus } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Reactstrap Imports
import {
  Button,
  Label,
  Form,
  Input,
  Card,
  CardHeader,
  CardBody,
  Breadcrumb,
  Spinner,
  BreadcrumbItem,
  CardTitle,
  FormGroup
} from "reactstrap"

// ** Third Party
import { useForm, Controller } from "react-hook-form"
import toast from 'react-hot-toast'

const defaultValues = {
  name: undefined,
  active: true,
  description: undefined
}

const StatusCreate = () => {
  // ** States
  const [isSubmited, setIsSubmited] = useState(false)
  const [switchActive, setSwitchActive] = useState(true)

  // ** Store Vars
  const store = useSelector((state) => state.status);
  const currentUser = JSON.parse(localStorage.getItem("userData")).name;
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getStatus(id))
    }
  }, [id])

  const {
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = (data) => {
    if (!id) {
      dispatch(
        createStatus({
          name: data.name,
          active: data.active,
          description: data.description
        })
      );
    } else {
      dispatch(updateStatus({
        id,
        status: {
          name: data.name,
          active: data.active,
          description: data.description
        }
      }))
    }
    setIsSubmited(true)
  };

  useEffect(() => {
    // ** Tạo trạng thái
    if (!store.create.loading && isSubmited && !id && !store.create.error) {
      setIsSubmited(false)
      navigate('/apps/status/list')
      toast.success('Tạo trạng thái thành công!')
    }
    // ** Cập nhật trạng thái
    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/status/list')
      toast.success('Cập nhật trạng thái thành công!')
    }
    // ** Check tạo trạng thái nếu có lỗi
    if (!store.create.loading && store.create.error && !id && isSubmited) {
      setIsSubmited(false)
      if (store.create.data?.isValidate) {
        store.create.data?.errors.forEach(error => {
          setError(error.fieldError, { message: error.message })
        });
      } else {
        toast.error(store.create.data?.message)
      }
    }
    // ** Check cập nhật trạng thái nếu có lỗi
    if (!store.update.loading && store.update.error && id && isSubmited) {
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
    if (!store.single.loading && id && store.single.data) {
      const { name, active, description } = store.single.data;
      setValue("name", name)
      setValue("active", active)
      setValue("description", description)
      setSwitchActive(active)
    }
  }, [id, store.single.loading, store.single.data])

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className='mb-1'>
          <BreadcrumbItem>
            <Link to='/dashboard/analytics'> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to='/apps/status/list'> Trạng thái </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            <span> {id ? `Chỉnh sửa` : `Tạo mới`}</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>
            {
              !id ? "Tạo trạng thái" : "Chỉnh sửa trạng thái"
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1 col-6'>
              <Label className='form-label' for='name'>
                Tên trạng thái <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      id='name'
                      placeholder='Đang khám'
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
            <div className='mb-1 col-6'>
              <Label className='form-label' for='description'>Mô tả</Label>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, ...other } }) => (
                  <Input
                    type='textarea'
                    id='description'
                    placeholder='Mô tả'
                    value={value || ''}
                    {...other}
                  />
                )}
              />
            </div>
            <div className='mb-1 col-4'>
              <Label className='form-label' for='active'>Trạng thái</Label>
              <Controller
                name='active'
                control={control}
                render={({ field: { value, ...other } }) => (
                  <FormGroup switch {...other} value={value || true}>
                    <Input
                      type="switch"
                      style={{ cursor: 'pointer' }}
                      checked={switchActive}
                      onClick={() => {
                        setSwitchActive(!switchActive)
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
              ) : id ? <Button type="submit" className="me-1 mt-1" color="primary">Cập nhật</Button> : <Button type="submit" className="me-1 mt-1" color="primary">Tạo mới</Button>}
            <Button
              type="reset"
              color="secondary"
              className="me-1 mt-1"
              outline
              onClick={() => navigate("/apps/status/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default StatusCreate
