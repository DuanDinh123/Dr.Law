// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getPotentialList } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { NumericFormat } from 'react-number-format';

// ** Reactstrap Imports
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    CardTitle,
    CardHeader,
    Breadcrumb,
    BreadcrumbItem,
    CardText,
    Spinner
} from 'reactstrap'

// ** Custom Components
import NoDataFound from '../../../components/NoDataFound'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ limit, setLimit, value, setValue, dispatch, formattedValue, setFormattedValue }) => {
    return (
        <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
            <Row>
                <Col xl='6' className='d-flex align-items-center p-0'>
                    <div className='d-flex align-items-center w-100'>
                        <label htmlFor='rows-per-page'>Hiện thị</label>
                        <Input
                            className='mx-50'
                            type='select'
                            id='rows-per-page'
                            value={limit}
                            onChange={(e) => setLimit(e.currentTarget.value)}
                            style={{ width: '5rem' }}
                        >
                            <option value='10'>10</option>
                            <option value='25'>25</option>
                            <option value='50'>50</option>
                        </Input>
                    </div>
                </Col>
                <Col
                    xl='6'
                    className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
                >
                    <div className='d-flex align-items-center mb-sm-0 mb-1 me-1'>
                        <NumericFormat
                            customInput={Input}
                            className='ms-50 w-100'
                            thousandSeparator={true}
                            placeholder='Nhập số tiền...'
                            value={formattedValue}
                            onValueChange={(e) => {
                                setFormattedValue(e.formattedValue)
                                setValue(e.value)
                            }}
                        />
                    </div>
                    <div className='d-flex align-items-center table-header-actions'>
                        <Button color='primary' onClick={() => dispatch(getPotentialList({
                            limit,
                            value
                        }))}>Lọc</Button>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

const PotentialList = () => {
    // ** Store Vars
    const dispatch = useDispatch()
    const store = useSelector(state => state.potential)

    // ** States
    const [limit, setLimit] = useState(10)
    const [value, setValue] = useState(100000)
    const [formattedValue, setFormattedValue] = useState('1,000,000')

    // ** Get data on mount
    useEffect(() => {
        dispatch(getPotentialList({
            limit,
            value
        }))
    }, [dispatch, limit])

    // ** Table data to render
    const dataToRender = () => {
        if (!store.list.loading && store.list?.data?.length > 0) {
            return store.list.data
        }
        return []
    }

    return (
        <Fragment>
            <div className="col">
                <Breadcrumb className='mb-1'>
                    <BreadcrumbItem>
                        <Link to='/'> Trang chủ </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>Khách hàng tiềm năng</BreadcrumbItem>
                </Breadcrumb>
            </div>
            <Card className='overflow-hidden'>
                <CardHeader className="pb-0 flex-column align-items-start">
                    <CardTitle>Khách hàng tiềm năng</CardTitle>
                    <CardText>Danh sách Khách hàng tiềm năng</CardText>
                </CardHeader>
                <div className='react-dataTable'>
                    <DataTable
                        noHeader
                        subHeader
                        sortServer
                        pagination
                        responsive
                        paginationServer
                        loading={store.list.loading}
                        columns={columns()}
                        sortIcon={<ChevronDown />}
                        className='react-dataTable'
                        progressPending={store.list.loading}
                        progressComponent={<Spinner color='secondary' className="m-5" />}
                        noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
                        paginationComponent={() => <></>}
                        data={dataToRender()}
                        subHeaderComponent={
                            <CustomHeader
                                limit={limit}
                                setLimit={setLimit}
                                value={value}
                                setValue={setValue}
                                dispatch={dispatch}
                                formattedValue={formattedValue}
                                setFormattedValue={setFormattedValue}
                            />}
                    />
                </div>
            </Card>
        </Fragment>
    )
}


export default PotentialList
