// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { getGroupSupplie, updateGroupSupplie, createGroupSupplie } from '../store'
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
  note: undefined,
  active: true
}

const GroupSupplieCreate = () => {
  // ** States
  const [isSubmited, setIsSubmited] = useState(false)
  const [switchActive, setSwitchActive] = useState(true)

  const currentUser = JSON.parse(localStorage.getItem("userData")).name;

  // ** Store Vars
  const store = useSelector((state) => state.groupSupplie);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      dispatch(getGroupSupplie(id))
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
        createGroupSupplie({
          name: data.name,
          active: data.active,
          note: data.note,
          modified_by: currentUser
        })
      );
    } else {
      dispatch(updateGroupSupplie({
        id,
        groupSupplie: {
          name: data.name,
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
      navigate('/apps/group-supplie/list')
      toast.success('Tạo nhóm vật tư thành công!')
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
    // ** Cập nhật lời dặn
    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/group-supplie/list')
      toast.success('Cập nhật nhóm vật tư thành công!')
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
      const { name, active, note } = store.single.data;
      setValue("name", name)
      setValue("active", active)
      setValue("note", note)
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
            <Link to='/apps/group-supplie/list'> Nhóm vật tư </Link>
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
              !id ? "Tạo nhóm vật tư" : "Cập nhật nhóm vật tư"
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1 col-5'>
              <Label className='form-label' for='name'>
                Tên nhóm <span className='text-danger'>*</span>
              </Label>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      id='name'
                      placeholder='Thuốc'
                      invalid={errors.name && true}
                      value={value || ''}
                      {...other}
                    />
                    {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                  </Fragment>
                )}
              />
            </div>
            <div className='mb-1 col-5'>
              <Label className='form-label' for='note'>
                Ghi chú
              </Label>
              <Controller
                name='note'
                control={control}
                render={({ field }) => (
                  <Input
                    type='textarea'
                    id='note'
                    placeholder='ghi chú'
                    invalid={errors.note && true}
                    {...field}
                  />
                )}
              />
            </div>
            <div className='mb-1 col-4'>
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
              ) : id ? <Button type="submit" className="me-1" color="primary">Cập nhật</Button> : <Button type="submit" className="me-1" color="primary">Tạo mới</Button>
              }
            <Button
              type="reset"
              color="secondary"
              outline
              onClick={() => navigate("/apps/group-supplie/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default GroupSupplieCreate
