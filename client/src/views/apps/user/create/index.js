// ** React Imports
import React, { Fragment, useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

// ** Reactstrap Imports
import {
    Button,
    Label,
    Form,
    Input,
    Card,
    CardBody,
    Breadcrumb,
    Spinner,
    BreadcrumbItem,
    CardHeader,
    CardTitle
} from "reactstrap"

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { createUser, getUser, updateUser } from '../store'
import { getRoleList, getRolesByUserId } from "../../role/store"
import { getSalaryByUserId } from '../../salary/store'
import { getBankByUserId } from '../../bank/store'

// ** Third Party
import { useForm, Controller } from "react-hook-form"
import toast from 'react-hot-toast'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import moment from "moment"
import { NumericFormat } from 'react-number-format';

// ** Utility Import
import { currency } from '@src/utility/Utils'
import { selectThemeColors } from '@utils'

const defaultValues = {
    name: undefined,
    password: undefined,
    email: undefined,
    phone: undefined,
    address: undefined,
    note: undefined,
    date_of_birth: undefined,
    cardID: undefined,
    roles: [],
    wage: undefined,
    workDay: 0,
    coefficient: 1,
    bonusSale: 0,
    bonusRevenue: 0,
    allowance: 0,
    bankName: undefined,
    bankNumber: undefined,
    accountBankName: undefined

}

const animatedComponents = makeAnimated()

const UserCreate = () => {
    // ** States
    const [isSubmited, setIsSubmited] = useState(false)
    const [activeField, setActiveField] = useState(true)

    // ** Store Vars
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const store = useSelector(state => state)
    const {
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { errors }
    } = useForm({ defaultValues })
    const { id } = useParams()

    useEffect(() => {
        dispatch(getRoleList({
            page: 1,
            limit: 999
        }))
        if (id) {
            dispatch(getUser(id))
            dispatch(getSalaryByUserId(id))
            dispatch(getRolesByUserId(id))
            dispatch(getBankByUserId(id))
        }
    }, [id])

    // ** Function to handle form submit
    const onSubmit = data => {
        if (!id) {
            dispatch(createUser({
                ...data,
                wage: data?.wage ? +data.wage.replaceAll(',', '') : 0,
                active: activeField,
                roleIds: data.roles.map(role => role.value)
            }))
        } else {
            dispatch(updateUser({
                ids: {
                    userId: id,
                    bankId: store.bank.bankByUserId?.data?._id,
                    salaryId: store.salary.salaryByUserId?.data?._id
                },
                user: {
                    ...data,
                    wage: data?.wage ? +data.wage.replaceAll(',', '') : 0,
                    active: activeField,
                    roleIds: data.roles.map(role => role.value)
                }
            }))
        }
        setIsSubmited(true)
    }

    useEffect(() => {
        // ** Cập nhật người dùng
        if (!store.user.update.loading && isSubmited && id && !store.user.update.error) {
            setIsSubmited(false)
            navigate('/apps/user/list')
            toast.success('Cập nhật người dùng thành công!')
        }
        // ** Tạo người dùng
        if (!store.user.create.loading && isSubmited && !id && !store.user.create.error) {
            setIsSubmited(false)
            navigate('/apps/user/list')
            toast.success('Tạo người dùng thành công!')
        }
        // ** Check tạo người dùng nếu có lỗi
        if (!store.user.create.loading && isSubmited && !id && store.user.create.error) {
            setIsSubmited(false)
            if (store.user.create.data?.isValidate) {
                store.user.create.data?.errors.forEach(error => {
                    setError(error.fieldError, { message: error.message })
                });
            } else {
                toast.error(store.user.create.data?.message)
            }
        }
        // ** Check cập nhật người dùng nếu có lỗi
        if (!store.user.update.loading && isSubmited && id && store.user.update.error) {
            setIsSubmited(false)
            if (store.user.update.data?.isValidate) {
                store.user.update.data?.errors.forEach(error => {
                    setError(error.fieldError, { message: error.message })
                });
            } else {
                toast.error(store.user.update.data?.message)
            }
        }
    }, [
        id,
        store.user.create.loading,
        store.user.create.error,
        isSubmited,
        store.user.update.loading,
        store.user.update.error
    ])

    const radioOnChange = (e) => {
        setActiveField(e.target.value === 'true')
    }

    useEffect(() => {
        if (!store.user.single.loading && id && store.user.single.data) {
            const { cardID, date_of_birth, email, name, note, phone, address, active } = store.user.single.data
            setValue("cardID", cardID)
            setValue("address", address)
            setValue("date_of_birth", moment(date_of_birth).locale('en').format('YYYY-MM-DD'))
            setValue("email", email)
            setValue("name", name)
            setValue("note", note)
            setValue("phone", phone)
            setActiveField(active)
        }
        if (!store.salary.salaryByUserId.loading && id && store.salary.salaryByUserId.data) {
            const { allowance, bonus_revenue, bonus_sale, wage, work_day } = store.salary.salaryByUserId.data
            setValue("allowance", allowance)
            setValue("bonusRevenue", bonus_revenue)
            setValue("bonusSale", bonus_sale)
            setValue("wage", wage)
            setValue("workDay", work_day)
        }
        if (!store.role.rolesByUserId.loading && id && store.role.rolesByUserId.data) {
            setValue("roles", store.role.rolesByUserId?.data.map((item) => {
                return {
                    value: item.role_id._id,
                    label: item.role_id.name
                }
            }))
        }
        if (!store.bank.bankByUserId.loading && id && store.bank.bankByUserId.data) {
            const { account_number, bank_name, name } = store.bank.bankByUserId?.data
            setValue('bankName', bank_name)
            setValue("bankNumber", account_number)
            setValue("accountBankName", name)
        }
    }, [
        id,
        setValue,
        store.user.single.loading,
        store.user.single.data,
        store.salary.salaryByUserId.loading,
        store.salary.salaryByUserId.data,
        store.salary.salaryByUserId.loading,
        store.salary.salaryByUserId.data,
        store.role.rolesByUserId.loading,
        store.role.rolesByUserId.data,
        store.bank.bankByUserId.loading,
        store.bank.bankByUserId.data,
        dispatch
    ])

    const renderRoles = (value) => {
        if (id && !store.role.rolesByUserId.loading && id && store.role.rolesByUserId.data && value) {
            if (!store.role.list.loading && store.role.list?.data?.docs?.length > 0) {
                const roles = store.role.list?.data?.docs.filter((role) => {
                    return !value.some((val) => {
                        return role._id === val.value
                    })
                })
                return roles.map((role) => {
                    return {
                        value: role._id,
                        label: role.name,
                    }
                })
            }
        } else if (!store.role.list.loading && store.role.list?.data?.docs?.length > 0) {
            return store.role.list?.data?.docs.map((role) => {
                return {
                    value: role._id,
                    label: role.name,
                }
            })
        }
    }

    return (
        <Fragment>
            <div className="col">
                <Breadcrumb className='mb-1'>
                    <BreadcrumbItem>
                        <Link to='/'> Trang chủ </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <Link to='/apps/user/list'> Danh sách nhân viên </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        {id ? <span>Cập nhật</span> : <span> Tạo mới </span>}
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {
                            !id ? "Tạo mới người dùng" : "Chỉnh sửa người dùng"
                        }
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-1">
                            <Label className="form-label" for="name">Họ và tên <span className="text-danger">*</span></Label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, ...other } }) => (
                                    <Fragment>
                                        <Input
                                            id="name"
                                            type='text'
                                            style={{ marginBottom: '0.5rem' }}
                                            placeholder="Ví dụ: Nguyễn Văn A..."
                                            value={value || ''}
                                            invalid={errors?.name && true}
                                            {...other}
                                        />
                                        {errors?.name ? <span className="text-danger">{errors.name?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.name.message}</span> : null}
                                    </Fragment>
                                )}
                            />
                        </div>
                        <div className="mb-1">
                            <Label className="form-label" for="email">Email <span className="text-danger">*</span></Label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { value, ...other } }) => (
                                    <Fragment>
                                        <Input
                                            id="email"
                                            placeholder="nguyenvana123@gmail.com"
                                            invalid={errors?.email && true}
                                            value={value || ''}
                                            style={{ marginBottom: '0.5rem' }}
                                            type="email"
                                            {...other}
                                        />
                                        {errors?.email ? <span className="text-danger">{errors.email?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.email.message}</span> : null}
                                    </Fragment>
                                )}
                            />
                        </div>
                        {!id && (
                            <div className="mb-1">
                                <Label className="form-label" for="password">Mật khẩu <span className="text-danger">*</span></Label>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, ...other } }) => (
                                        <Fragment>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={value || ''}
                                                style={{ marginBottom: '0.5rem' }}
                                                invalid={errors?.password && true}
                                                {...other}
                                            />
                                            {errors?.password ? <span className="text-danger">{errors.password?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.password.message}</span> : null}
                                        </Fragment>
                                    )}
                                />
                            </div>
                        )}
                        <div className="mb-1 d-flex">
                            {/* Điện thoại */}
                            <div className="me-2">
                                <Label className="form-label" for="phone">Điện thoại</Label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ maxLength: 10 }}
                                    render={({ field: { value, ...other } }) => (
                                        <Fragment>
                                            <Input
                                                id="phone"
                                                type="text"
                                                invalid={errors?.phone && true}
                                                style={{ marginBottom: '0.5rem' }}
                                                value={value || ''}
                                                {...other}
                                            />
                                            {errors?.phone ? <span className="text-danger">"Sai định dạng!"</span> : null}
                                        </Fragment>
                                    )}
                                />
                            </div>
                            <div className="w-100">
                                {/* Địa chỉ */}
                                <Label className="form-label" for="address">Địa chỉ</Label>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="address"
                                            type="text"
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="mb-1 d-flex">
                            <div className="me-2">
                                <div className="d-flex">
                                    <div className="me-1">
                                        <Input
                                            id="active"
                                            value={true}
                                            checked={activeField}
                                            onChange={radioOnChange}
                                            type='radio'
                                        />
                                        <Label className='form-check-label ps-25 mb-0' for='active'>Đang làm</Label>
                                    </div>
                                    <div>
                                        <Input
                                            id="deactive"
                                            value={false}
                                            checked={!activeField && true}
                                            onChangeCapture={radioOnChange}
                                            type='radio'
                                        />
                                        <Label className='form-check-label ps-25 mb-0' for='deactive'>Nghỉ việc</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-1 d-flex">
                            {/* Ngày sinh */}
                            <div className="me-2">
                                <Label className="form-label" for="date_of_birth">Ngày sinh</Label>
                                <Controller
                                    name="date_of_birth"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="date_of_birth"
                                            value={value || ''}
                                            type='date'
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                            {/* CMT */}
                            <div className="w-50">
                                <Label className="form-label" for="cardID">CMT <span className="text-danger">*</span></Label>
                                <Controller
                                    name="cardID"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Fragment>
                                            <Input
                                                id="cardID"
                                                type='text'
                                                style={{ marginBottom: '0.5rem' }}
                                                invalid={errors.cardID && true}
                                                value={value || ''}
                                                {...other}
                                            />
                                            {errors?.cardID ? <span className="text-danger">{errors.cardID?.type === 'required' ? "Trường này bắt buộc nhập!" : errors.cardID.message}</span> : null}
                                        </Fragment>
                                    )}
                                />
                            </div>
                        </div>
                        {/* Lương */}
                        <div className="mb-1 d-flex">
                            <div className="me-1">
                                <Label className="form-label" for="wage">Lương cơ bản</Label>
                                <Controller
                                    name="wage"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <NumericFormat
                                            customInput={Input}
                                            thousandSeparator={true}
                                            id="wage"
                                            placeholder={currency(1000000)}
                                            value={value || ''}
                                            {...other}
                                        />

                                    )}
                                />
                            </div>
                            <div className="me-1">
                                <Label className="form-label" for="workDay">Ngày công</Label>
                                <Controller
                                    name="workDay"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="workDay"
                                            type="number"
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Label className="form-label" for="coefficient">Hệ số</Label>
                                <Controller
                                    name="coefficient"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="coefficient"
                                            type="number"
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {/* Thưởng */}
                        <div className="mb-1 d-flex">
                            <div className="me-1">
                                <Label className="form-label" for="bonusSale">Doanh số (%)</Label>
                                <Controller
                                    name="bonusSale"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="bonusSale"
                                            type="number"
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                            <div className="me-1">
                                <Label className="form-label" for="bonusRevenue">Doanh thu (%)</Label>
                                <Controller
                                    name="bonusRevenue"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="bonusRevenue"
                                            type="number"
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Label className="form-label" for="allowance">Phụ cấp</Label>
                                <Controller
                                    name="allowance"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="allowance"
                                            type="number"
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {/* Tài khoản - bank */}
                        <div className="mb-1 d-flex">
                            <div className="me-1 w-25">
                                <Label className="form-label" for="accountBankName">Tên tài khoản</Label>
                                <Controller
                                    name="accountBankName"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="accountBankName"
                                            value={value || ''}
                                            type='text'
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                            <div className="me-1">
                                <Label className="form-label" for="bankNumber">Số tài khoản</Label>
                                <Controller
                                    name="bankNumber"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="bankNumber"
                                            type='text'
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                            <div className="flex-fill">
                                <Label className="form-label" for="bankName">Tên ngân hàng</Label>
                                <Controller
                                    name="bankName"
                                    control={control}
                                    render={({ field: { value, ...other } }) => (
                                        <Input
                                            id="bankName"
                                            type='text'
                                            value={value || ''}
                                            {...other}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {/* Vai trò */}
                        <div className="mb-1">
                            <Label className='form-label'>Vai trò</Label>
                            <Controller
                                name="roles"
                                control={control}
                                render={({ field: { value, ...other } }) => (
                                    <Select
                                        isClearable={false}
                                        theme={selectThemeColors}
                                        closeMenuOnSelect={false}
                                        components={animatedComponents}
                                        isMulti
                                        options={renderRoles(value)}
                                        className='react-select'
                                        classNamePrefix='select'
                                        value={value || []}
                                        {...other}
                                    />
                                )}
                            />
                        </div>
                        {/* Ghi chú */}
                        <div className="mb-1">
                            <Label className="form-label" for="note">Ghi chú</Label>
                            <Controller
                                name="note"
                                control={control}
                                render={({ field: { value, ...other } }) => (
                                    <Input
                                        id="note"
                                        type="textarea"
                                        value={value || ''}
                                        {...other}
                                    />
                                )}
                            />
                        </div>
                        {
                            id && store.user.update.loading ? (
                                <Button color='secondary' className="me-1 mt-1">
                                    <Spinner color='light' size='sm' />
                                    <span className='ms-50'>Đang cập nhật mới...</span>
                                </Button>
                            ) : store.user.create.loading ? (
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
                            onClick={() => navigate("/apps/user/list")}
                        >
                            Hủy
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default UserCreate


{/* <Input
                                            id="wage"
                                            type="number"
                                            placeholder={currency(1000000)}
                                            value={value || ''}
                                            {...other}
                                        /> */}