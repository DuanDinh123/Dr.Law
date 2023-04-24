// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getRoleList, deleteRole } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import toast from 'react-hot-toast'

// ** Custom Component
import NoDataFound from '../../../components/NoDataFound'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Modal,
  Button,
  CardTitle,
  CardHeader,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  CardText,
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ rowsPerPage, handlePerPage }) => {
  // ** Vars
  const navigate = useNavigate()

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
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'>
          <div className='d-flex align-items-center table-header-actions'>
            <Button className='add-new-role ' color='primary' onClick={() => navigate('/apps/role/create')}>Thêm quyền</Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const RoleList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.role)

  // ** Vars
  const navigate = useNavigate()

  // ** States
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [modal, setModal] = useState(false)
  const [roleSelected, setRoleSelected] = useState(null)
  const [isDeleted, setIsDeleted] = useState(false)

  const toggle = () => setModal(!modal)

  // ** Get data on mount
  useEffect(() => {
    dispatch(getRoleList({
      page: currentPage,
      limit: rowsPerPage
    }))
  }, [dispatch, rowsPerPage, currentPage, isDeleted])

  useEffect(() => {
    // ** Xóa quyền
    if (!store.delete.loading && !store.delete.error && isDeleted) {
      toggle()
      toast.success('Xóa vai trò thành công!')
      setIsDeleted(false)
    }
    // ** Check xóa quyền nếu có lỗi
    if (!store.delete.loading && store.delete.error && isDeleted) {
      toggle()
      setIsDeleted(false)
      toast.error(store.delete.data?.message)
    }
    // ** Check hiển thị list quyền nếu có lỗi
    if (!store.list.loading && store.list.error) {
      toast.error(store.list.data?.message)
      navigate('/')
    }
  }, [
    dispatch,
    isDeleted,
    store.delete.loading,
    store.delete.error,
    store.list.loading,
    store.list.error,
    currentPage,
    rowsPerPage
  ])

  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(getRoleList({
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
    if (!store.list.loading && store.list?.data?.docs?.length > 0) {
      return store.list.data?.docs
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
          <BreadcrumbItem active>
            Phân quyền
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card className='overflow-hidden'>
        <CardHeader className="pb-0 flex-column align-items-start">
          <CardTitle>Phân quyền</CardTitle>
          <CardText>Danh sách quyền</CardText>
        </CardHeader>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            customStyles={{
              tableWrapper: {
                style: {
                  minHeight: "200px",
                }
              }
            }}
            paginationServer
            loading={store.list.loading}
            progressPending={store.list.loading}
            progressComponent={<Spinner color='secondary' className="m-5" />}
            columns={columns(toggle, roleSelected, setRoleSelected)}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={<CustomHeader rowsPerPage={rowsPerPage} handlePerPage={handlePerPage} />}
          />
        </div>
      </Card>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}>Cảnh báo!</ModalHeader>
        <ModalBody>Bạn có chắc muốn xóa quyền <span className="fw-bolder">{roleSelected?.name && roleSelected.name}</span> này không ?</ModalBody>
        <ModalFooter>
          {
            store.delete.loading ? (
              <Button color='secondary'>
                <Spinner color='light' />
                <span className='ms-50'>Đang xóa...</span>
              </Button>
            ) : <Button color="primary" onClick={() => {
              setIsDeleted(true)
              dispatch(deleteRole(roleSelected?.id))
            }}>Xác nhận</Button>
          }
          {' '}
          <Button color="secondary" onClick={toggle}>Hủy</Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}


export default RoleList
