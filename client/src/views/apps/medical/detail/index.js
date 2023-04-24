import React, { useEffect, useState } from "react";
import { getMedicalList } from "../../patient/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createPrescription, getMedical } from "../store";
import DataTable from "react-data-table-component";
import {
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Input,
  Button,
  CardSubtitle,
  Label,
  Form,
} from "reactstrap";
import { ChevronDown } from "react-feather";
import NoDataFound from "../../../components/NoDataFound";
import { getPrescriptionList } from "../../prescription/store";
import { Fragment } from "react";

import { column } from "./prescription";
import { column as adviceColumn } from "./advice";
import ReactPaginate from "react-paginate";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";
import { getAdviceList } from "../../advice/store";
import { Typography } from "@mui/material";
import moment from "moment";
import { toast } from "react-hot-toast";
import { currency } from '@src/utility/Utils'

const RowContent = ({ title, content, customContent }) => {
  return (
    <div className="d-flex flex-row gap-3 align-items-center justify-content-between">
      <Typography variant="h6" className="m-0 bold">
        {title}
      </Typography>
      {!customContent ? <p className="m-0">{content}</p> : <div className="d-flex flex-column">{customContent}</div>}
    </div>
  );
};

function MedicalDetail() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [modal, setModal] = useState(false);
  const [prescriptionSelected, setPrescriptionSelected] = useState(null);
  const [adviceSelected, setAdviceSelected] = useState(null);
  const [sortColumn, setSortColumn] = useState("created_at");
  const [valueSortColumn, setValueSortColumn] = useState(-1);
  const [isSubmited, setIsSubmited] = useState(false)

  const toggle = () => setModal(!modal);

  const { id } = useParams();
  const storePrescription = useSelector((state) => state.prescription);
  const storeAdvice = useSelector((state) => state.advice);
  const storeMedical = useSelector((state) => state.medical);

  const dispatch = useDispatch();

  const defaultValues = {
    advice: undefined,
    prescription: undefined,
  };

  const {
    control,
    setValue,
    setError,
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    dispatch(
      getPrescriptionList({
        page: currentPage,
        limit: rowsPerPage,
        fieldSort: sortColumn,
        sortValue: valueSortColumn,
        active: true,
      })
    );

    dispatch(
      getAdviceList({
        page: currentPage,
        limit: rowsPerPage,
        fieldSort: sortColumn,
        sortValue: valueSortColumn,
        active: true,
      })
    );
  }, [dispatch, currentPage, rowsPerPage, sortColumn, valueSortColumn]);

  useEffect(() => {
    if (id) {
      dispatch(getMedical(id));
    }
  }, [id]);

  const prescriptionOption =
    !storePrescription.list.loading &&
    storePrescription.list.data &&
    storePrescription.list.data.docs.map((item) => {
      return { value: item._id, label: item.note };
    });

  const adviceOption =
    !storeAdvice.list.loading &&
    storeAdvice.list.data &&
    storeAdvice.list.data.docs.map((item) => {
      return { value: item._id, label: item.name };
    });

  const onSubmit = (data) => {
    const { advice, prescription } = data;
    if ((advice.length || prescription.length) && id) {
      const dataSubmit = {
        advice: advice.map((item) => {
          return { id: item.value };
        }),
        prescription: prescription.map((item) => {
          return { id: item.value, note_prescription: item.label };
        }),
        medical_id: id,
      };
      dispatch(createPrescription(dataSubmit));
      setIsSubmited(true)
    }
  };

  useEffect(() => {
    // ** Thêm thành công
    if (!storeMedical.addPrescription.loading && !storeMedical.addPrescription.error && isSubmited) {
      setIsSubmited(false)
      toast.success('Thêm thành công!')
    }
  }, [storeMedical.addPrescription.loading, storeMedical.addPrescription.error])

  // ** Function in get data on page change
  const handlePagination = (page) => {
    dispatch(
      getPrescriptionList({
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
    const count = storePrescription.list?.data?.totalPages;
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

  return (
    <Fragment>
      <Breadcrumb className="mb-1">
        <BreadcrumbItem>
          <Link to="/"> Trang chủ </Link>
        </BreadcrumbItem>
        <BreadcrumbItem active>
          <span> Chi tiết đơn khám </span>
        </BreadcrumbItem>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết giấy khám</CardTitle>
        </CardHeader>
        <CardBody>
          {!storeMedical.single.loading && storeMedical.single.data && (
            <div className="w-100">
              <RowContent title="Ngày khám bệnh" content={moment(storeMedical.single.data.medical_examination_day).format("DD/MM/YYYY")} />
              <RowContent title="Bác sĩ khám" content={storeMedical.single.data.user?.name} />
              <RowContent title="Bác sĩ hỗ trợ" content={storeMedical.single.data.user_support?.name} />
              <RowContent title="Chuẩn đoán" content={storeMedical.single.data.diagnose} />
              <RowContent title="Triệu chứng" content={storeMedical.single.data.symptom} />
              <RowContent title="Thủ thuật" content={`${storeMedical.single.data.tip_id?.name_tip}`} />
              <RowContent title="Tiền sử bệnh" customContent={storeMedical.single.data.medical_history?.map((item, index) => (<p className="m-0" key={index}>{item.name}</p>))} />
              <RowContent title="Tổng hóa đơn" content={`${currency(storeMedical.single.data.total)}`} />
            </div>
          )}
        </CardBody>
      </Card>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex-column justify-content-start align-items-start">
              <CardTitle className="mb-1">Thêm lời dặn / đơn thuốc</CardTitle>
              <CardSubtitle>
                Nếu chưa có, hãy tạo trong Mẫu lời dặn, đơn thuốc!!
              </CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            <div className="row">
              <div className="mb-1 col-6">
                <Label className="form-label" for="advice">
                  Lời dặn
                </Label>
                <Controller
                  name="advice"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        isMulti
                        // isDisabled={!storeAdvice.list.loading && adviceOption.length == 0 && true}
                        options={adviceOption}
                        isClearable={false}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
              <div className="mb-1 col-6">
                <Label className="form-label" for="prescription">
                  Đơn thuốc (Ghi chú)
                </Label>
                <Controller
                  name="prescription"
                  control={control}
                  render={({ field }) => {
                    return (
                      <Select
                        theme={selectThemeColors}
                        className="react-select"
                        classNamePrefix="select"
                        isMulti
                        // isDisabled={prescriptionOption.length == 0 && true}
                        options={prescriptionOption}
                        isClearable={false}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
            </div>
            <Button type="submit" className="me-1" color="primary">
              Lưu
            </Button>
          </CardBody>
        </Card>
      </Form>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lời dặn</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              responsive
              paginationServer
              columns={adviceColumn(toggle, adviceSelected, setAdviceSelected)}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
              paginationComponent={CustomPagination}
              data={storeMedical.single.data.advice}
            />
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn thuốc</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              responsive
              paginationServer
              columns={column(
                toggle,
                prescriptionSelected,
                setPrescriptionSelected
              )}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              noDataComponent={<NoDataFound content="Không có bản ghi nào" />}
              paginationComponent={CustomPagination}
              data={storeMedical.single.data.prescription}
            />
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default MedicalDetail;
