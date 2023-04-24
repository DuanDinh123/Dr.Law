// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { getAdvice, updateAdvice, createAdvice } from '../store'
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

const defaultValues = {
  name: undefined,
  sample_content: undefined,
  note: undefined,
  active: true
}

const AdviceCreate = () => {
  // ** States
  const [isSubmited, setIsSubmited] = useState(false)
  const [switchActive, setSwitchActive] = useState(true)

  const currentUser = JSON.parse(localStorage.getItem("userData")).name;

  // ** Store Vars
  const store = useSelector((state) => state.advice);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getAdvice(id))
    }
  }, [id])

  const {
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** Function to handle form submit
  const onSubmit = (data) => {
    if (!id) {
      dispatch(
        createAdvice({
          name: data.name,
          sample_content: data.sample_content,
          active: data.active,
          note: data.note,
        })
      )
    } else {
      dispatch(updateAdvice({
        id,
        advice: {
          name: data.name,
          sample_content: data.sample_content,
          active: data.active,
          note: data.note,
        }
      }))
    }
    setIsSubmited(true)
  };

  useEffect(() => {
    // ** Tạo lời dặn
    if (!store.create.loading && isSubmited && !id && !store.create.error) {
      setIsSubmited(false)
      navigate('/apps/advice/list')
      toast.success('Tạo lời dặn thành công!')
    }
    // ** Check tạo lời dặn nếu có lỗi
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
    // ** Cập nhật lời dặn
    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/advice/list')
      toast.success('Cập nhật lời dặn thành công!')
    }
    // ** Check cập nhật lời dặn nếu có lỗi
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
      const { name, active, note, sample_content } = store.single.data;
      setValue("name", name)
      setValue("active", active)
      setValue("note", note)
      setValue("sample_content", sample_content)
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
            <Link to='/apps/advice/list'> Lời dặn </Link>
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
              !id ? "Tạo lời dặn" : "Chỉnh sửa lời dặn"
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1 col-6'>
              <Label className='form-label' for='name'>
                Tên lời dặn <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      id='name'
                      placeholder='Lời dặn'
                      onKeyDown={() => clearErrors('name')}
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
              <Label className='form-label' for='sample_content'>
                Nội dung mẫu <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='sample_content'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      type='textarea'
                      id='sample_content'
                      placeholder='Nội dung mẫu'
                      onKeyDown={() => clearErrors('sample_content')}
                      style={{ marginBottom: '0.5rem' }}
                      value={value || ''}
                      invalid={errors.sample_content && true}
                      {...other}
                    />
                    {errors?.sample_content ? <span className="text-danger">{errors.sample_content?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.sample_content.message}</span> : null}
                  </Fragment>
                )}
              />
            </div>
            <div className='mb-1 col-6'>
              <Label className='form-label' for='note'>
                Ghi chú
              </Label>
              <Controller
                name='note'
                control={control}
                render={({ field: { value, ...other } }) => (
                  <Input
                    type='textarea'
                    id='note'
                    placeholder='Ghi chú'
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
              ) : id ? <Button type="submit" className="me-1 mt-1" color="primary">Cập nhật</Button> : <Button type="submit" className="me-1 mt-1" color="primary">Tạo mới</Button>
              }
            <Button
              type="reset"
              color="secondary"
              outline
              className="me-1 mt-1"
              onClick={() => navigate("/apps/advice/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default AdviceCreate
