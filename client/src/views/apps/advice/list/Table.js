// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getAdviceList, deleteAdvice } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Printer, FileText, File, Grid, Copy } from 'react-feather'
import toast from 'react-hot-toast'

// ** Utils
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardTitle,
  CardText
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import NoDataFound from '../../../components/NoDataFound'

// ** Table Header
const CustomHeader = ({ store, handlePerPage, rowsPerPage, dispatch, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate()

  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Hiển thị</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
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
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              placeholder='Tìm kiếm'
              type='text'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  dispatch(getAdviceList({
                    search: searchTerm
                  }))
                }
              }}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='d-flex align-items-center table-header-actions'>
            {/* <UncontrolledDropdown className='me-1'>
              <DropdownMenu>
                <DropdownItem className='w-100'>
                  <Printer className='font-small-4 me-50' />
                  <span className='align-middle'>Print</span>
                </DropdownItem>
                <DropdownItem className='w-100' onClick={() => downloadCSV(store.data)}>
                  <FileText className='font-small-4 me-50' />
                  <span className='align-middle'>CSV</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Grid className='font-small-4 me-50' />
                  <span className='align-middle'>Excel</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <File className='font-small-4 me-50' />
                  <span className='align-middle'>PDF</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Copy className='font-small-4 me-50' />
                  <span className='align-middle'>Copy</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown> */}
            <Button className='add-new-user' color='primary' onClick={() => navigate('/apps/advice/create')}>
              Thêm
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const AdviceList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.advice)
  const navigate = useNavigate()

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [valueSortColumn, setValueSortColumn] = useState(-1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [modal, setModal] = useState(false)
  const [adviceSelected, setAdviceSelected] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)

  const toggle = () => setModal(!modal)

  // ** Get data on mount
  useEffect(() => {
    dispatch(getAdviceList({
      page: currentPage,
      limit: rowsPerPage,
      fieldSort: sortColumn,
      sortValue: valueSortColumn
    }))
  }, [dispatch, currentPage, rowsPerPage, sortColumn, valueSortColumn, isDeleted])

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(getAdviceList({
      page: page.selected + 1,
      limit: rowsPerPage
    }))
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = store.list?.data?.totalPages

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    if (!store.list.loading && store.list.data?.docs?.length > 0) {
      return store.list.data?.docs
    }
    return []
  }

  useEffect(() => {
    // ** Xóa lời dặn
    if (!store.delete.loading && !store.delete.error && isDeleted) {
      toggle()
      setIsDeleted(false)
      toast.success('Xóa lời dặn thành công!')
    }
    // ** Check xóa lời dặn có lỗi
    if (!store.delete.loading && store.delete.error && isDeleted) {
      toggle()
      setIsDeleted(false)
      toast.error(store.delete.data?.message)
    }
    // ** Check hiển thị list lời dặn nếu có lỗi
    if (!store.list.loading && store.list.error) {
      toast.error(store.list.data?.message)
      navigate('/')
    }
  }, [
    dispatch,
    store.delete.loading,
    store.delete.error,
    store.list.loading,
    store.list.error,
    isDeleted
  ])

  return (
    <Fragment>
      <div className="col">
        <Breadcrumb className="mb-1">
          <BreadcrumbItem>
            <Link to="/dashboard/analytics"> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Lời dặn </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card className='overflow-hidden'>
        <CardHeader className="pb-0 flex-column align-items-start">
          <CardTitle>Lời dặn</CardTitle>
          <CardText>Danh sách lời dặn</CardText>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            customStyles={{
              tableWrapper: {
                style: {
                  minHeight: "200px",
                }
              }
            }}
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns(toggle, adviceSelected, setAdviceSelected)}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            progressPending={store.list.loading}
            progressComponent={<Spinner color='secondary' className="m-5" />}
            noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                dispatch={dispatch}
                rowsPerPage={rowsPerPage}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Cảnh báo!</ModalHeader>
        <ModalBody>Bạn có chắc muốn xóa <span className="fw-bolder">{adviceSelected?.name && adviceSelected.name}</span> không ?</ModalBody>
        <ModalFooter>
          {
            store.delete.loading ? (
              <Button color='secondary'>
                <Spinner color='light' size='sm' />
                <span className='ms-50'>Đang xóa...</span>
              </Button>
            ) : <Button color="primary" onClick={() => {
              setIsDeleted(true)
              dispatch(deleteAdvice(adviceSelected?.id))
            }}>Xác nhận</Button>
          }
          {' '}
          <Button color="secondary" onClick={toggle}>Hủy</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default AdviceList
