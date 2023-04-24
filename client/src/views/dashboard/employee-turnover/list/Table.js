// ** React Imports
import { Fragment, useState, useEffect, useRef } from 'react'

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getReportEmployee } from '../../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import { ChevronDown, FileText, Grid, Printer } from 'react-feather'
import * as XLSX from 'xlsx'
import FileSaver from "file-saver";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Form,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ handlePerPage, dispatch, searchTerm, setSearchTerm }) => {
  const defaultValues = {
    startDate: "",
    endDate: "",
  };
  // ** Vars\
  const onSubmit = (data) => {
    dispatch(getReportEmployee(data))
  }
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors }
  } = useForm({ defaultValues })

  return (
    <div className='invoice-list-table-header mb-75'>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* <Row className=''> */}
        <div className='d-flex justify-content-end'>
          <div className='mx-1'>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  {...field}
                />
              )}
            />
          </div>
          <div className='px-1'>
            <Button className='' type='submit' color='primary'>
              Lọc
            </Button>
          </div>
        </div>

        {/* </Row> */}
      </Form>
    </div>
  )
}

const RevenueList = () => {
  const tableRef = useRef()

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  // ** Store Vars
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const store = useSelector(state => state.dashboard)
  // ** States
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // ** Get data on mount
  useEffect(() => {
    dispatch(getReportEmployee({}))
  }, [])

  const handleExport = () => {
    try {
      if (store?.list.data) {
        let dataExport = []

        store?.list.data && store?.list.data.map(item => {
          dataExport.push({
            user: item.user.name,
            revenue: item.revenue,
            total_collected: item.total_collected,
            attrition: item.attrition,
            total_money: item.total_money,
            percentage_bonus: item.percentage_bonus,
            revenue_bonus: item.revenue_bonus
          })
        })

        const fields = [{
          user: "Tên nhân viên",
          revenue: "Doanh số",
          total_collected: "Đã thu",
          attrition: "Tiêu hao",
          total_money: "Tổng tiền",
          percentage_bonus: "Thưởng (%)",
          revenue_bonus: "Thưởng doanh thu"
        }]

        const fieldData = Object.keys(dataExport[0])
        const file = `doanh_thu_nhan_vien.xlsx`

        const ws = XLSX.utils.json_to_sheet(fields, {
          header: fieldData,
          skipHeader: true,
          origin: 0
        });

        XLSX.utils.sheet_add_json(ws, dataExport, {
          header: fieldData,
          skipHeader: true,
          origin: -1 //ok
        });
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: 'xlsx' });

        FileSaver.saveAs(data, file);
      } else {
        toast.error("Có lỗi xin thử lại sau");
      }
    } catch (error) {
      toast.error("Có lỗi xin thử lại sau");
    }
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (!store?.list.loading) {
      return store?.list.data
    } else {
      return []
    }
  }

  return (
    <Fragment>

      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            innerRef={tableRef}
            noHeader
            subHeader
            sortServer
            responsive
            columns={columns()}
            // onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            noDataComponent="Không có bản ghi nào"
            paginationComponent={null}
            data={dataToRender()}
            subHeaderComponent={
              <div className='w-100 d-flex justify-content-end'>
                <CustomHeader
                  store={store}
                  toggleSidebar={toggleSidebar}
                  setSearchTerm={setSearchTerm}
                  searchTerm={searchTerm}
                  dispatch={dispatch}
                />
                  <div className=''>
                    <Button color='primary' onClick={() => handleExport()}>
                      Xuất Excel
                    </Button>
                  </div>
              </div>

            }
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default RevenueList
