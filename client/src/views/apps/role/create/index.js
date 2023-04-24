// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { createRole, getRole, updateRole } from '../store'
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
  CardBody,
  Breadcrumb,
  Spinner,
  BreadcrumbItem,
  CardHeader,
  CardTitle
} from "reactstrap"

// ** Third Party
import { useForm, Controller } from "react-hook-form"
import toast from 'react-hot-toast'

const roleArr = [
  {
    title: "Bảo mật",
    roles: [
      {
        name: "Phân quyền người dùng",
        permissions: [
          "read-role",
          "create-role",
          "update-role",
          "delete-role",
          null,
          null
        ]
      }
    ]
  },
  {
    title: "Dữ liệu",
    roles: [
      {
        name: "Danh sách nhân viên",
        permissions: [
          "read-user",
          "create-user",
          "update-user",
          "delete-user",
          null,
          null
        ]
      },
      {
        name: "Hồ sơ bệnh nhân",
        permissions: [
          "read-patient",
          "create-patient",
          "update-patient",
          "delete-patient",
          null,
          null
        ]
      },
      {
        name: "Nhà cung cấp",
        permissions: [
          "read-supplier",
          "create-supplier",
          "update-supplier",
          "delete-supplier",
          null,
          null
        ]
      }
    ]
  },
  {
    title: "Danh mục",
    roles: [
      {
        name: "Mẫu lời dặn",
        permissions: [
          "read-advice",
          "create-advice",
          "update-advice",
          "delete-advice",
          null,
          null
        ]
      },
      {
        name: "Mẫu đơn thuốc",
        permissions: [
          "read-prescription",
          "create-prescription",
          "update-prescription",
          "delete-prescription",
          null,
          null
        ]
      },
      {
        name: "Vật tư",
        permissions: [
          "read-supplie",
          "create-supplie",
          "update-supplie",
          "delete-supplie",
          null,
          null
        ]
      },
      {
        name: "Nhóm vật tư",
        permissions: [
          "read-group-supplie",
          "create-group-supplie",
          "update-group-supplie",
          "delete-group-supplie",
          null,
          null
        ]
      },
      {
        name: "Nhóm thủ thuật",
        permissions: [
          "read-category-tip",
          "create-category-tip",
          "update-category-tip",
          "delete-category-tip",
          null,
          null
        ]
      },
      {
        name: "Thủ thuật",
        permissions: [
          "read-tip",
          "create-tip",
          "update-tip",
          "delete-tip",
          null,
          null
        ]
      },
    ]
  },
  {
    title: "Thiết lập",
    roles: [
      {
        name: "Trạng thái",
        permissions: [
          "read-status",
          "create-status",
          "update-status",
          "delete-status",
          null,
          null
        ]
      },
      {
        name: "Tiểu sử bệnh",
        permissions: [
          "read-medical-history",
          "create-medical-history",
          "update-medical-history",
          "delete-medical-history",
          null,
          null
        ]
      },
      {
        name: "Nguồn giới thiệu",
        permissions: [
          "read-root",
          "create-root",
          "update-root",
          "delete-root",
          null,
          null
        ]
      },
    ]
  }
]

const defaultValues = {
  name: undefined,
  description: undefined
}

const RoleCreate = () => {
  // ** States
  const [isSubmited, setIsSubmited] = useState(false)

  // ** Store Vars
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const store = useSelector(state => state.role)
  const { id } = useParams()
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({ defaultValues })

  useEffect(() => {
    if (id) {
      dispatch(getRole(id))
    }
  }, [id])

  // ** Function to handle form submit
  const onSubmit = data => {
    const permissions = Object.keys(data).filter(key => data[key] === true)
    if (!id) {
      dispatch(createRole({
        name: data.name,
        description: data.description,
        permissions
      }))
    } else {
      dispatch(updateRole({
        role_id: id,
        role: {
          name: data.name,
          description: data.description,
          permissions
        }
      }))
    }
    setIsSubmited(true)
  }

  useEffect(() => {
    // ** Tạo vai trò
    if (!store.create.loading && isSubmited && !id && !store.create.error) {
      setIsSubmited(false)
      navigate('/apps/role/list')
      toast.success('Tạo vai trò thành công!')
    }
    // ** Check tạo vai trò nếu có lỗi
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
    // ** Cập nhật vai trò
    if (!store.update.loading && isSubmited && id && !store.update.error) {
      setIsSubmited(false)
      navigate('/apps/role/list')
      toast.success('Cập nhật vai trò thành công!')
    }
    // ** Check cập nhật vai trò nếu có lỗi
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
      const { name, description, permissions } = store.single.data
      setValue('name', name)
      setValue('description', description)
      permissions?.map(permission => {
        setValue(permission, true)
      })
    }
  }, [id, dispatch, setValue, store.single.data, store.single.loading])

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className='mb-1'>
          <BreadcrumbItem>
            <Link to='/dashboard/analytics'> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to='/apps/role/list'> Quyền người dùng </Link>
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
              !id ? "Tạo quyền" : "Chỉnh sửa quyền"
            }
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 col-5">
              <Label className="form-label" for="name">Tên quyền <span className="text-danger">*</span></Label>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, ...other } }) => (
                  <Fragment>
                    <Input
                      id="name"
                      onKeyDown={() => clearErrors('name')}
                      placeholder="Ví dụ: Bác sĩ"
                      value={value || ''}
                      invalid={errors.name && true}
                      style={{ marginBottom: '0.5rem' }}
                      {...other}
                    />
                    {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                  </Fragment>
                )}
              />
            </div>
            <div className="mb-1 col-5">
              <Label className="form-label" for="description">Mô tả</Label>
              <Controller
                name="description"
                control={control}
                render={({ field: { value, ...other } }) => (
                  <Input
                    id="description"
                    value={value || ''}
                    invalid={errors.description && true}
                    {...other}
                  />
                )}
              />
            </div>
            <Col xs={12}>
              <h6 className='mt-2 mb-1'>Quyền</h6>
              {roleArr.map((item, index) => {
                return (
                  <Table hover responsive key={index}>
                    <thead>
                      <tr>
                        <th className="w-50">{item.title}</th>
                        <th className="text-center">Xem</th>
                        <th className="text-center">Thêm</th>
                        <th className="text-center">Sửa</th>
                        <th className="text-center">Xóa</th>
                        <th className="text-center">Export</th>
                        <th className="text-center">In</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.roles.map((role, index) => {
                        return (
                          <tr key={index}>
                            <td>{role.name}</td>
                            {role.permissions.map((permission, index) => {
                              if (!permission) {
                                return (
                                  <td className="text-center" key={index}> - </td>
                                )
                              } else {
                                return (
                                  <td className="text-center" key={index}>
                                    <Controller
                                      name={permission}
                                      control={control}
                                      render={({ field: { value, ...other } }) => <Input type='checkbox' checked={value || false} value={value || false} {...other} />}
                                    />
                                  </td>
                                )
                              }
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                )
              })}
            </Col>
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
              onClick={() => navigate("/apps/role/list")}
            >
              Hủy
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default RoleCreate
