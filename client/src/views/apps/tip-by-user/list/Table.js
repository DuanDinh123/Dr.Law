// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'
import toast from 'react-hot-toast'

// ** Reactstrap Imports
import {
  Card,
  CardTitle,
  CardHeader,
  BreadcrumbItem,
  Breadcrumb,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { getTipByUser } from '../store'

const TipByUser = () => {
  const [modal, setModal] = useState(false);
  const [listBody, setListBody] = useState();
  
  console.log(listBody);
  const toggle = (props) => {
    setListBody(props)
    setModal(!modal)
  };

  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.tipByUser)
  const navigate = useNavigate()


  useEffect(() => {
    dispatch(getTipByUser())
  },[])

  // ** Table data to render
  const dataToRender = () => {
    if (!store.list.loading && store.list?.data?.result) {
      return store.list.data.result
    }
  }

  return (
    <Fragment>
        <div className="col">
        <Breadcrumb className='mb-1'>
          <BreadcrumbItem>
            <Link to='/'> Trang chủ </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>
           Chi tiết thủ thuật
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
        {
            !store.list.loading ?  (
                <Card className='overflow-hidden'>
                <CardHeader className="pb-0 flex-column align-items-start">
                  <CardTitle>CHI TIẾT THỦ THUẬT THEO NHÂN VIÊN</CardTitle>
                </CardHeader>
                <div className='react-dataTable'>
                  <DataTable
                    noHeader
                    subHeader
                    sortServer
                    responsive
                    customStyles={{
                      tableWrapper: {
                        style: {
                          minHeight: "200px",
                        }
                      }
                    }}
                    columns={columns(toggle, modal, setListBody)}
                    sortIcon={<ChevronDown />}
                    className='react-dataTable'
                    noDataComponent="Không có bản ghi nào"
                    paginationComponent={null}
                    data={dataToRender()}
                  />
                </div>
              </Card>
            ) : <Spinner size={'medium'} />
        }
      
      <Modal isOpen={modal} toggle={toggle} size='lg'>
        <ModalHeader toggle={toggle}>Danh sách thủ thuật</ModalHeader>
        <ModalBody>
          <div className='mb-1 font-weight-bold ' style={{fontWeight: "bold"}}>STT - Tên thủ thuật</div>
         {
            listBody && listBody.length > 0 && listBody.map((item, index) => (
            
             <div>{`${index + 1} - ${item.name_tip}`}</div>
             ))
            }
            </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default TipByUser
