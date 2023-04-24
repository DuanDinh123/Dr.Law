// ** React Imports
import React, { Fragment, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Store & Actions
import { getMedicalHistory, updateMedicalHistory, createMedicalHistory } from '../store'
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
    FormGroup,
    CardTitle
} from "reactstrap"

// ** Third Party
import { useForm, Controller } from "react-hook-form"
import toast from 'react-hot-toast'

const defaultValues = {
    name: undefined,
    active: true,
    description: undefined,
}

const MedicalHistoryCreate = () => {
    // ** States
    const [isSubmited, setIsSubmited] = useState(false)
    const [switchActive, setSwitchActive] = useState(true)

    const currentUser = JSON.parse(localStorage.getItem("userData")).name;

    // ** Store Vars
    const store = useSelector((state) => state.medicalHistory);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            dispatch(getMedicalHistory(id))
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
                createMedicalHistory({
                    name: data.name,
                    description: data.description,
                    active: data.active,
                })
            )
        } else {
            dispatch(updateMedicalHistory({
                id,
                medicalHistory: {
                    name: data.name,
                    description: data.description,
                    active: data.active,
                }
            }))
        }
        setIsSubmited(true)
    };

    useEffect(() => {
        // ** Tạo tiểu sử
        if (!store.create.loading && isSubmited && !id && !store.create.error) {
            setIsSubmited(false)
            navigate('/apps/medical-history/list')
            toast.success('Tạo tiểu sử công!')
        }
        // ** Check tạo tiểu sử nếu có lỗi
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
        // ** Cập nhật tiểu sử
        if (!store.update.loading && isSubmited && id && !store.update.error) {
            setIsSubmited(false)
            navigate('/apps/medical-history/list')
            toast.success('Cập nhật tiểu sử thành công!')
        }
        // ** Check cập nhật tiểu sử nếu có lỗi
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
                        <Link to='/apps/medical-history/list'> Tiểu sử </Link>
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
                            !id ? "Tạo tiểu sử" : "Chỉnh sửa tiểu sử"
                        }
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-1 col-6'>
                            <Label className='form-label' for='name'>
                                Tên tiểu sử <span className='text-danger'>*</span>
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
                            onClick={() => navigate("/apps/medical-history/list")}
                        >
                            Hủy
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default MedicalHistoryCreate
