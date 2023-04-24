// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Table Columns
import { columns } from "./columns";

// ** Store & Actions
import { getSupplieList, deleteSupplie, getSupplieListByGroupSupplie } from "../store";
import { getGroupSupplieList } from '../../group-supplie/store'
import { useDispatch, useSelector } from "react-redux";

// ** Third Party Components
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import {
  ChevronDown,
  Share,
  Printer,
  FileText,
  File,
  Grid,
  Copy,
  Search,
} from "react-feather";

import toast from "react-hot-toast";
// ** Utils
import { selectThemeColors } from "@utils";

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
  CardBody,
  CardTitle,
  CardText,
  InputGroup,
  InputGroupText,
} from "reactstrap";

import { Link, useNavigate } from "react-router-dom";

import makeAnimated from "react-select/animated";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import NoDataFound from "../../../components/NoDataFound";

const animatedComponents = makeAnimated();

// ** Table Header
const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleFilter,
  dispatch,
  searchTerm,
  setSearchTerm,
  dataGroupSupplie
}) => {
  const navigate = useNavigate();

  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="5" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <label htmlFor="rows-per-page">Hiển thị</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>
        </Col>
        <Col xl="7">
          <div className="d-flex">
            <InputGroup>
              <Input
                id="search-supplie"
                placeholder="Tìm kiếm theo tên ..."
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch(
                      getSupplieList({
                        search: searchTerm,
                      })
                    );
                  }
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
               <InputGroupText>
                <Search size={14} />
              </InputGroupText>
            </InputGroup>

            <Select
              isClearable={false}
              theme={selectThemeColors}
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={dataGroupSupplie}
              onChange={(e) => {
                dispatch(getSupplieListByGroupSupplie({ groupSupplie: e.value}))
              }}
              className="react-select mx-1 w-100"
              classNamePrefix="select"
            />
            <Button
              className="add-new-user"
              color="primary"
              onClick={() => navigate("/apps/supplie/create")}
            >
              Thêm
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const SupplieList = () => {
  const navigate  = useNavigate()
  const toggle = () => setModal(!modal);
  const [modal, setModal] = useState(false);
  const [nameSelected, setNameSelected] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  // ** Store Vars
  const dispatch = useDispatch();
  const store = useSelector((state) => state.supplie);
  const storeGroupSupplie = useSelector((state) => state.groupSupplie);

  // ** States
  const [sort, setSort] = useState("desc");
  const [dataGroupSupplie, setDataGroupSupplie] = useState()
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("created_at");
  const [valueSortColumn, setValueSortColumn] = useState(-1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getSupplieList({
        page: currentPage,
        limit: rowsPerPage,
        fieldSort: sortColumn,
        sortValue: valueSortColumn,
      })
    );
  }, [dispatch, currentPage, isDeleted]);

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getSupplieList({
        page: page.selected + 1,
        limit: rowsPerPage,
      })
    );
    setCurrentPage(page.selected + 1);
  };

  // ** Function in get data on rows per page
  const handlePerPage = (e) => {
    const value = parseInt(e.currentTarget.value);
    setRowsPerPage(value);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = store.list?.data?.totalPages;

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        pageCount={count || 1}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
      />
    );
  };

  // ** Table data to render
  const dataToRender = () => {
    if (!store.list.loading && store.list.data?.docs?.length > 0) {
      return store.list.data?.docs
    }
    return []
  }

  useEffect(() => {
    if (!store.delete.loading && !store.delete.error && isDeleted) {
      toggle();
      setIsDeleted(null);
      toast.success("Xóa vật tư thành công!");
    }

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
  }, [dispatch, store.delete.loading, nameSelected, store.delete.error, store.list.loading, store.list.error, isDeleted]);

  useEffect(() => {
    dispatch(getGroupSupplieList({ page: 1, limit: 100 }))
  }, [])

  useEffect(() => {
    if (!storeGroupSupplie?.list.loading && storeGroupSupplie?.list.data) {
      const groupSupplieOption = storeGroupSupplie?.list?.data?.docs?.map((item) => {
        return { value: item._id, label: item.name };
      });

      setDataGroupSupplie(groupSupplieOption)
    }
  }, [storeGroupSupplie])

  return (
    <Fragment>
      <div className="col mb-1">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/dashboard/analytics"> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Vật tư </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-0 flex-column align-items-start">
          <CardTitle>Vật tư</CardTitle>
          <CardText>Danh sách vật tư</CardText>
        </CardHeader>
        <div className="react-dataTable">
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
            columns={columns(toggle, nameSelected, setNameSelected)}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
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
                dataGroupSupplie={dataGroupSupplie ? dataGroupSupplie : null}
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
        <ModalBody>
          Bạn có chắc muốn xóa{" "}
          <span className="fw-bolder">
            {nameSelected?.name && nameSelected.name}
          </span>{" "}
          không ?
        </ModalBody>
        <ModalFooter>
          {store.delete.loading ? (
            <Button color="secondary">
              <Spinner color="light" size="sm" />
              <span className="ms-50">Đang xóa...</span>
            </Button>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setIsDeleted(true);
                dispatch(deleteSupplie(nameSelected?.id));
              }}
            > 
              Xác nhận
            </Button>
          )}{" "}
          <Button color="secondary" onClick={toggle}>
            Hủy
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default SupplieList;
